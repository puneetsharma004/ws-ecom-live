-- =============================================================================
-- REPAIR: re-establish the profiles infrastructure and backfill missing rows.
-- Idempotent — safe to run on an existing database. Fixes:
--   (1) the missing on_auth_user_created trigger (signups created no profile)
--   (2) the over-aggressive prevent_role_change guard that reverted role changes
--       made from the SQL editor / Table editor (which run as `postgres`).
-- =============================================================================

-- Table (no-op if it already exists)
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  role       text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Admin helper
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = '' as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Policies (drop + recreate so they are guaranteed to exist)
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin" on public.profiles
  for select using (public.is_admin());

-- Role-change guard — only block the app's end-user roles.
create or replace function public.prevent_role_change()
returns trigger language plpgsql as $$
begin
  if (new.role is distinct from old.role) and current_user in ('anon', 'authenticated') then
    new.role := old.role;
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_prevent_role_change on public.profiles;
create trigger profiles_prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_change();

-- Auto-create a profile on signup.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill a profile for every existing auth user that doesn't have one.
insert into public.profiles (id, full_name)
select u.id, u.raw_user_meta_data ->> 'full_name'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- Verify (look at the result grid):
--   profiles should equal auth_users, and trigger_exists should be true.
select
  (select count(*) from auth.users)                            as auth_users,
  (select count(*) from public.profiles)                       as profiles,
  (select count(*) from public.profiles where role = 'admin')  as admins,
  exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') as trigger_exists;
