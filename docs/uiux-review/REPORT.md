# Perbaikan UI/UX MUI Jakarta Timur

Tanggal pemeriksaan: 9 Oktober 2026, WIB.

Implementasi berada pada folder proyek `muijaktim-web` yang diminta. Route, data resmi, endpoint, Supabase/Prisma, serta alur autentikasi tetap digunakan. Tidak ada push atau deployment.

## Perubahan

- `PageHeader` menjadi pola bersama: umum, layanan ringkas, dan artikel. Breadcrumb berupa navigasi Beranda/induk dengan teks terang, alignment kiri, judul sesuai isi, serta motif geometris delapan sudut yang samar. Artikel dan layanan dengan kolom baca sempit memiliki gutter yang sama dengan isinya. Profil memakai “Profil Kelembagaan”.
- Navbar memiliki logo resmi dan menu semua bagian situs pada ponsel/tablet. Dropdown desktop dapat dibuka menggunakan Enter/Space, ditelusuri dengan Tab, dan ditutup dengan Escape. Menu ponsel memiliki pengelolaan fokus dan scroll. Tautan akun serta autentikasi dipertahankan.
- Bottom navigation mengaktifkan bagian induk untuk route turunan, menggunakan `aria-current`, safe-area, dan target sekitar 75 × 52 px pada viewport 390 px. Tanya memakai gaya tab biasa. Navigasi bawah/bantuan disembunyikan selama input aktif di ponsel.
- Container, gutter, ukuran baca, kontras emerald, border, fokus, radius, filter berbentuk chip, dan state disabled disatukan. Zoom pengguna diizinkan kembali. Skip link ditambahkan. Loading dan kegagalan halaman mempunyai pesan serta tindakan yang ringkas.
- Fatwa: pencarian berada dekat header, kategori horizontal dengan scrollbar, statistik empat kolom yang lebih ringkas, jumlah hasil, 20 dokumen per tampilan, serta tombol muat berikutnya. Query dari pencarian beranda dibaca. PDF dapat dibuka pada ponsel. Judul dan sumber dokumen tidak diedit.
- Berita: headline memakai foto bila tersedia; gambar kosong/rusak menggunakan fallback editorial ringkas. Kartu beranda juga memakai pola gambar ini. Kategori berita memakai komponen bersama. Berita situs dan feed eksternal dibedakan melalui label sumber. Detail memakai breadcrumb, kolom baca sekitar 720 px, dan menghindari excerpt yang mengulang awal body.
- Tanya Ulama: chat mengikuti isi dengan batas scroll responsif. Salam pendek, dua pertanyaan populer awal, opsi pertanyaan tambahan, serta input terlihat pada layar awal 390 × 900. Keterangan bukan fatwa resmi dipertahankan. Kontak sekretariat mengikuti pengaturan WhatsApp yang sudah tersedia; nomor placeholder pada eskalasi diganti dengan fallback sekretariat yang sudah digunakan widget.
- Bantuan situs memakai ikon bantuan dan label yang sesuai; pilihan jawaban otomatis serta kontak sekretariat dibedakan. Launcher disembunyikan pada Tanya Ulama dan Jadwal Shalat. Ponsel memiliki area bantuan tersendiri di atas bottom navigation dan padding untuk akhir konten.
- Beranda tetap menggunakan logo/foto dan data yang dikonfigurasi, dengan lapisan gelap agar teks terbaca. Ikon akses cepat dirapikan dengan bingkai yang konsisten. Tombol notifikasi ponsel yang belum berfungsi dihilangkan. Pesan lokasi dipersingkat. Jadwal Shalat memiliki tombol coba lagi.

## Pemetaan header publik

| Kelompok | Implementasi |
| --- | --- |
| Beranda | Hero khusus; logo/nav memakai chrome bersama |
| Profil dan daftar komisi | PageHeader umum |
| Detail komisi | PageHeader umum dengan breadcrumb dua tingkat |
| Fatwa dan kategori fiqih | PageHeader umum / ArticleListPage bersama |
| Berita dan kategori | PageHeader umum / NewsSectionPage bersama |
| Detail berita | PageHeader artikel |
| Kitab, Amalan, Layanan | PageHeader umum |
| Quran, Turats, Kamus, Tanya, Shalat, Zakat | PageHeader layanan |
| Keluarga dan amalan: daftar/detail | ArticleListPage / ArticleDetailPage bersama |
| Konsultasi keluarga, Login, Daftar, Akun | PageHeader layanan |
| Loading dan error | PageHeader layanan dengan pesan/tindakan |
| /profil/pengurus, /profil/visi-misi, /keluarga | Redirect yang sudah ada dipertahankan |
| /admin/** | Shell admin dipertahankan |

## Verifikasi

- Pemeriksaan browser menggunakan Chromium dan salinan preview terpisah. Lima lebar: 360, 390, 768, 1024, 1440 px; tinggi 900 px.
- Tidak ditemukan horizontal overflow pada kombinasi yang diuji: beranda; profil; komisi; fatwa; berita/detail; seluruh kategori berita dan fatwa; kitab/Quran/Turats/Kamus; amalan beserta daftar doa, khutbah, hikmah; keluarga/fiqih wanita/parenting/konsultasi; layanan/Tanya/Shalat/Zakat; Login dan Daftar. Detail artikel dan komisi dengan judul panjang juga diuji menggunakan fixture.
- Pemeriksaan ulang terakhir: 65 kombinasi viewport/halaman/skenario, tanpa overflow. Pemeriksaan kategori, autentikasi dan beranda: 80 kombinasi, tanpa overflow.
- Pagination bertahap: 20 → 40 dokumen. Pencarian “zakat” menampilkan jumlah hasil; query yang tidak cocok menampilkan empty state.
- Menu ponsel memuat enam bagian utama dan route anak. Escape menutup menu. Detail berita mengaktifkan Berita. Tab bawah mempunyai tinggi 52 px.
- Dropdown desktop berhasil dibuka via keyboard, fokus terlihat setelah Tab, dan Escape mengembalikan fokus ke pembuka.
- Input Tanya terlihat pada kondisi awal 390 × 900. Input aktif menyembunyikan bottom navigation. Mengirim pertanyaan contoh menghasilkan tiga pesan (salam, pertanyaan, jawaban).
- Excerpt tidak muncul sebagai intro kedua ketika body dimulai dengan teks yang sama.
- Foto lokal berhasil dimuat. Gambar 404 beralih ke fallback; kasus error sebelum hydration juga ditangani.
- Kegagalan endpoint jadwal disimulasikan: pesan dan tombol coba lagi tampil, launcher bantuan tidak ada.
- Kontras teks dengan latar solid pada Fatwa, Profil, Berita dan Tanya diperiksa melalui warna computed dan compositing alpha. Pemeriksaan akhir tidak menemukan rasio di bawah 4.5:1 pada teks aktif yang diperiksa. Teks disabled dikecualikan. Ini bukan sertifikasi WCAG menyeluruh; foto, video, konten kaya dari admin, dan seluruh state hover dinamis belum diaudit otomatis secara menyeluruh.
- Parser JSX/JavaScript pada semua file implementasi yang diubah: tanpa kesalahan sintaks.
- `npm run build`: kode berhasil dikompilasi dan tahap pemeriksaan tipe berjalan. Build keseluruhan gagal pada prarender akibat Prisma `ECONNREFUSED`, termasuk endpoint pengaturan dan halaman admin. Permintaan eksternal juga melaporkan `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. Build produksi belum dapat dinyatakan lulus.
- `npm run lint`: belum berjalan sebagai pemeriksaan noninteraktif karena proyek belum memiliki konfigurasi/dependensi ESLint; perintah membuka wizard Next.js. Tidak ada klaim lint lulus.

## Screenshot

Buka [galeri sebelum–sesudah](index.html). Terdapat 16 PNG: Fatwa, Profil, Berita, Tanya Ulama; masing-masing sebelum/sesudah pada 390 dan 1440 px.

Screenshot sebelum berasal dari situs publik. Screenshot sesudah memakai preview terpisah, bukan database produksi. Preview Fatwa memakai 436 dokumen dengan tautan PDF yang terbaca dari situs publik; situs publik memiliki 446 dokumen, termasuk dokumen yang tidak memiliki tautan PDF. Angka screenshot preview karena itu berbeda. FAQ/berita contoh memakai data yang telah tersedia pada proyek. Profil preview menguji kondisi tanpa isi database. Seluruh fixture dan penggantian akses database/autentikasi hanya berada di salinan pengujian; tidak disalin ke proyek hasil.

## Keterbatasan

- Database dan variabel autentikasi lokal belum lengkap/tersambung. Integrasi produksi, sesi pengguna, komentar, arsip penuh 446 dokumen, dan Akun Saya setelah login perlu diperiksa kembali pada lingkungan dengan konfigurasi yang benar.
- Keyboard virtual, sensor kompas, izin geolokasi, dan safe-area fisik iOS/Android belum diuji pada perangkat nyata. CSS memakai viewport responsif, safe-area dan penyesuaian saat input fokus.
- Foto/slide asli serta HTML artikel yang nanti diisi admin masih perlu diperiksa dengan konten produksi. Animasi slide menghormati reduced motion; tautan slide tetap mengikuti konfigurasi yang sudah ada.
- Belum ada audit pembaca layar menyeluruh atau pengujian seluruh browser.

Sebelum push/deploy: sambungkan konfigurasi lokal yang benar, jalankan ulang build dan lint setelah ESLint tersedia, lalu periksa singkat situs staging dengan data produksi. Tidak perlu menyalin data atau kode fixture preview.
