# API Audit — Status & Rencana Perbaikan

## `app/api/instagram/route.js`
- **Status sekarang**: Butuh `IG_ACCESS_TOKEN` + `IG_USER_ID` di env. Kalau tidak ada → `ok:false, configured:false` (sudah ditangani dengan baik, frontend fallback galeri).
- **Masalah**: Long-lived token Instagram expired ~60 hari. Tidak ada mekanisme refresh otomatis → setelah 60 hari token mati, endpoint mulai gagal diam-diam (cuma balik `ok:false` tanpa alert ke siapa pun).
- **Perbaikan**:
  1. Tambah `AbortSignal.timeout(8000)` pada `fetch`.
  2. Tambah cron mingguan yang memanggil Instagram `refresh_access_token` endpoint sebelum token expired, simpan token baru ke Supabase (tabel `settings`, bukan `.env` — karena `.env` butuh redeploy untuk berubah).
  3. Kalau refresh gagal / token invalid, kirim notifikasi (email ke super admin, atau badge di `/admin/settings`) bukan cuma silent fallback.

## `app/api/youtube/route.js`
- **Status sekarang**: Parsing RSS pakai regex manual (`matchAll`) tanpa XML parser proper. Tidak ada timeout eksplisit pada `fetch`.
- **Masalah**: Kalau YouTube mengubah format RSS (tag berubah urutan/namespace) atau API lambat, regex bisa gagal parse sebagian dan endpoint timeout lama (default fetch tanpa timeout bisa menggantung request).
- **Perbaikan**:
  1. Tambah `AbortSignal.timeout(8000)`.
  2. Validasi hasil parse: kalau field penting (`videoId`, `title`) kosong untuk semua entry, treat sebagai error (sudah ada sedikit: `if (videos.length === 0) throw`, tapi belum cek per-field kosong).
  3. Cache fallback: simpan hasil sukses terakhir (in-memory/DB) agar saat fetch gagal, tampilkan data terakhir yang valid + flag `stale: true`, bukan `videos: []`.

## `app/api/news-feed/route.js`
- **Status sekarang**: 2 sumber RSS (NU Online, Republika), regex parsing sama seperti YouTube, `Promise` per sumber — perlu dicek apakah pakai `Promise.all` tanpa timeout per-request (kalau satu sumber lambat, bisa memperlambat keseluruhan response).
- **Masalah**: Sama seperti YouTube — rawan berubah struktur RSS, tanpa timeout per-fetch, tanpa fallback cache.
- **Perbaikan**: sama seperti di atas + isolasi per-sumber (`Promise.allSettled` bukan `Promise.all`, supaya 1 sumber gagal tidak menggagalkan semua).

## Endpoint Baru yang Dibutuhkan
| Endpoint | Fungsi |
|---|---|
| `GET /api/prayer-times?lat=&lon=` | Proxy ke Aladhan, cache per (lat,lon,tanggal) di DB/KV, fallback ke cache lama kalau Aladhan down |
| `GET /api/cron/keepalive` | Dipanggil Vercel Cron harian, `select 1` ke Supabase, dilindungi `CRON_SECRET` |
| `POST /api/cron/ig-token-refresh` | Refresh token Instagram otomatis (mingguan) |
| CRUD `admin/*` (news, fatwa, faq, dll) | Lewat Route Handler atau Next.js Server Actions langsung ke Supabase (dengan RLS sebagai pertahanan utama) |

## Prinsip Umum (berlaku semua endpoint eksternal)
1. Selalu `AbortSignal.timeout(...)` — jangan biarkan fetch menggantung tanpa batas.
2. Selalu punya fallback "data terakhir yang valid" daripada array/objek kosong saat fetch gagal.
3. Response format konsisten: `{ ok: boolean, stale?: boolean, configured?: boolean, error?: string, data }`.
4. Log error ke console (minimal) supaya di Vercel log bisa dilihat kapan & kenapa gagal — pertimbangkan integrasi Sentry/LogTail kalau butuh alerting proaktif (di luar scope v1).
