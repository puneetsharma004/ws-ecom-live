-- =============================================================================
-- WS CubeTech Store — Phase 4: Courses showcase (link-out only, no checkout)
-- Run AFTER 0002 (needs public.is_admin and public.set_updated_at).
-- =============================================================================

create table if not exists public.courses (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  blurb        text,
  image_url    text,
  external_url text not null,
  price_label  text,
  is_published boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists courses_published_idx on public.courses (is_published);

create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

alter table public.courses enable row level security;

create policy "courses_select_public" on public.courses
  for select using (is_published or public.is_admin());

create policy "courses_admin_write" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

-- Sample courses (published) that link out to the main learning platform.
insert into public.courses (slug, title, blurb, external_url, price_label, image_url, is_published, sort_order)
values
  ('full-stack-web-development', 'Full-Stack Web Development',
   'Become a job-ready full-stack developer — HTML, CSS, JavaScript, React, Node, and databases.',
   'https://www.wscubetech.com', '₹4,999',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuCe5nZTl-qwo9yYai3HPQBBpGNfQr6YFbTx01h12msg2UcBeLy0PgSD5A5ZvdQVjkq_S0Iu3ZuNWAf-vQdpTkb5P7UmlDS2bhw3fPzPX5KUO77bQoK9FdOe27GN-cVwzEM8yk_zK3wwSRQPKqaHg-epjNrMqqzSN8bljgAozDw23RPKQRRC5xXNLP613p7FWcMog_C5m2ERMNzcVlTKuQ-jNR6Srl6c7GfVqPCYTerpU-vVl9ZzLFJwZKckSM07y5Z12_MWi7-waqc',
   true, 1),
  ('data-science-python', 'Data Science with Python',
   'Master Python, pandas, machine learning, and real-world data projects from scratch.',
   'https://www.wscubetech.com', '₹5,999',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBw6f7OobHPP3sNNcP1F1YtOhguEB5w1jbJtTP9tXgO4bdQnouwDyqYlAn7Ld7dScDjgBf0mqzVhKvZVozDhXuDjUpifDJGlYmhIYxcLSCkf9Qa6o09icdMmAR3XLceTQeRIsUk0MjwMgLDFK-8IKhqMaF5NNoYTxNf9JTCjU_IH_tZbMLoU8PUHWrlkzH4IfdPjsYY5q5ynJ6spjAUQjAxUjYD8C0I_WV7oU9FFMx4rJGz0PQJ58kUItmBovKP2NrpoOTeEwSnJvM',
   true, 2),
  ('ui-ux-design', 'UI/UX Design Masterclass',
   'Design beautiful, usable products — Figma, design systems, prototyping, and portfolio reviews.',
   'https://www.wscubetech.com', '₹3,999',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuARmttM1PM_UN2T2axtirNBDNUqWAc_JMn9L8Ry8uCKsWL9qLRpdcf4jx3V74O1BBT7YhLXcgmFofmOg9i6Sa6K3iF05GL52hDvfoQ1gaXlStGQNvL2zV03eVKTGcMyKwW5XBBpV3_8HeeBTVAhiw1xc1ZOQrtYr1tw011EIVPZB9i6vG6yMkOW2rHq2376bJlb-y8cfAsxdou_5cW64kg3xl6iu7AtOdiuIrPN8ohphDlqHLaeN4QRqUIPaX-Qx3ontEg6SysmLjw',
   true, 3)
on conflict (slug) do nothing;
