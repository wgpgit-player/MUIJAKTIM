// Basis pengetahuan tanya-jawab keagamaan umum (fikih sehari-hari).
// Pencarian dilakukan berdasarkan kata kunci — jawaban ringkas, non-mengikat,
// dan bukan pengganti fatwa resmi untuk kasus spesifik.
export const FAQ = [
  {
    keywords: ["batal wudhu", "wudhu batal", "penyebab batal wudhu"],
    q: "Apa saja yang membatalkan wudhu?",
    a: "Wudhu batal karena: keluarnya sesuatu dari qubul/dubur (buang air kecil/besar, kentut), tidur nyenyak hingga hilang kesadaran, hilang akal (pingsan, mabuk, gila), dan bersentuhan kulit laki-laki-perempuan bukan mahram tanpa penghalang (menurut sebagian ulama).",
  },
  {
    keywords: ["niat puasa", "puasa ramadhan", "lafal niat puasa"],
    q: "Bagaimana niat puasa Ramadhan?",
    a: "Niat puasa Ramadhan dilakukan di malam hari sebelum fajar, cukup dalam hati dengan makna 'aku niat puasa esok hari memenuhi kewajiban Ramadhan karena Allah Ta'ala'. Lafal Arab: Nawaitu shauma ghadin 'an adaa'i fardhi syahri Ramadhaana haadzihis sanati lillaahi ta'aala.",
  },
  {
    keywords: ["zakat fitrah", "besaran zakat fitrah", "kapan bayar zakat fitrah"],
    q: "Kapan waktu terbaik membayar zakat fitrah?",
    a: "Zakat fitrah boleh ditunaikan sejak awal Ramadhan, namun waktu paling utama adalah menjelang shalat Idul Fitri, dan paling lambat sebelum shalat Id dilaksanakan. Besarannya setara 2,5 kg / 3,5 liter bahan makanan pokok per jiwa, atau senilai uangnya.",
  },
  {
    keywords: ["qadha shalat", "shalat tertinggal", "ganti shalat"],
    q: "Bagaimana cara meng-qadha shalat yang tertinggal?",
    a: "Shalat yang tertinggal karena lupa atau tertidur wajib diganti (qadha) segera saat ingat, dikerjakan seperti shalat biasa sesuai jumlah rakaat aslinya, tanpa perlu menunggu waktu shalat yang sama di hari berikutnya.",
  },
  {
    keywords: ["zakat maal", "nisab zakat maal", "syarat zakat maal"],
    q: "Apa syarat harta wajib dizakati (zakat maal)?",
    a: "Harta wajib dizakati bila: dimiliki penuh, berkembang/berpotensi berkembang, mencapai nisab (setara 85 gram emas), dan telah dimiliki selama satu tahun penuh (haul). Kadarnya 2,5% dari total harta bersih. Cek juga Kalkulator Zakat di halaman Layanan Umat.",
  },
  {
    keywords: ["jamak qashar", "shalat jamak", "shalat qashar", "safar"],
    q: "Kapan boleh menjamak dan mengqashar shalat?",
    a: "Jamak dan qashar shalat diperbolehkan bagi musafir yang menempuh jarak tertentu (kurang lebih 80-90 km) dengan tujuan yang dibolehkan syariat. Shalat yang boleh dijamak: Dzuhur-Ashar dan Maghrib-Isya, sedangkan yang boleh diqashar adalah shalat 4 rakaat menjadi 2 rakaat.",
  },
  {
    keywords: ["haid", "sholat saat haid", "wanita haid puasa"],
    q: "Apa hukum ibadah saat wanita sedang haid?",
    a: "Wanita yang sedang haid tidak diwajibkan shalat dan dilarang berpuasa, namun kewajiban puasa yang ditinggalkan wajib diqadha setelah suci. Wanita haid juga tidak diperkenankan menyentuh mushaf Al-Qur'an dan memasuki masjid untuk i'tikaf menurut pendapat mayoritas ulama.",
  },
  {
    keywords: ["riba", "bunga bank", "hukum bunga bank"],
    q: "Bagaimana hukum bunga bank dalam Islam?",
    a: "MUI melalui fatwa nasional memandang bunga bank konvensional termasuk kategori riba yang diharamkan. Umat dianjurkan menggunakan produk dan layanan perbankan syariah yang sesuai prinsip bagi hasil (mudharabah/musyarakah) sebagai alternatif.",
  },
  {
    keywords: ["nikah siri", "hukum nikah siri"],
    q: "Bagaimana hukum nikah siri?",
    a: "Secara fikih, nikah siri (tanpa dicatatkan negara) sah selama memenuhi rukun dan syarat nikah, yaitu wali, dua saksi, ijab-kabul, dan mahar. Namun secara hukum negara pernikahan tersebut tidak tercatat sehingga berpotensi merugikan hak-hak istri dan anak secara administratif; MUI menganjurkan pernikahan tetap dicatatkan secara resmi.",
  },
  {
    keywords: ["arah kiblat", "cara cek kiblat", "kiblat"],
    q: "Bagaimana cara mengetahui arah kiblat yang tepat?",
    a: "Arah kiblat dapat dihitung menggunakan koordinat lokasi terhadap Ka'bah di Makkah. Silakan gunakan fitur Kompas Kiblat pada halaman Jadwal Shalat & Kiblat di Layanan Umat untuk mengetahui derajat arah kiblat sesuai lokasi Anda saat ini.",
  },
];

export function searchFaq(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const scored = FAQ.map((item) => {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw)) score += 3;
    }
    const qWords = q.split(/\s+/).filter((w) => w.length > 2);
    for (const w of qWords) {
      if (item.q.toLowerCase().includes(w)) score += 1;
      if (item.a.toLowerCase().includes(w)) score += 0.5;
    }
    return { item, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.item);
}
