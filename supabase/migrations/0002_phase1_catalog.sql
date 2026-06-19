-- =============================================================================
-- WS CubeTech Store — Phase 1: Catalog (products, variants, images, storage)
-- Run AFTER 0001_phase0_foundation.sql (depends on public.is_admin() and
-- public.categories).
-- =============================================================================

-- Generic updated_at helper (reused by future tables).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- products
-- Prices are integer PAISE (₹1 = 100 paise). Never store money as float.
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  description      text,
  category_id      uuid not null references public.categories(id),
  base_price       integer not null check (base_price >= 0),
  compare_at_price integer check (compare_at_price >= 0),
  status           text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  is_featured      boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_status_idx on public.products (status);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;

-- Public sees only active products; admins see everything.
create policy "products_select_public" on public.products
  for select using (status = 'active' or public.is_admin());

create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- product_variants — the actual buyable units (size/colour/capacity + stock)
-- -----------------------------------------------------------------------------
create table if not exists public.product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  sku            text unique,
  label          text not null,
  price_override integer check (price_override >= 0),
  stock_qty      integer not null default 0 check (stock_qty >= 0),
  attributes     jsonb not null default '{}'::jsonb,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists product_variants_product_idx on public.product_variants (product_id);

alter table public.product_variants enable row level security;

-- Visible whenever the parent product is visible (products RLS handles the rest).
create policy "variants_select_public" on public.product_variants
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.status = 'active' or public.is_admin())
    )
  );

create policy "variants_admin_write" on public.product_variants
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- product_images — image_url holds either a Storage public URL or an external URL
-- -----------------------------------------------------------------------------
create table if not exists public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url  text not null,
  alt        text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images (product_id);

alter table public.product_images enable row level security;

create policy "images_select_public" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.status = 'active' or public.is_admin())
    )
  );

create policy "images_admin_write" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Storage bucket for product images (public read; admin-only writes)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_admin_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
