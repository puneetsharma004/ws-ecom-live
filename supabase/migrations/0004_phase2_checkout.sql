-- =============================================================================
-- WS CubeTech Store — Phase 2: Checkout (addresses, orders, order_items)
-- Run AFTER 0002_phase1_catalog.sql. Money is in integer PAISE.
--
-- Security model:
--   * Orders/items are INSERTED only by the service-role checkout route — there
--     is no authenticated insert policy. Customers can READ their own orders.
--   * mark_order_paid() flips pending -> paid and decrements stock atomically.
--     EXECUTE is revoked from public/anon/authenticated and granted only to
--     service_role, so a customer cannot mark their own order paid.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- addresses — saved shipping addresses (used by the account area later)
-- -----------------------------------------------------------------------------
create table if not exists public.addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  full_name  text not null,
  phone      text not null,
  line1      text not null,
  line2      text,
  city       text not null,
  state      text not null,
  pincode    text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists addresses_user_idx on public.addresses (user_id);

alter table public.addresses enable row level security;

create policy "addresses_rw_own" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "addresses_select_admin" on public.addresses
  for select using (public.is_admin());

-- -----------------------------------------------------------------------------
-- orders
-- -----------------------------------------------------------------------------
create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text not null unique
                    default 'WS-' || lpad(nextval('public.order_number_seq')::text, 6, '0'),
  user_id           uuid references auth.users(id) on delete set null,
  email             text not null,
  status            text not null default 'pending'
                    check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal          integer not null check (subtotal >= 0),
  shipping_fee      integer not null default 0 check (shipping_fee >= 0),
  total             integer not null check (total >= 0),
  currency          text not null default 'INR',
  shipping_address  jsonb not null,
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_status_idx on public.orders (status);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

-- Customers read their own orders; admins read/manage all. No insert policy:
-- inserts happen only through the service-role checkout route.
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

create policy "orders_select_admin" on public.orders
  for select using (public.is_admin());

create policy "orders_admin_write" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- order_items — snapshot of what was bought (name/price frozen at purchase)
-- -----------------------------------------------------------------------------
create table if not exists public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    uuid references public.products(id) on delete set null,
  variant_id    uuid references public.product_variants(id) on delete set null,
  name          text not null,
  variant_label text,
  sku           text,
  unit_price    integer not null check (unit_price >= 0),
  qty           integer not null check (qty > 0),
  created_at    timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

alter table public.order_items enable row level security;

create policy "order_items_select" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "order_items_admin_write" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- mark_order_paid — flip pending->paid and decrement stock, transactionally.
-- Idempotent: a second call for an already-paid order is a no-op.
-- -----------------------------------------------------------------------------
create or replace function public.mark_order_paid(p_order_id uuid, p_payment_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.orders
    set status = 'paid',
        razorpay_payment_id = coalesce(p_payment_id, razorpay_payment_id),
        updated_at = now()
    where id = p_order_id and status = 'pending';

  -- Already processed (or unknown) — nothing else to do.
  if not found then
    return;
  end if;

  update public.product_variants v
    set stock_qty = greatest(0, v.stock_qty - oi.qty)
    from public.order_items oi
    where oi.order_id = p_order_id and oi.variant_id = v.id;
end;
$$;

revoke all on function public.mark_order_paid(uuid, text) from public;
grant execute on function public.mark_order_paid(uuid, text) to service_role;
