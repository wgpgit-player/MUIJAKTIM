alter table public.quick_icons enable row level security;

create policy "public reads active quick_icons" on public.quick_icons
  for select using (active = true or is_admin());

create policy "admin writes quick_icons" on public.quick_icons
  for all using (is_admin()) with check (is_admin());
