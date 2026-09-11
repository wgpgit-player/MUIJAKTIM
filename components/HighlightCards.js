import Link from "next/link";
import Image from "next/image";

const CARDS = [
  {
    href: "/fatwa",
    title: "Fiqih & Fatwa",
    desc: "Kumpulan fatwa MUI",
    iconImg: "/icons/fatwa.png",
  },
  {
    href: "/layanan/tanya-ulama",
    title: "Tanya Ulama",
    desc: "Jawaban dari ulama",
    iconImg: "/icons/layanan-umat.png",
  },
  {
    href: "/layanan/kalkulator-zakat",
    title: "Kalkulator Zakat",
    desc: "Hitung zakat Anda",
    iconImg: "/icons/kalkulator-zakat.png",
  },
  {
    href: "/profil?tab=pengurus",
    title: "Susunan Pengurus",
    desc: "Pimpinan MUI Jaktim",
    iconImg: "/icons/profil-pimpinan.png",
  },
];

export default function HighlightCards() {
  return (
    <div className="max-w-6xl mx-auto bg-white border border-line rounded-lg shadow-[0_16px_40px_-16px_rgba(11,77,51,0.25)] divide-y sm:divide-y-0 sm:divide-x divide-line grid grid-cols-2 sm:grid-cols-4">
      {CARDS.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="flex items-center gap-3 px-4 py-6 md:px-5 md:py-8 group hover:bg-cream transition-colors"
        >
          {c.iconImg ? (
            <div className="w-12 h-12 md:w-14 md:h-14 relative shrink-0">
              <Image src={c.iconImg} alt="" fill className="object-contain" sizes="56px" />
            </div>
          ) : (
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-green-dk2/5 text-green-dk2 flex items-center justify-center shrink-0 group-hover:bg-green-dk2 group-hover:text-white transition-colors">
              {c.icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-extrabold text-[13.5px] md:text-[14.5px] text-ink leading-tight">{c.title}</div>
            <div className="text-[11.5px] md:text-[12px] text-ink-soft leading-tight mt-1 truncate hidden md:block">
              {c.desc}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
