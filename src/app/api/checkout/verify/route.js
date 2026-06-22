import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { safeEqual } from "@/lib/signature";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const schema = z.object({
  orderId: z.uuid(),
  razorpay_order_id: z.string().min(1).max(120),
  razorpay_payment_id: z.string().min(1).max(120),
  razorpay_signature: z.string().min(1).max(256),
});

export async function POST(request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const ssr = await createClient();
  const {
    data: { user },
  } = await ssr.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (
    !rateLimit({ key: `verify:${user.id}`, limit: 30, windowMs: 600_000 }).ok
  ) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = parsed.data;

  // Verify the signature Razorpay returned to the client.
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (!safeEqual(expected, razorpay_signature)) {
    return NextResponse.json(
      { error: "Payment verification failed." },
      {
        status: 400,
      },
    );
  }

  // Confirm the order is this user's and matches the Razorpay order.
  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, user_id, razorpay_order_id")
    .eq("id", orderId)
    .maybeSingle();

  if (
    !order ||
    order.user_id !== user.id ||
    order.razorpay_order_id !== razorpay_order_id
  ) {
    return NextResponse.json({ error: "Order mismatch." }, { status: 400 });
  }

  // Idempotent: marks paid + decrements stock (no-op if already paid).
  await admin.rpc("mark_order_paid", {
    p_order_id: order.id,
    p_payment_id: razorpay_payment_id,
  });

  return NextResponse.json({ ok: true, orderId: order.id });
}
