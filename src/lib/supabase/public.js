import "server-only";
import { createClient } from "@supabase/supabase-js";

// Anon, cookie-less Supabase client for PUBLIC catalog reads. Because it doesn't
// touch cookies, pages that use it can be statically cached / ISR'd (fast) instead
// of being forced into per-request dynamic rendering. RLS still applies as `anon`.
let cached;

export function createPublicClient() {
  if (!cached) {
    cached = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return cached;
}
