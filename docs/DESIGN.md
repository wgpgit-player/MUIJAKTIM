# DESIGN — Arsitektur Teknis MUI Jakarta Timur Web

## 1. Stack
| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | Next.js 14 App Router | sudah ada |
| DB | Supabase Postgres | sudah connect (`DATABASE_URL`, `DIRECT_URL` di `.env`) |
| ORM | Prisma 7 (`@prisma/adapter-pg`) | sudah ada, akan diperluas schema-nya |
| Auth | Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`) | baru ditambahkan |
| UI Primitives | Radix UI (`@radix-ui/react-*`) | baru ditambahkan, dikombinasikan Tailwind (existing) |
| Tabel data admin | `@tanstack/react-table` + Radix | Radix tidak punya komponen Table siap pakai |
| Jadwal Sholat | Aladhan API (`api.aladhan.com`) | sudah dipakai di `JadwalShalatClient.js`, akan di-generalisasi |
| Kiblat | `DeviceOrientationEvent` + kalkulasi bearing manual | sudah ada fungsi `qiblaBearing()`, akan dibuat komponen compass live |
| Cron keep-alive | Vercel Cron → Route Handler | `vercel.json` + `app/api/cron/keepalive/route.js` |

## 2. Struktur Folder (rencana)
```
app/
  admin/
    layout.js              # cek auth+role, sidebar admin
    page.js                 # dashboard
    news/
      page.js               # list
      [id]/page.js          # edit
      new/page.js
    fatwa/...
    faq/...
    profile-content/...
    comments/page.js
    settings/page.js
    users/page.js
  api/
    cron/keepalive/route.js
    prayer-times/route.js    # proxy Aladhan + cache
    admin/
      news/route.js          # CRUD (atau pakai server actions langsung)
      fatwa/route.js
      ...
  (existing public pages tetap, tapi ambil data dari Supabase bukan file .js statis)
components/
  admin/                   # komponen khusus admin (Radix wrappers)
  compass/
    QiblaCompass.js
  prayer/
    PrayerScheduleBar.js    # upgrade pakai geolocation real
lib/
  supabase/
    client.ts               # browser client
    server.ts                # server client (cookies)
    middleware.ts
  date.ts                    # formatDateID()
  qibla.ts                   # qiblaBearing(), compassLabel()
  rbac.ts                     # requireRole() helper
middleware.ts                 # proteksi /admin/**
```

## 3. Format Tanggal Terpusat
`lib/date.ts`:
```ts
export function formatDateID(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
  }).format(d); // -> "12 September 2026"
}
```
Semua tempat yang sekarang menampilkan tanggal manual (string campuran di `data/berita.js`, dll) dipindah ke format `timestamptz` di DB + panggil `formatDateID()` saat render.

## 4. Komponen Live Qibla Compass (ringkasan teknis)
- State: `heading` (dari sensor), `qiblaBearing` (dihitung sekali dari lokasi user).
- iOS: perlu tombol "Aktifkan Sensor" yang memanggil `DeviceOrientationEvent.requestPermission()` (harus dari user gesture, tidak bisa auto).
- Android/Chrome: `deviceorientationabsolute` event lebih akurat (pakai `webkitCompassHeading` sebagai fallback Safari).
- Render: jarum SVG yang `rotate(qiblaBearing - heading)` supaya berputar relatif ke arah device.
- Fallback non-sensor (desktop/browser tak didukung): tampilkan angka derajat statis + label arah mata angin.

## 5. Supabase Keep-Alive
`app/api/cron/keepalive/route.js`:
```js
export async function GET(req) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("unauthorized", { status: 401 });
  }
  await prisma.$queryRaw`select 1`;
  return Response.json({ ok: true, ts: new Date().toISOString() });
}
```
`vercel.json`:
```json
{
  "crons": [{ "path": "/api/cron/keepalive", "schedule": "0 20 * * *" }]
}
```
(`0 20 * * *` UTC = 03:00 WIB, dijalankan tiap hari — jauh di bawah ambang 5 hari idle Supabase.)

## 6. Perbaikan API — Pola Umum
Semua route eksternal (`instagram`, `youtube`, `news-feed`, nanti `prayer-times`) mengikuti pola:
1. `fetch` dengan `AbortSignal.timeout(8000)` agar tidak hang.
2. Simpan hasil sukses terakhir di cache (Next.js `revalidate` + fallback in-memory/DB cache untuk "stale-if-error").
3. Kalau fetch gagal: kembalikan cache lama (kalau ada) dengan flag `stale: true`, bukan array kosong begitu saja.
4. Response selalu konsisten `{ ok, configured?, stale?, error?, data }` agar komponen frontend bisa menampilkan state yang tepat (bukan cuma kosong tanpa penjelasan).
Detail per-endpoint ada di [API_AUDIT.md](./API_AUDIT.md).

## 7. Migrasi Data Existing → DB
Data di `data/berita.js`, `app/fatwa/fatwa-data.js`, `app/layanan/tanya-ulama/faq-data.js`, `app/profil/bidang-data.js` akan di-seed sekali ke Supabase lewat script migrasi (`prisma/seed.ts`) agar konten yang sudah ada tidak hilang saat pindah ke CMS.

## 8. Tahapan Implementasi (disarankan, untuk sesi berikutnya)
1. Setup Supabase Auth + `profiles` table + RLS + middleware.
2. Perluas Prisma schema sesuai ERD, jalankan migration.
3. Install & setup Radix UI primitives + `@tanstack/react-table`.
4. Bangun `/admin` layout + dashboard + CRUD News (sebagai modul pertama, template untuk modul lain).
5. Ulangi pola CRUD untuk Fatwa, FAQ, Profile content.
6. Komentar (publik + moderasi admin).
7. Geolocation + Aladhan dinamis + Qibla compass live.
8. Normalisasi tanggal di seluruh komponen.
9. Perbaikan API (timeout, cache fallback) + cron keep-alive.
10. Seed data lama ke DB, hapus file data statis yang sudah tidak dipakai.
