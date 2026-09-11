export const CATEGORIES = [
  { key: "semua", label: "Semua" },
  { key: "ibadah", label: "Fiqih Ibadah & Keseharian" },
  { key: "muamalah", label: "Fiqih Muamalah" },
  { key: "kontemporer", label: "Isu Kontemporer" },
];

// Data diambil langsung dari arsip fatwa yang dipublikasikan di muijakarta.or.id/fatwa.
// Semua 219 fatwa pada arsip tersebut berlabel "MUI Pusat" karena Komisi Fatwa MUI DKI
// Jakarta belum memiliki nomor fatwa daerah sendiri yang dipublikasikan (tercatat 0 pada
// statistik situs resminya). Tautan mengarah langsung ke berkas PDF resmi, bukan ke halaman
// web MUI.
const DOC_BASE = "https://muijakarta.or.id/fatwa/dokumen";

export const FATWA_LIST = [
  { number: "Fatwa-325332", category: "ibadah", title: "Kepeloporan Pejabat dalam Melaksanakan Ibadah", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779325333-222.pdf` },
  { number: "Fatwa-324955", category: "kontemporer", title: "Hidup Sederhana", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779324956-221.pdf` },
  { number: "Fatwa-324575", category: "kontemporer", title: "Penyalahgunaan Narkoba", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779324577-220.pdf` },
  { number: "Fatwa-324185", category: "muamalah", title: "Penyembelihan Hewan secara Mekanis", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779324186-219.pdf` },
  { number: "Fatwa-323753", category: "kontemporer", title: "Penulisan Al-Qur'an dengan Selain Huruf Arab", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779323754-218.pdf` },
  { number: "Fatwa-323310", category: "kontemporer", title: "Menghadapi Sidang Umum MPR 1978", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779323310-217.pdf` },
  { number: "Fatwa-322283", category: "kontemporer", title: "Islam Jama'ah", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779322284-215.pdf` },
  { number: "Fatwa-321678", category: "ibadah", title: "Pil Anti Haid", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779321679-214.pdf` },
  { number: "Fatwa-321276", category: "ibadah", title: "Istitha'ah dalam Melaksanakan Ibadah Haji", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779321277-213.pdf` },
  { number: "Fatwa-320903", category: "kontemporer", title: "Vasectomi dan Tubectomi", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779320904-212.pdf` },
  { number: "Fatwa-320479", category: "kontemporer", title: "Wasiat Menghibahkan Kornea Mata", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779320480-211.pdf` },
  { number: "Fatwa-320170", category: "kontemporer", title: "Bayi Tabung / Inseminasi Buatan", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779320172-210.pdf` },
  { number: "Fatwa-319489", category: "ibadah", title: "Do'a Daf'ul Bala", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779319490-209.pdf` },
  { number: "Fatwa-319059", category: "ibadah", title: "Miqat Haji dan Umroh (I)", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779319060-208.pdf` },
  { number: "Fatwa-318602", category: "kontemporer", title: "Ahmadiyah Qadiyan", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779318603-207.pdf` },
  { number: "Fatwa-318101", category: "kontemporer", title: "Pendangkalan Agama dan Penyalahgunaan Dalil", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779318102-206.pdf` },
  { number: "Fatwa-317413", category: "muamalah", title: "Perkawinan Campuran", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779317414-205.pdf` },
  { number: "Fatwa-317011", category: "ibadah", title: "Shalat dan Puasa di Daerah yang Waktu Siang dan Malamnya Tidak Seimbang", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779317013-204.pdf` },
  { number: "Fatwa-316585", category: "kontemporer", title: "Operasi Perubahan / Penyempurnaan Kelamin", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779316586-203.pdf` },
  { number: "Fatwa-316210", category: "muamalah", title: "Makanan dan Minuman yang Bercampur dengan Najis", date: "18 Juni 2026", pdfUrl: `${DOC_BASE}/mui-pusat-1781779316210-202.pdf` },
];
