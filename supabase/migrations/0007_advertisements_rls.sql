alter table public.advertisements enable row level security;

create policy "public reads active ads" on public.advertisements
  for select using (
    (active = true and (start_at is null or start_at <= now()) and (end_at is null or end_at >= now()))
    or is_admin()
  );

create policy "admin writes advertisements" on public.advertisements
  for all using (is_admin()) with check (is_admin());
