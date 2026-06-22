-- =============================================================================
-- Security / RLS audit — run in the Supabase SQL editor and eyeball the results.
-- This is a read-only checklist; it changes nothing.
-- =============================================================================

-- 1) RLS must be ENABLED on every public table (rls_enabled = true for all).
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relnamespace = 'public'::regnamespace and relkind = 'r'
order by relname;

-- 2) Any public table WITHOUT RLS? (This query should return ZERO rows.)
select relname as table_without_rls
from pg_class
where relnamespace = 'public'::regnamespace
  and relkind = 'r'
  and relrowsecurity = false;

-- 3) Every table's policies (sanity-check who can read/write what).
select tablename, policyname, cmd, roles, qual is not null as has_using
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 4) mark_order_paid must NOT be executable by anon/authenticated.
--    Expect grantees like the owner / service_role only — NOT anon/authenticated.
select grantee, privilege_type
from information_schema.routine_privileges
where routine_schema = 'public' and routine_name = 'mark_order_paid';

-- 5) Confirm the signup trigger + role guard exist.
select tgname
from pg_trigger
where tgname in ('on_auth_user_created', 'profiles_prevent_role_change');

-- -----------------------------------------------------------------------------
-- Manual negative tests (do these in the app, can't be fully automated here):
--   * As user A, open user B's order URL (/orders/<B's id>)  -> must 404.
--   * As an anon visitor, try to load /admin                 -> redirected.
--   * As a logged-in customer, the "role" can't be changed from the app.
--   * Try POSTing /api/checkout while logged out             -> 401.
-- -----------------------------------------------------------------------------
