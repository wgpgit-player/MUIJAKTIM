# Website MUI Jakarta Timur (PWA)

Project Next.js 14 (App Router) + Tailwind CSS, dikonfigurasi sebagai Progressive Web App (PWA).

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Build production

```bash
npm run build
npm start
```

## Struktur

- `app/` — halaman (App Router): Homepage, Profil, Berita, Fatwa, Kitab, Keluarga, Amalan, Layanan (Tanya Ulama, Jadwal Shalat, Kalkulator Zakat)
- `components/` — Navbar (desktop), BottomNav (mobile, gaya super app), Footer, NewsCard, QuickService, PlaceholderPage
- `data/berita.js` — data contoh berita (ganti dengan data dari CMS saat integrasi)
- `public/manifest.json` + `public/sw.js` — konfigurasi PWA (installable, cache offline dasar)
- `tailwind.config.js` — design token (warna, radius, shadow) sesuai Design System

## Halaman yang masih placeholder (menunggu isi konten dari Komisi Infokom / integrasi API)

- Fiqih & Fatwa, Kitab, Keluarga & Muslimah, Amalan & Khutbah
- Layanan: Tanya Ulama (perlu integrasi AI/chat), Jadwal Shalat & Kiblat (perlu API jadwal shalat), Kalkulator Zakat (perlu logika perhitungan)

## Catatan PWA

- Ikon app ada di `public/icons/` (192px & 512px)
- Service worker (`public/sw.js`) melakukan cache-first untuk aset statis dan network-first untuk halaman
- Saat dibuka dari HP (Chrome/Safari), browser akan menawarkan "Add to Home Screen" sehingga tampil seperti aplikasi native
