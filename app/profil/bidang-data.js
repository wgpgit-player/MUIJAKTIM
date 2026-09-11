// Data Bidang & Komisi MUI Jakarta Timur, Masa Khidmat 2025-2030.
// Sumber: SK Dewan Pimpinan MUI Provinsi DKI Jakarta Nomor Kep-006/DP-P XI/II/2026 dan
// SK Internal MUI Kota Administrasi Jakarta Timur Nomor Kep-001/DP-K 01/V/2026.
// Struktur halaman mengikuti pola direktori "Bidang & Komisi" di muijakarta.or.id/komisi:
// daftar bidang (dengan jumlah anggota) di halaman induk, tabel kepengurusan lengkap di halaman detail.

export const BIDANG_LIST = [
  {
    slug: "fatwa",
    nama: "Bidang Fatwa",
    ketua: "Dr. H. Andy Hadiyanto, M.A.",
    sekretaris: "KH. Choirul Anshori, M.Pd.I",
    anggota: ["Drs. K.H. Nurul Ghulam", "Drs. KH. Rusli Amin, M.A.", "K.H. Ahmad Sanusi, Lc., M.A.", "Drs. KH. Hasan Bisri"],
  },
  {
    slug: "dakwah-pengembangan-masyarakat",
    nama: "Bidang Dakwah & Pengembangan Masyarakat",
    ketua: "K.H Ahmad Wajihudin, M.A.",
    sekretaris: "Dr. K.H. Saifullah Hasbiallah, M.Pd.",
    anggota: ["Drs. K.H. Muhammad Irianto Waladin", "Drs. KH. Akmal Shiddieq, SQ", "Hamdan Fauzi, S.Ag., SQ", "H. Abdul Wadud, S.Ag., M.M."],
  },
  {
    slug: "pemberdayaan-ekonomi-umat",
    nama: "Bidang Pemberdayaan Ekonomi Umat",
    ketua: "Arif Fauzan, S.E., M.M.",
    sekretaris: "H. M. Thabrani Nuril Anwar, S.E.",
    anggota: ["K.H. Muhammad Sholeh, Lc., M.A.", "H. Muhammad Zein, S.Sos, M.si", "H. Ahmad Bahtiar", "Romidi Karnawan, M.A.P"],
  },
  {
    slug: "pendidikan-kaderisasi",
    nama: "Bidang Pendidikan & Kaderisasi",
    ketua: "Dr. Faisal Sundani, Lc., M.Ed.",
    sekretaris: "Dr. H. Akhmad Subaki, S.E., M.M., CA., C.P.A",
    anggota: ["Dr. Abdul Fadhil, M.A.", "Rudi Muhammad Barnansyah, M.Pd.", "Imam Baihaqi, S.Pd.I", "Dr. H. Nur Fadlan, Lc., M.Si"],
  },
  {
    slug: "perempuan-remaja-keluarga",
    nama: "Bidang Perempuan, Remaja & Keluarga",
    ketua: "Hj. Siti Raudoh Hasbiyallah",
    sekretaris: "Dra. Hj. Ita Rogayah Rasyid, AS",
    anggota: ["Ustadzah Hj. Masturoh", "Hj. Ida Farida, S.E., M.M.", "Dr. Rihlah Nur Aulia, M.A.", "Dr. Sari Narulita, Lc., M.Si", "Neli S Marliana, SE", "Hj. Sutri Astuti, M.M"],
  },
  {
    slug: "hukum-perundang-undangan",
    nama: "Bidang Hukum & Perundang-undangan",
    ketua: "Noor Fajar Asa, S.H., M.H",
    sekretaris: "H. Arya Pribadie, S.E., S.H",
    anggota: ["Muhammad Hafiez, S.Ag.", "H. Danail Al-Haz, S.H.", "Erik Syam Pratama, S.H., MH., CLA", "Getri Antito, S.E., S.H., M.H."],
  },
  {
    slug: "kajian-penelitian",
    nama: "Bidang Kajian Penelitian",
    ketua: "Dr. Mudrikatul Arafah, M.A.",
    sekretaris: "Dr. DH. Ismail, M.Si",
    anggota: ["Dr. Muhammad Kamal, M.A.", "Abdul Latif, S.H.I", "KH. Satiri Achfas, Lc., M.A."],
  },
  {
    slug: "pembinaan-seni-budaya-islam",
    nama: "Bidang Pembinaan Seni Budaya Islam",
    ketua: "Dr. H. Agus Idwar, S.Sos. M.Sos",
    sekretaris: "Dr. H. Muslikhun Ikhsan, M.A.",
    anggota: ["Marah Bangun, S.S.", "Drs. H. Misda Suhanda", "H. Fuadi Zainal Muttaqin, S.E.", "Drs. KH. Sofyan Sauri"],
  },
  {
    slug: "informasi-komunikasi",
    nama: "Bidang Informasi dan Komunikasi",
    ketua: "H. M. Farid Fachrurrozi, S.Si., M.Pd.",
    sekretaris: "H. Ari Supriyatno, S.Pd.I",
    anggota: ["H. Suherman, M.A, M.Pd", "Ramdhan Wahyudin, S.Sos.", "Ahmad Fuazil Mustain Billah, B.Sc", "Muhammad Zulfikar, S.I.Kom."],
  },
  {
    slug: "ukhuwah-islamiyah-kub",
    nama: "Bidang Ukhuwah Islamiyah & KUB",
    ketua: "KH. Ahmad Ridwan, S.E., M.M.",
    sekretaris: "Drs. K.H. Abd. Rasyid Ridho HS",
    anggota: ["Dr. H. Muharam Marzuki, Ph.D", "Drs. H. Ahmadi, M.M.", "Iwan, S.Th.I"],
  },
];

export const PIMPINAN_INTI = [
  { nama: "Assoc. Prof. Dr. KH. Didi Supandi, Lc., M.A.", jabatan: "Ketua Umum" },
  { nama: "KH. Ahmad Elmutawakkel, Lc.", jabatan: "Wakil Ketua Umum" },
  { nama: "Assoc. Prof. Dr. Marjan Miharja, S.H., M.H.", jabatan: "Wakil Ketua Umum" },
  { nama: "K.H. Achmad Sudrajat, Lc., M.A.", jabatan: "Sekretaris Umum" },
  { nama: "Ahmad Ridho, S.Kom.", jabatan: "Bendahara Umum" },
];

export const DEWAN_PERTIMBANGAN = {
  ketua: "Prof. Dr. KH. Dailami Firdaus, S.H., LLM",
  wakilKetua: "Dr. (HC) Hj. Atifah Hasan, Lc",
  sekretaris: "K.H. Achmad Sudrajat, Lc., M.A. (ex officio)",
  anggota: [
    "K.H. Muhammad Nuri Thahir",
    "K.H. Munawwir Aseli, SQ. M.A.",
    "Habib Hud bin Baqir Al-Attas",
    "Komjen. Pol. (Purn.) Drs. H. Anton Bachrul Alam, S.H.",
    "Dr. Hj. Syifa Fauzia Tutty Alawiyah, M. Art",
    "K.H. Abu Hanifah Thoyyib",
    "Dr. H. Mulawarman Hannase, M.A. Hum.",
    "Dr. KH. Robi Nurhadi",
    "H. Hadiri",
    "Dr. K.H. Arif Fachrudin",
    "K.H. Lukman Hakim Hamid",
    "Hj. Nurlaila Toyyib, M.A.",
  ],
};

export function totalAnggota(b) {
  // Ketua + Sekretaris + daftar anggota
  return 2 + b.anggota.length;
}

export function getBidangBySlug(slug) {
  return BIDANG_LIST.find((b) => b.slug === slug);
}
