# Lanjutan perbaikan visual dan interaksi

Pemeriksaan: 11 Oktober 2026. Hasil tersimpan pada folder muijaktim-web yang diminta. Tidak ada push/deployment.

## Implementasi

- Navbar beranda transparan di atas foto gedung, menjadi panel glass melayang saat scroll, lalu kembali transparan di atas. Header menggunakan posisi tetap dengan ruang yang disediakan pada halaman dalam, sehingga perubahan state tidak menggeser layout. Panel dropdown tidak dipotong oleh glass.
- Chevron resmi Ionicons chevron-down-outline berukuran 16 px, jarak visual 6 px dari label, dengan tombol 44 × 44 px. Rotasi 180 derajat berlangsung 180 ms. Tautan induk dan tombol menu terpisah secara semantik.
- Dropdown krem radius 18 px, ikon outline pada bidang hijau pucat, judul dan deskripsi. Hover, klik, Tab, Enter, ArrowDown dan Escape tersedia; fokus kembali ke trigger. Ponsel/tablet memakai accordion dan menu dengan pengelolaan fokus. aria-expanded/aria-controls dan tab aktif route turunan dipertahankan.
- 28 SVG resmi Ionicons 7.4.0 disimpan dalam komponen Icon, tanpa CDN atau dependency tambahan. Semua nama yang diminta diperiksa terhadap paket resmi. Lisensi MIT disertakan di public/vendor/ionicons/LICENSE. Logo resmi dan ilustrasi layanan tetap digunakan.
- Hero tetap satu foto statis. Overlay hijau dan motif tepi halus; empat kartu akses cepat tetap ada. Tidak ada slideshow, pager, dot, atau autoplay.
- Beranda memisahkan satu berita unggulan, berita pendukung, layanan, hikmah berpattern, media dan agenda. Berita memakai foto dari data bila tersedia dan fallback ringkas bila kosong/rusak. Tidak ada foto kegiatan, agenda, atau kutipan baru yang dibuat untuk mengisi data kosong.
- Pencarian beranda memiliki fokus, tombol hapus saat terisi, dan submit Enter ke Fatwa. Kartu akses/layanan punya feedback hover/focus, kenaikan 2 px. Foto berita membesar ringan tanpa mengubah ukuran kartu.
- Galeri/TV memakai feed dan endpoint lama. Feed kosong/gagal menampilkan tautan kanal resmi; judul video contoh dan petunjuk integrasi API dihapus. Video dibuka atas pilihan pengguna. Agenda kosong memakai pesan pendek. Slot iklan yang belum dikonfigurasi disembunyikan.
- Reveal kecil pada beberapa section tidak menyembunyikan konten awal. Tombol kembali ke atas tersedia di akhir beranda setelah melewati section; tidak menambah elemen mengambang di atas kontrol. prefers-reduced-motion mematikan animasi dan transisi.
- Launcher bantuan tersembunyi selama hero beranda terlihat, termasuk ponsel; fungsi sekretariat dibedakan dari jawaban otomatis. Launcher tidak muncul pada Tanya Ulama/Jadwal Shalat.

## Hasil pemeriksaan

- Chromium, viewport 360, 390, 768, 1024 dan 1440 px: 30 kombinasi beranda, Fatwa, Profil, Berita, detail Berita dan Tanya Ulama tanpa horizontal overflow. Pemeriksaan terakhir batas navbar/main pada Fatwa di kelima lebar lolos; ruang header memperhitungkan border.
- Dropdown desktop: perpindahan pointer trigger → item tetap terbuka; Enter membuka; ArrowDown memindahkan fokus ke item pertama; Escape menutup dan mengembalikan fokus. Fokus terlihat. Tombol chevron terukur 44 × 44 px. Panel kanan tetap di dalam viewport.
- Menu sentuh 390 px: accordion layanan memperlihatkan tautan induk dan empat submenu; Escape kembali ke tombol menu. Bottom navigation pada detail berita mengaktifkan Berita.
- Pencarian: teks zakat → hapus mengosongkan input dan memulihkan fokus; Enter menuju /fatwa?q=zakat.
- Navbar: scroll 700 px menghasilkan state glass; kembali ke atas memulihkan transparansi. Screenshot disertakan untuk kedua state, desktop dan ponsel.
- Feed Instagram/YouTube kosong/gagal dan permintaan jadwal gagal diuji dengan respons simulasi. Fallback tautan resmi/pesan ringkas tampil. News fixture tidak memiliki foto sehingga screenshot landing juga menunjukkan fallback editorial. Jalur gambar tersedia/rusak tetap diperiksa terpisah pada detail berita.
- Reduced motion: transition navbar terukur 0s. Konten reveal tidak memakai opacity:0 sebagai default.
- Build: kompilasi berhasil, pemeriksaan tipe berhasil; build keseluruhan gagal saat prerender halaman admin dan endpoint pengaturan karena koneksi database lokal ECONNREFUSED. Konfigurasi database/autentikasi tidak diubah atau diganti dengan fixture pada proyek hasil.
- Lint: perintah dijalankan, tetapi Next.js meminta konfigurasi ESLint pertama kali dan keluar. Belum ada hasil lint yang dapat dinyatakan lolos. Pemeriksaan parser atas 19 file JavaScript yang berubah tidak menemukan kesalahan sintaks.

## Screenshot dan batas pengujian

[Galeri beranda/navbar sebelum–sesudah](enhancements.html). Screenshot sebelum berasal dari situs publik; sesudah dari salinan preview dengan data proyek dan fixture terpisah. Foto gedung berasal dari aset proyek. Screenshot tidak membuktikan integrasi database produksi berfungsi. Kode fixture, pengganti autentikasi, dan middleware preview tidak disalin ke hasil.

Pengujian perangkat fisik, keyboard virtual iOS/Android, Safari, pembaca layar menyeluruh, sesi produksi, dan feed nyata masih memerlukan lingkungan yang lengkap. Model agenda belum tersedia dalam schema proyek; area agenda mempertahankan kondisi kosong. Data dan arsip resmi tidak diedit.

Referensi desain yang ditinjau: [MUI pusat](https://mui.or.id/), [MUI Jawa Timur](https://muijatim.or.id/), [panduan resmi Ionicons](https://ionic.io/ionicons/usage).
