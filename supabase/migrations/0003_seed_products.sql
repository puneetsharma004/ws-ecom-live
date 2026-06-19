-- =============================================================================
-- WS CubeTech Store — Phase 1 seed: sample products, variants, images
-- Run AFTER 0002_phase1_catalog.sql. Safe to re-run (idempotent guards).
-- Images reuse the design mockups; replace via the admin panel later.
-- Prices are in PAISE (₹999 => 99900).
-- =============================================================================

-- Products -------------------------------------------------------------------
insert into public.products (slug, name, description, category_id, base_price, compare_at_price, status, is_featured)
select x.slug, x.name, x.description, c.id, x.base_price, x.compare_at_price, 'active', x.is_featured
from (values
  ('ws-core-tee', 'WS Core Tee',
   'A breathable, performance-fabric everyday tee with a subtle tech logo. Engineered for comfort, built to last.',
   't-shirts', 99900, 129900, true),
  ('precision-hydro-flask', 'Precision Hydro Flask',
   'Double-walled stainless steel bottle that keeps drinks cold for 24h. Matte finish, leak-proof lid.',
   'water-bottles', 149900, null, false),
  ('engineer-heavy-hoodie', 'Engineer Heavy Hoodie',
   'A structured, heavy-weight hoodie with clean lines and a dense premium fleece. Warmth without the bulk.',
   'hoodies', 249900, 299900, true),
  ('commuter-tech-pack', 'Commuter Tech Pack',
   'Engineered for the modern professional. Weatherproof materials, a padded laptop compartment, and an ergonomic suspension system.',
   'backpacks', 399900, null, true),
  ('ceramic-desk-mug', 'Ceramic Desk Mug',
   'A matte-black ceramic mug with a glossy interior and a sharply angled geometric handle.',
   'mugs', 69900, null, false),
  ('pro-glide-mousepad', 'Pro Glide Mousepad',
   'A premium synthetic-surface mousepad with stitched edges and a non-slip base for precise control.',
   'mouse-pads', 79900, null, false)
) as x(slug, name, description, cat_slug, base_price, compare_at_price, is_featured)
join public.categories c on c.slug = x.cat_slug
on conflict (slug) do nothing;

-- Variants -------------------------------------------------------------------
insert into public.product_variants (product_id, sku, label, stock_qty, attributes, sort_order)
select p.id, x.sku, x.label, x.stock_qty, x.attributes::jsonb, x.sort_order
from public.products p
join (values
  ('WS-TEE-BLK-S', 'Black / S', 40, '{"color":"Black","size":"S"}', 1),
  ('WS-TEE-BLK-M', 'Black / M', 45, '{"color":"Black","size":"M"}', 2),
  ('WS-TEE-BLK-L', 'Black / L', 35, '{"color":"Black","size":"L"}', 3),
  ('WS-TEE-BLK-XL', 'Black / XL', 20, '{"color":"Black","size":"XL"}', 4)
) as x(sku, label, stock_qty, attributes, sort_order) on p.slug = 'ws-core-tee'
on conflict (sku) do nothing;

insert into public.product_variants (product_id, sku, label, stock_qty, attributes, sort_order)
select p.id, 'WS-FLK-WHT-750', 'Matte White / 750ml', 60, '{"color":"Matte White","capacity":"750ml"}'::jsonb, 1
from public.products p where p.slug = 'precision-hydro-flask'
on conflict (sku) do nothing;

insert into public.product_variants (product_id, sku, label, stock_qty, attributes, sort_order)
select p.id, x.sku, x.label, x.stock_qty, x.attributes::jsonb, x.sort_order
from public.products p
join (values
  ('WS-HOD-NVY-M', 'Navy / M', 25, '{"color":"Navy","size":"M"}', 1),
  ('WS-HOD-NVY-L', 'Navy / L', 30, '{"color":"Navy","size":"L"}', 2),
  ('WS-HOD-NVY-XL', 'Navy / XL', 15, '{"color":"Navy","size":"XL"}', 3)
) as x(sku, label, stock_qty, attributes, sort_order) on p.slug = 'engineer-heavy-hoodie'
on conflict (sku) do nothing;

-- Backpack capacities carry a price_override (larger = pricier).
insert into public.product_variants (product_id, sku, label, price_override, stock_qty, attributes, sort_order)
select p.id, x.sku, x.label, x.price_override, x.stock_qty, x.attributes::jsonb, x.sort_order
from public.products p
join (values
  ('WS-BAG-CHR-15', 'Charcoal / 15L', 399900, 15, '{"color":"Charcoal","capacity":"15L"}', 1),
  ('WS-BAG-CHR-20', 'Charcoal / 20L', 429900, 20, '{"color":"Charcoal","capacity":"20L"}', 2),
  ('WS-BAG-CHR-25', 'Charcoal / 25L', 459900, 10, '{"color":"Charcoal","capacity":"25L"}', 3)
) as x(sku, label, price_override, stock_qty, attributes, sort_order) on p.slug = 'commuter-tech-pack'
on conflict (sku) do nothing;

insert into public.product_variants (product_id, sku, label, stock_qty, attributes, sort_order)
select p.id, 'WS-MUG-BLK-350', 'Matte Black / 350ml', 6, '{"color":"Matte Black","capacity":"350ml"}'::jsonb, 1
from public.products p where p.slug = 'ceramic-desk-mug'
on conflict (sku) do nothing;

insert into public.product_variants (product_id, sku, label, stock_qty, attributes, sort_order)
select p.id, 'WS-PAD-GRY-XL', 'Light Grey / XL', 120, '{"color":"Light Grey","size":"XL"}'::jsonb, 1
from public.products p where p.slug = 'pro-glide-mousepad'
on conflict (sku) do nothing;

-- Images ---------------------------------------------------------------------
insert into public.product_images (product_id, image_url, alt, sort_order)
select p.id, x.image_url, x.alt, x.sort_order
from public.products p
join (values
  ('ws-core-tee', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhxoQQht3KBydTP_nWOJrbiRWH9Fyg-USQeYygYbfRFtPH6crIsNTwri2_2GdxeChogi-vdnWZ6P2lY79TlLyFJgwSrNPaoyWEzbOWprEkW6qrjT1m8o28JpRpF9vNl-J9jhyMiY5SqNNHARBHmMr0bj8BrmE16MZ8RwYMRe9oC0r0nwwENT7F1vtjntBFckbNr36O4oJu85W1FweWRMUkQNZcyDw7j_rM8ZBtlxw0z3NJwXcy67NXwFwGEMRl8ce81WVv7Zgrqx8', 'WS Core Tee in black', 0),
  ('precision-hydro-flask', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYgy9_0cZLr_tzqfYUrGwzj-DkGI2fEnGOd_f4_Ck62G-YCAWkT0m9z2_GkyrlqRu5cTmjYeh0KWVPIJODqAtWstSZNxgdmpoxrSoRIDimnhPcMe24_6CnWwdKEXriA9uMjbNhHGOtX3sQnEBTCbLYTinHea9XSCHtvJvhsonwY-pzmvBNzqr4iTzw7Fcln4VGImp0eWfN-c7uuqRBAu_J98dFwZ0g9OL9VvUo7yaV0bsr-WCc6d-CSaUpsujdmSsH4fOVqBQGMiU', 'Precision Hydro Flask', 0),
  ('engineer-heavy-hoodie', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB8ZDKn3mrhF_GneHkfAd2zVRuMmqobR9NKHzTPX52D6JyGwiFlw3Ua7GuMz0FCNXdEjs9cCMjr1Rrat416qhAhwt2CwWgl7L8w2_-Mk1snmx4X9wbugrXCwmEU7H3nXIJMCzn-TNflci1YBlQe2z9oEOzzl0KeckJVE00E15CGmwfPbqmy9DdM0S671zbwVgcvwMb4-O8zKDiToXqRUl1ZBltST4WdrqIEp8Si2AFxB_5L7zqFh5AoktcZHTraSdlmvM34n2ao7Y', 'Engineer Heavy Hoodie in navy', 0),
  ('commuter-tech-pack', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDfdfiOjt2egUowCxWRUqJAu2v3lOAyH0FBjn8fKaAVG6T9b46P9ceC3Ky58UYW0-gmLHo_YbczHBiIIuzMEQMCfPcMWO9Ruet4IW7-nUa5XO0EoMXbtvhU0BCSj22yhAes_6K8yVWgx9XxmCNWOkFh-Gp459Lk4fgYuostB-NTyW8fUnuZYYrZ98S7_y0RNctoh9Tny2bgkOBkHEXW-HMNnl_yHh-bjsc4-ym_U43XUtuxOgvAc6JB2l5JMWOHWRgNASBsfNlgIM', 'Commuter Tech Pack', 0),
  ('commuter-tech-pack', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRtjEjaQ7Kmq5f1gaoG4RRLOOEihoZGe171yOgGqx1elSmxxjIXcbHs5LynEYV1dgF4wTw4salA9FGh0C0WxKfsaubF6QUFkHsxOglZO8ASDS7Gjz7oDmQd9g662gv9hP0yDRF7nMfcYwb8OpeGbRwneQ7S5d4THrx0eiL6YlYXdab2XL1bi1aRAIRTm4fSKDuFuDU3HLjnE-SaHKaHhql_B2sIdHxGbXJniRQBAIc3S-olLVr2xms-6N9rUJIr-w6kmG9WUJPRXk', 'Commuter Tech Pack — material detail', 1),
  ('commuter-tech-pack', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrWvqXXKHiazNCCadUXpkx31MKSfI9uuI53lo-8h-NnyStrhIGJX3puxKfjCA1eF3sqibwHKaHcJ2Jd13U7-vTeaCqF4K_q6rSMlLSaDMC6EDLp6QTwqp09Yzh1-kA0vh04Reduo20T2yRfsTToayxAfeAlQpgF3-s-vgW8LKyr-rtkPju-HjeqXlCPLcuYdJ-V2VmBH_unjXsfx63hIreteZ3TrIVL6D08Htg4gw2ZZXeTOn6MaKQWlOV14GmjasV6vv9sVx_3f8', 'Commuter Tech Pack — interior', 2),
  ('ceramic-desk-mug', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMqzz8JSMUwKF39C-g4WG5xNXRrXTo7uV_ISYq2eCckttwJPVLlavpasQMIyx4IwQEkbR7n5ZvnBiM-fqRox54khR-d2e52wJXOCpomwS0X4tm59_dBB5zMPINVbpseXNYyR3jL4CfogLRsQgzB-JvlNvLPKxFIvoDXIFuZqmikKaCq3yccKZUyhgUMZEnV1fjHl_slh8DIxqNTZPO8iwOkpSQnjnqtmK0MY85k_JzoEHUZu1RvVhBXa7hMdaDrXiplri9vXzUMOc', 'Ceramic Desk Mug in matte black', 0),
  ('pro-glide-mousepad', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpuLZ-G2y6NlhUctE7xmcLafVj7n7spDEF-mHASIfThTUhLjJVBGI3A4nVndScb1CsVmJ_50wjshAEt0hKzjmk0VJuZyJfhOulZkpiySRxF-RUjDw4qJ2dg6deWY8BiKXKOW1UtgGjq4MHe_FivRy5DCbpFsT8bOo24oDlsEH32FtXss4nswREg2lAElxza-6Wbvq1WcbhRx1vRS7cEuHoKMJWD-FqCwRdfyGxLxBuyfLmKesgu1SxIbJCMyQKR3e3SsTgqaYrRh4', 'Pro Glide Mousepad in light grey', 0)
) as x(slug, image_url, alt, sort_order) on x.slug = p.slug
where not exists (
  select 1 from public.product_images pi
  where pi.product_id = p.id and pi.sort_order = x.sort_order
);
