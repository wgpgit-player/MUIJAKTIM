# RBAC & Auth Flow — MUI Jakarta Timur Web

## 1. Provider
**Supabase Auth** (email + password). Session di-handle via `@supabase/ssr` (cookie-based, kompatibel Next.js App Router Server Components).

## 2. Struktur Role
```
USER        -> default saat sign up, bisa komentar
ADMIN       -> naik dari USER, di-promote oleh SUPER_ADMIN, kelola konten
SUPER_ADMIN -> akses penuh, minimal 1 akun dibuat manual via SQL seed pertama kali
```
Disimpan di `profiles.role` (enum), bukan di JWT claim custom (supaya mudah diubah tanpa perlu re-login), dicek ulang tiap request penting lewat query `profiles`.

## 3. Flow Login
1. User ke `/login` → input email/password → `supabase.auth.signInWithPassword()`.
2. Supabase set cookie session (httpOnly, lewat middleware Next.js `middleware.ts`).
3. Middleware refresh session tiap request, inject `user` ke context server.
4. Server Component/Route Handler baca role dari tabel `profiles` (join by `auth.uid()`), bukan percaya client.

## 4. Flow Registrasi Publik (USER)
1. `/register` (halaman baru) → `supabase.auth.signUp()`.
2. Trigger Postgres `on_auth_user_created` otomatis insert baris `profiles` baru dengan `role = 'USER'`.
3. (Opsional) verifikasi email via Supabase default flow sebelum bisa komentar.

## 5. Promosi Role
- Hanya `SUPER_ADMIN` yang bisa mengubah `role` user lain, lewat halaman `/admin/users`.
- Aksi ini dicatat (tabel `SETTINGS`/audit log terpisah jika dibutuhkan nanti — tidak wajib di v1).
- Tidak ada self-promotion: endpoint update role menolak jika `target.id === requester.id` kecuali requester sudah `SUPER_ADMIN`.

## 6. Proteksi Route (Next.js App Router)
```
/admin/**           -> middleware: wajib login, role IN (ADMIN, SUPER_ADMIN)
/admin/users/**      -> middleware: wajib login, role = SUPER_ADMIN
/admin/settings/**    -> wajib SUPER_ADMIN (API keys, integrasi, cron)
/ (publik)           -> tidak wajib login
komentar (POST)       -> wajib login, role apa saja (USER/ADMIN/SUPER_ADMIN)
```
Implementasi: `middleware.ts` di root project memeriksa path `/admin`, redirect ke `/login` jika tidak ada session, redirect ke `/` (dengan toast "akses ditolak") jika role tidak cukup.

Setiap Route Handler (`app/api/admin/**/route.js`) WAJIB melakukan pengecekan role ulang di server (jangan andalkan middleware saja), karena middleware Next.js bisa di-bypass pada edge cases tertentu dan Supabase RLS adalah pertahanan lapis terakhir yang sesungguhnya.

## 7. Row Level Security sebagai Pertahanan Utama
Middleware + cek role di Route Handler adalah UX/lapis pertama. Pertahanan sesungguhnya ada di Postgres RLS (lihat `ERD.md` bagian RLS) — artinya walau ada bug di kode Next.js, database tetap menolak write yang tidak berhak.

Contoh policy (SQL, akan masuk ke migration):
```sql
create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('ADMIN', 'SUPER_ADMIN')
  );
$$ language sql security definer;

create policy "Admin can write news" on news
  for all using (is_admin()) with check (is_admin());

create policy "Public can read published news" on news
  for select using (status = 'PUBLISHED');
```

## 8. Struktur Halaman Admin (RadixUI)
```
/admin                     Dashboard ringkas (jumlah berita, fatwa, komentar terbaru)
/admin/news                List + CRUD berita
/admin/fatwa                List + CRUD fatwa
/admin/faq                  List + CRUD tanya ulama
/admin/profile-content      Pengurus, bidang/komisi, hero slide
/admin/comments             Moderasi komentar (semua modul)
/admin/settings             Lokasi default, integrasi IG/YouTube, cron keep-alive   [SUPER_ADMIN only]
/admin/users                Kelola user & role                                      [SUPER_ADMIN only]
```
Setiap halaman list pakai Radix `Table`-pattern (atau `@radix-ui/react-*` primitives dikombinasi Tailwind, karena Radix tidak menyediakan Table — dibangun manual dengan `@tanstack/react-table` + Radix untuk Dialog/DropdownMenu/Tabs/Toast/AlertDialog).

## 9. Komponen Radix yang Dipakai
| Kebutuhan | Komponen Radix |
|---|---|
| Modal form create/edit | `@radix-ui/react-dialog` |
| Konfirmasi hapus | `@radix-ui/react-alert-dialog` |
| Menu aksi per baris | `@radix-ui/react-dropdown-menu` |
| Tab kategori (fatwa, dll) | `@radix-ui/react-tabs` |
| Notifikasi sukses/gagal | `@radix-ui/react-toast` |
| Select role/kategori | `@radix-ui/react-select` |
| Switch publish/draft | `@radix-ui/react-switch` |
| Tooltip ikon aksi | `@radix-ui/react-tooltip` |
