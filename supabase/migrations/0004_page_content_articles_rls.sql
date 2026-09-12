-- RLS for the two new content tables added for "halaman lain" (page_content: single
-- free-text pages like Sejarah/Visi-Misi/Konsultasi; articles: list content for
-- Amalan/Kitab/Keluarga sections). Same pattern as 0001_rbac_and_rls.sql.

alter table public.page_content enable row level security;
alter table public.articles enable row level security;

create policy "public reads page_content" on public.page_content
  for select using (true);
create policy "admin writes page_content" on public.page_content
  for all using (is_admin()) with check (is_admin());

create policy "public reads published articles" on public.articles
  for select using (status = 'PUBLISHED' or is_admin());
create policy "admin writes articles" on public.articles
  for all using (is_admin()) with check (is_admin());
