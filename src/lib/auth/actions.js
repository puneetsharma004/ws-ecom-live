"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const credentials = z.object({
  email: z.email("Enter a valid email address.").max(254),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

function configured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

const NOT_CONFIGURED =
  "Authentication isn't configured yet. Add your Supabase keys to .env.local.";

export async function login(_prevState, formData) {
  if (!configured()) return { error: NOT_CONFIGURED };

  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const next = String(formData.get("next") || "/account");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  redirect(next);
}

export async function signup(_prevState, formData) {
  if (!configured()) return { error: NOT_CONFIGURED };

  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const fullName = String(formData.get("full_name") || "").trim();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...parsed.data,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: error.message };

  // When email confirmation is enabled, there's no session yet.
  if (!data.session) {
    return {
      message: "Check your email to confirm your account, then sign in.",
    };
  }

  redirect("/account");
}

export async function signout() {
  if (configured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
