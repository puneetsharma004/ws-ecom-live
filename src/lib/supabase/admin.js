import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client — BYPASSES RLS. Use ONLY in trusted server code
// (checkout, webhooks, admin mutations). Never import into client components.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
