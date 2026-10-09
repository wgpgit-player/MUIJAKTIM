import PageHeader from "@/components/PageHeader";
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
      <PageHeader title="Fitur Interaktif untuk Jamaah" desc="Layanan keagamaan untuk membantu keseharian umat Jakarta Timur." />
      <div className="site-container py-12 grid md:grid-cols-2 gap-5">
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
