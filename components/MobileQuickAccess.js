import Link from "next/link";
import Image from "next/image";

// Section fitur tersendiri (bukan mengambang di atas hero) — background putih penuh,
// persis pola NU Online: tiap section berdiri sendiri dengan ruangnya masing-masing.
// Icon custom bergaya 3D islami (hijau-emas) — ganti dari SVG Tailwind generik.
const ITEMS = [
  { href: "/layanan/jadwal-shalat", label: "Jadwal Shalat", icon: "/icons/jadwal-shalat.png" },
  { href: "/layanan/kiblat", label: "Kiblat", icon: "/icons/kiblat.png" },
  { href: "/kalender", label: "Kalender Hijriah", icon: "/icons/kalender-hijriah.png" },
  { href: "/fatwa", label: "Fatwa", icon: "/icons/fatwa.png" },
  { href: "/berita", label: "Berita", icon: "/icons/berita.png" },
  { href: "/layanan", label: "Layanan Umat", icon: "/icons/layanan-umat.png" },
  { href: "/profil", label: "Profil & Pimpinan", icon: "/icons/profil-pimpinan.png" },
  { href: "/login", label: "Login Anggota", icon: "/icons/login-anggota.png" },
];

export default function MobileQuickAccess() {
  return (
    <section className="md:hidden bg-white px-5 pt-7 pb-6 grid grid-cols-4 gap-y-6">
      {ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 relative">
            <Image src={item.icon} alt="" fill className="object-contain" sizes="64px" />
          </div>
          <span className="text-[10.5px] font-medium text-ink leading-tight">{item.label}</span>
        </Link>
      ))}
    </section>
  );
}
