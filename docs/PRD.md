# PRD — MUI Jakarta Timur Web (CMS + Admin + Layanan Ibadah)

## 1. Latar Belakang
Website MUI Jakarta Timur saat ini (`app/*`) berisi konten statis hardcoded di dalam file `.js` (berita, fatwa, profil, layanan). Tidak ada cara bagi pengurus untuk mengubah konten tanpa deploy ulang kode. Dibutuhkan:
1. Panel admin untuk mengelola seluruh konten secara dinamis, dengan 3 level akses.
2. Layanan ibadah (jadwal sholat, arah kiblat) yang akurat berdasarkan lokasi pengguna, bukan hardcode Jakarta.
3. Infrastruktur Supabase yang tidak "tertidur" (auto-pause setelah 5 hari idle).
4. Konsistensi format tanggal dan API yang pernah gagal fetch.

## 2. Tujuan
- Pengurus (admin/super admin) bisa CRUD seluruh konten (berita, fatwa, profil, layanan, dll) lewat UI, tanpa sentuh kode.
- Publik (user) bisa login untuk memberi komentar pada konten tertentu (misal berita/fatwa), tapi tidak bisa mengubah konten.
- Jadwal sholat & arah kiblat otomatis mengikuti lokasi perangkat pengguna (dengan fallback Jakarta Timur).
- Supabase project tetap aktif (tidak auto-pause) lewat ping harian terjadwal.
- Semua tanggal tampil konsisten format `dd MMMM yyyy` (contoh: `12 September 2026`).
- Semua endpoint API internal (`/app/api/*`) punya fallback yang jelas dan termonitor, tidak "silent fail" tanpa indikasi ke UI.

## 3. Role & Hak Akses

| Role | Deskripsi | Hak |
|---|---|---|
| **USER** | Pengguna publik yang login (jamaah/umum) | Login, lihat semua konten publik, membuat & menghapus komentar miliknya sendiri pada konten yang mengizinkan komentar (berita, fatwa, tanya ulama) |
| **ADMIN** | Pengurus/staf konten MUI Jaktim | Semua hak USER + CRUD konten (berita, fatwa, profil bidang, layanan, jadwal kegiatan, pengaturan lokasi default) + moderasi komentar (hapus komentar siapa pun) |
| **SUPER_ADMIN** | Pimpinan/IT MUI Jaktim | Semua hak ADMIN + kelola pengguna (ubah role, nonaktifkan akun, buat admin baru) + pengaturan sistem (API keys, integrasi Instagram/YouTube, jadwal cron Supabase keep-alive) |

Role disimpan di kolom `role` pada tabel `profiles` (Supabase), di-sync dengan Supabase Auth `user.id`.

## 4. Modul Konten Dinamis (Admin CMS)
Konten yang saat ini hardcode dan akan dipindah ke database + diedit lewat admin:

| Modul | Sumber saat ini | Field utama |
|---|---|---|
| Berita | `data/berita.js` | judul, slug, tanggal, kategori, excerpt, isi, gambar/gradient, featured |
| Fatwa | `app/fatwa/fatwa-data.js` | judul, kategori (muamalah/ibadah-kesehatan/direktori-kontemporer), isi, tanggal, nomor fatwa |
| Tanya Ulama (FAQ) | `app/layanan/tanya-ulama/faq-data.js` | pertanyaan, jawaban, kategori |
| Profil Bidang/Komisi | `app/profil/bidang-data.js` | nama bidang, deskripsi, ketua, anggota |
| Pengurus | `app/profil/pengurus/page.js` | nama, jabatan, foto, periode |
| Hero slideshow | `components/HeroSlideshow.js` | gambar, judul, link |
| Pengaturan lokasi default (jadwal sholat) | hardcoded Jakarta | lat, lon, label kota |
| Integrasi sosial (IG/YouTube token) | `.env` | dikelola lewat UI super admin (tersimpan aman di Supabase secrets/DB terenkripsi) |

Setiap modul mendukung: create, edit, delete, publish/unpublish (draft), dan riwayat siapa mengubah (audit `updatedBy`, `updatedAt`).

## 5. Komentar (User-Generated)
- User login bisa berkomentar pada: Berita, Fatwa, Tanya Ulama.
- Komentar default tampil langsung (tidak perlu approval) tapi admin/super admin bisa menghapus komentar yang melanggar.
- Rate limit: 1 komentar / 30 detik per user untuk cegah spam.
- Field: `content_type`, `content_id`, `user_id`, `body`, `created_at`.

## 6. Layanan Ibadah
### 6.1 Jadwal Sholat (Adhan)
- Minta izin geolokasi browser (`navigator.geolocation`) saat user membuka halaman Jadwal Sholat / widget beranda.
- Jika ditolak/tidak tersedia → fallback ke lokasi default yang diatur admin (saat ini Jakarta Timur, -6.225, 106.9004).
- Fetch jadwal dari Aladhan API (`api.aladhan.com/v1/timings/{dd-MM-yyyy}?latitude=..&longitude=..&method=11`), method 11 = Kemenag RI.
- Tampilkan countdown ke waktu sholat berikutnya (highlight waktu aktif).
- Cache hasil per (lat,lon,tanggal) di sisi client (localStorage) untuk kurangi fetch berulang dalam 1 hari.

### 6.2 Kiblat (Live Compass)
- Gunakan `DeviceOrientationEvent` (perlu permission di iOS 13+ via `requestPermission()`) untuk mendapat heading kompas device.
- Hitung bearing kiblat dari koordinat user ke Ka'bah (21.4225, 39.8262) — rumus great-circle bearing (sudah ada contoh di `JadwalShalatClient.js`).
- Tampilkan jarum kompas yang berputar real-time menunjuk ke arah kiblat relatif terhadap heading device.
- Fallback: jika device tidak mendukung orientasi (desktop), tampilkan sudut kiblat dalam derajat + arah mata angin (mis. "294° — Barat Laut") tanpa animasi live.
- Perlu HTTPS untuk akses sensor (development lewat localhost oke).

## 7. Supabase Keep-Alive
- Supabase free tier auto-pause project setelah 5 hari tanpa aktivitas database.
- Solusi: cron job harian (Vercel Cron atau Supabase Edge Function + `pg_cron`) yang melakukan query ringan (`select 1` atau `select count(*) from profiles limit 1`) ke database setiap hari jam tertentu (misal 03:00 WIB).
- Endpoint internal: `GET /app/api/cron/keepalive/route.js`, dilindungi header secret (`CRON_SECRET`) agar tidak bisa dipanggil publik.
- Didaftarkan di `vercel.json` sebagai scheduled cron (`0 20 * * *` UTC = 03:00 WIB).

## 8. Normalisasi Tanggal
- Semua tanggal (berita, fatwa, jadwal kegiatan, dll) disimpan di DB sebagai `timestamptz` (ISO 8601).
- Satu util format terpusat: `formatDateID(date) -> "dd MMMM yyyy"` (contoh: `01 September 2026`), dipakai di semua komponen tampilan — ganti string tanggal campur format (`"2026-08-31"` vs `"1 September 2026"`) yang saat ini tidak konsisten di `data/berita.js`.

## 9. Perbaikan API
Audit endpoint existing (lihat `docs/API_AUDIT.md` untuk detail & temuan):
- `/app/api/instagram` — gagal kalau token expired (Instagram token ~60 hari); perlu refresh otomatis + alert ke super admin.
- `/app/api/youtube` — rawan berubah kalau YouTube ubah struktur RSS; perlu regex lebih defensif + logging error.
- `/app/api/news-feed` — 2 sumber RSS (NU Online, Republika) bisa timeout/berubah struktur; perlu timeout+retry & cache fallback (tampilkan cache lama kalau fetch gagal, bukan array kosong).
- Tambah endpoint baru: `/app/api/prayer-times`, `/app/api/cron/keepalive`, CRUD REST untuk tiap modul CMS (atau pakai Supabase client langsung dari server actions).

## 10. Non-Goals (di luar scope awal)
- Native mobile app.
- Payment/donasi online.
- Multi-bahasa (saat ini hanya Bahasa Indonesia).

## 11. Dokumen Terkait
- [ERD.md](./ERD.md) — struktur data & relasi
- [DESIGN.md](./DESIGN.md) — arsitektur teknis, komponen RadixUI, struktur admin
- [RBAC_FLOW.md](./RBAC_FLOW.md) — flow auth & hak akses detail
- [API_AUDIT.md](./API_AUDIT.md) — status & perbaikan tiap endpoint
