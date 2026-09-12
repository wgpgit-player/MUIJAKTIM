-- page_views: any visitor (anon or authenticated) can write a row (this IS the
-- tracking event), but only admins can read the data back for the analytics dashboard.

alter table public.page_views enable row level security;

create policy "anyone logs a page view" on public.page_views
  for insert with check (true);

create policy "admin reads page views" on public.page_views
  for select using (is_admin());
