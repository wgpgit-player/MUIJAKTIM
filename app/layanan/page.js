import Link from "next/link";

export const metadata = { title: "Layanan Umat — MUI Jakarta Timur" };

const layanan = [
  {
    href: "/layanan/tanya-ulama",
    title: "Tanya Ulama (Konsultasi Online/AI)",
    desc: "Layanan tanya-jawab agama interaktif melalui chat AI atau kontak tim fatwa.",
  },
  {
    href: "/layanan/jadwal-shalat",
    title: "Jadwal Shalat & Kiblat",
    desc: "Penunjuk waktu shalat real-time untuk wilayah Jakarta Timur dan kompas kiblat.",
  },
  {
    href: "/layanan/kalkulator-zakat",
    title: "Kalkulator Zakat",
    desc: "Alat hitung otomatis untuk zakat fitrah, harta (maal), emas, dan profesi.",
  },
  {
    href: "/keluarga/konsultasi",
    title: "Konsultasi Keluarga",
    desc: "Solusi seputar konflik rumah tangga, warisan, dan pernikahan.",
  },
];

export default function LayananPage() {
  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-[12.5px] text-lime font-bold mb-2">Layanan Umat</div>
          <h1 className="text-[26px] md:text-[36px] font-extrabold text-white">Fitur Interaktif untuk Jamaah</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 md:px-16 py-12 grid md:grid-cols-2 gap-5">
        {layanan.map((l) => (
          <Link key={l.href} href={l.href} className="bg-white border border-line rounded-2xl p-6 hover:border-emerald transition-colors">
            <div className="font-extrabold text-[15.5px] mb-2 text-green-dk2">{l.title}</div>
            <div className="text-[13.5px] text-ink-soft leading-relaxed">{l.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
