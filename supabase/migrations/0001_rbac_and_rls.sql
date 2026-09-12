-- RBAC bootstrap: auto-create a profile row when a new auth.users row is created,
-- plus Row Level Security policies for every content table.
-- Run this AFTER `prisma migrate` has created the tables (profiles, news, fatwa,
-- faq_tanya_ulama, pengurus, bidang_komisi, hero_slide, comments, settings).

-- 1. Auto-create profile on signup -------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, email, first_name, last_name, role, is_active, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    'USER',
    true,
    now()
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Helper: is the current user admin/super_admin? --------------------------------
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('ADMIN', 'SUPER_ADMIN') and is_active = true
  );
$$ language sql security definer stable;

create or replace function public.is_super_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'SUPER_ADMIN' and is_active = true
  );
$$ language sql security definer stable;

-- 3. Enable RLS everywhere ----------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.news enable row level security;
alter table public.fatwa enable row level security;
alter table public.faq_tanya_ulama enable row level security;
alter table public.pengurus enable row level security;
alter table public.bidang_komisi enable row level security;
alter table public.hero_slide enable row level security;
alter table public.comments enable row level security;
alter table public.settings enable row level security;

-- 4. profiles -------------------------------------------------------------------
create policy "read own profile" on public.profiles
  for select using (id = auth.uid() or is_admin());

create policy "update own profile (not role)" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create policy "super admin manages all profiles" on public.profiles
  for all using (is_super_admin()) with check (is_super_admin());

-- 5. Content tables: public reads PUBLISHED, admins read/write everything ---------
create policy "public reads published news" on public.news
  for select using (status = 'PUBLISHED' or is_admin());
create policy "admin writes news" on public.news
  for all using (is_admin()) with check (is_admin());

create policy "public reads published fatwa" on public.fatwa
  for select using (status = 'PUBLISHED' or is_admin());
create policy "admin writes fatwa" on public.fatwa
  for all using (is_admin()) with check (is_admin());

create policy "public reads published faq" on public.faq_tanya_ulama
  for select using (status = 'PUBLISHED' or is_admin());
create policy "admin writes faq" on public.faq_tanya_ulama
  for all using (is_admin()) with check (is_admin());

create policy "public reads pengurus" on public.pengurus
  for select using (true);
create policy "admin writes pengurus" on public.pengurus
  for all using (is_admin()) with check (is_admin());

create policy "public reads bidang_komisi" on public.bidang_komisi
  for select using (true);
create policy "admin writes bidang_komisi" on public.bidang_komisi
  for all using (is_admin()) with check (is_admin());

create policy "public reads active hero_slide" on public.hero_slide
  for select using (active = true or is_admin());
create policy "admin writes hero_slide" on public.hero_slide
  for all using (is_admin()) with check (is_admin());

-- 6. Comments: anyone (incl. anon) reads non-deleted, authed users write their own,
--    owner or admin can soft-delete. ------------------------------------------------
create policy "anyone reads non-deleted comments" on public.comments
  for select using (is_deleted = false or is_admin());

create policy "authed users create own comments" on public.comments
  for insert with check (auth.uid() = author_id);

create policy "owner or admin soft-deletes comments" on public.comments
  for update using (auth.uid() = author_id or is_admin())
  with check (true);

-- 7. Settings: super admin only -----------------------------------------------------
create policy "super admin manages settings" on public.settings
  for all using (is_super_admin()) with check (is_super_admin());

create policy "admin reads settings" on public.settings
  for select using (is_admin());
