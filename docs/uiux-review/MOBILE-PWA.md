# Tampilan aplikasi MUI Jaktim — 11 Oktober 2026

Tampilan ponsel mengikuti struktur referensi pengguna: bidang lengkung dengan motif hijau, logo resmi MUI, lokasi dan jadwal shalat terpusat, delapan akses layanan, headline ringkas dengan thumbnail di kanan, serta lima kontrol navigasi bawah. Carousel tidak digunakan; empat akses cepat desktop dipertahankan.

Pencarian Fatwa tetap langsung tersedia. Menu bawah membuka seluruh bagian situs. Lokasi awal Jakarta Timur; tombol Ganti meminta lokasi perangkat. Jadwal berasal dari integrasi yang sudah ada, dengan kondisi loading dan gagal yang ringkas.

PWA memiliki manifest standalone, shortcut layanan, panduan pemasangan dan halaman offline. Service worker tidak menyimpan respons API, halaman autentikasi/admin maupun payload RSC. Pemasangan pada perangkat fisik perlu diuji melalui HTTPS produksi; perilakunya mengikuti dukungan browser.

Validasi: tampilan beranda tidak melebar horizontal pada 360, 390, 768, 1024 dan 1440 px; menu bawah berhasil dibuka pada ponsel. Pengujian sebelumnya mencakup halaman berita dan Tanya Ulama, navigasi aktif, panduan pemasangan serta fallback offline service worker. Pemeriksaan sintaks tidak menemukan kesalahan. Build melakukan kompilasi dan pemeriksaan tipe, namun prerender terhambat koneksi database lokal (ECONNREFUSED). Lint meminta konfigurasi ESLint interaktif yang belum tersedia.

Screenshot menggunakan preview lokal dengan fixture berita/database; integrasi produksi tidak diganti. Galeri mobile-app.html menampilkan sebelum–sesudah ponsel, desktop, menu, dan offline.

Referensi pola navigasi dan PWA: https://m2.material.io/design/navigation/ ; https://web.dev/learn/pwa/installation ; https://web.dev/learn/pwa/offline-data

Revisi 11 Oktober: pencarian pada beranda mobile dihapus sesuai permintaan. Ornamen lengkung diganti dengan identitas rata kiri dan kartu jadwal hijau beraksen geometris halus. Jadwal, waktu, lokasi dan hitung mundur memiliki hierarki terpisah; akses layanan tampil lebih cepat. Validasi ulang lima lebar layar lulus tanpa overflow dan pemeriksaan sintaks lulus. Build penuh tidak diulang untuk revisi tampilan ini; keterbatasan database di atas masih berlaku.

Revisi warna dan interaksi: palet beranda mobile menggunakan emerald, lime lembut, mint, kuning dan peach. Tombol layanan dan navigasi memiliki respons tekan; animasi mengikuti prefers-reduced-motion. Jadwal hari ini dapat dibuka/tutup langsung di kartu. Screenshot app-mobile-interactive.png menunjukkan kondisi terbuka. Pemeriksaan sintaks dan uji buka/tutup lulus; tidak ada overflow pada lima lebar layar. Pasangan warna teks utama diperiksa dengan rasio kontras minimal 4.5:1.
