-- =============================================================================
-- WS CubeTech Store — Phase 0: Foundation (profiles, categories, RLS)
-- Apply in the Supabase SQL editor (or `supabase db push`) on a fresh project.
--
-- NOTE: order matters. `is_admin()` is a SQL function whose body references
-- public.profiles, and Postgres validates SQL function bodies at creation time,
-- so the profiles table must exist BEFORE the function is created.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- profiles — one row per auth user
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  role       text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- -----------------------------------------------------------------------------
-- Helper: is the current user an admin?
-- SECURITY DEFINER so it can read profiles without tripping RLS (avoids
-- recursive policy evaluation). Reused by every admin-write policy.
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles policies ----------------------------------------------------------

-- A user can read and update only their own profile.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Admins can read every profile (for the admin panel).
create policy "profiles_select_admin" on public.profiles
  for select using (public.is_admin());

-- Prevent privilege escalation: a normal user cannot change their own role.
-- Only the service-role client (trusted server code) may set role.
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
as $$
begin
  if (new.role is distinct from old.role) and current_user <> 'service_role' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_change();

-- Auto-create a profile whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- categories — product taxonomy
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Public can read the catalog taxonomy.
create policy "categories_select_all" on public.categories
  for select using (true);

-- Only admins can create/update/delete categories.
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- Seed the merchandise categories.
insert into public.categories (slug, name, sort_order) values
  ('t-shirts',         'T-Shirts',         1),
  ('hoodies',          'Hoodies',          2),
  ('mouse-pads',       'Mouse Pads',       3),
  ('backpacks',        'Backpacks',        4),
  ('water-bottles',    'Water Bottles',    5),
  ('mugs',             'Mugs',             6),
  ('tech-accessories', 'Tech Accessories', 7)
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- newsletter_subscribers — captured from the home page form
-- Inserts happen only via the service-role API route (/api/newsletter), so
-- there is no public insert policy. Admins can read the list.
-- -----------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "newsletter_select_admin" on public.newsletter_subscribers
  for select using (public.is_admin());
