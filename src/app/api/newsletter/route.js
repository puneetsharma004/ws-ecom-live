import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({ email: z.email().max(254) });

export async function POST(request) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      { error: "Newsletter is not configured yet." },
      { status: 503 },
    );
  }

  if (
    !rateLimit({
      key: `newsletter:${getClientIp(request)}`,
      limit: 5,
      windowMs: 600_000,
    }).ok
  ) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    return NextResponse.json(
      { error: "Could not subscribe right now. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "You're on the list! 🎉" });
}
