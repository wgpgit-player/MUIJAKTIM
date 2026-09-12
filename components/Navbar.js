"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TopUtilityBar from "./TopUtilityBar";
import { createClient } from "@/lib/supabase/client";

const MENU = [
  {
    label: "Tentang Kami",
    href: "/profil",
    sub: [
      { label: "Profil MUI Jaktim", href: "/profil", desc: "Sejarah, latar belakang, serta fungsi MUI di Jakarta Timur" },
      { label: "Susunan Pengurus", href: "/profil?tab=pengurus", desc: "Bagan struktur dan daftar nama pengurus lengkap setiap komisi" },
      { label: "Bidang & Komisi", href: "/profil/komisi", desc: "Daftar lengkap bidang, jumlah anggota, dan susunan kepengurusan tiap komisi" },
      { label: "Visi, Misi & Program", href: "/profil?tab=visi-misi", desc: "Arah tujuan organisasi dan daftar program kerja unggulan" },
    ],
  },
  {
    label: "Berita & Opini",
    href: "/berita",
    sub: [
      { label: "Kabar Jakarta Timur", href: "/berita/kabar-jakarta-timur", desc: "Liputan acara, kegiatan, dan berita keagamaan lokal" },
      { label: "Opini Ulama", href: "/berita/opini", desc: "Tulisan dan pandangan ulama terkait isu sosial-keagamaan terkini" },
      { label: "Rilis Pers / Maklumat", href: "/berita/rilis-pers", desc: "Dokumen pernyataan sikap, himbauan, atau pengumuman resmi" },
    ],
  },
  {
    label: "Fiqih & Fatwa",
    href: "/fatwa",
    sub: [
      { label: "Fiqih Ibadah & Kesehatan", href: "/fatwa/ibadah-kesehatan", desc: "Panduan praktis ibadah harian (shalat, puasa) dan adab" },
      { label: "Fiqih Muamalah (Ekonomi Syariah)", href: "/fatwa/muamalah", desc: "Hukum transaksi modern, jual beli, dan investasi" },
      { label: "Direktori Fatwa Kontemporer", href: "/fatwa/direktori-kontemporer", desc: "Arsip putusan fatwa MUI mengenai masalah-masalah modern" },
    ],
  },
  {
    label: "Kitab",
    href: "/kitab",
    sub: [
      { label: "Al-Qur'an Digital", href: "/kitab/al-quran", desc: "Al-Qur'an dengan terjemahan, tajwid, dan tafsir ringkas" },
      { label: "Turats (Kitab-kitab)", href: "/kitab/turats", desc: "Direktori rujukan dan terjemahan kitab klasik (salaf & khalaf)" },
      { label: "Kamus", href: "/kitab/kamus", desc: "Kamus Arab-Indonesia, Inggris-Indonesia & glosarium istilah" },
    ],
  },
  {
    label: "Amalan",
    href: "/amalan",
    sub: [
      { label: "Fiqih Wanita (Muslimah)", href: "/keluarga/fiqih-wanita", desc: "Hukum syariat khusus perempuan (haid, aurat, perhiasan, dll)" },
      { label: "Parenting Islami", href: "/keluarga/parenting", desc: "Tips mendidik anak dan membangun keluarga harmonis" },
      { label: "Doa & Dzikir", href: "/amalan/doa-dzikir", desc: "Kumpulan doa harian dan dzikir rutin sesuai tuntunan" },
      { label: "Teks Khutbah Jumat", href: "/amalan/khutbah-jumat", desc: "Bank naskah khutbah berkualitas dan siap diedit" },
      { label: "Hikmah & Akhlak", href: "/amalan/hikmah-akhlak", desc: "Kisah teladan, nasehat bijak, dan materi penyucian jiwa" },
    ],
  },
  {
    label: "Layanan Umat",
    href: "/layanan",
    sub: [
      { label: "Tanya Ulama (Konsultasi Online / AI)", href: "/layanan/tanya-ulama", desc: "Layanan tanya-jawab agama interaktif melalui chat AI" },
      { label: "Jadwal Shalat & Kiblat", href: "/layanan/jadwal-shalat", desc: "Penunjuk waktu shalat real-time dan kompas kiblat" },
      { label: "Kalkulator Zakat", href: "/layanan/kalkulator-zakat", desc: "Alat hitung zakat fitrah, harta (maal), emas, dan profesi" },
      { label: "Konsultasi Keluarga", href: "/keluarga/konsultasi", desc: "Solusi seputar konflik rumah tangga, warisan, dan pernikahan" },
    ],
  },
];

function ChevronDown({ className }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavDropdown({ item, tone }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href={item.href}
        className={`flex items-center gap-0.5 transition-colors hover:text-emerald ${tone}`}
      >
        {item.label}
        <ChevronDown className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </Link>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
          <div className="w-72 bg-white rounded-xl border border-line shadow-[0_16px_40px_-8px_rgba(11,77,51,0.25)] p-1.5">
            {item.sub.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="block rounded-lg px-3.5 py-2.5 text-[13px] font-semibold text-ink leading-snug whitespace-normal hover:bg-cream hover:text-green-dk2 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setIsLoggedIn(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setIsLoggedIn(!!session));
    return () => listener.subscription.unsubscribe();
  }, []);

  const accountHref = isLoggedIn ? "/profil/akun" : "/login";
  const accountLabel = isLoggedIn ? "Akun Saya" : "Login";

  // Homepage: transparent over the hero, becomes a fixed glass bar once scrolled past it.
  if (isHome) {
    return (
      <header className="hidden md:block fixed top-0 inset-x-0 z-30">
        <TopUtilityBar />
        <div
          className={`px-8 transition-all duration-300 ${
            scrolled ? "py-3 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-sm" : "py-6 bg-transparent"
          }`}
        >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="Logo MUI Jakarta Timur" width={26} height={26} className="object-contain" />
            <div className="leading-none">
              <div className={`font-extrabold text-[11.5px] tracking-wide transition-colors ${scrolled ? "text-green-dk2" : "text-white"}`}>
                Majelis Ulama Indonesia
              </div>
              <div className={`text-[9px] font-semibold mt-0.5 transition-colors ${scrolled ? "text-ink-soft" : "text-white/75"}`}>
                Kota Adm. Jakarta Timur
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-4 text-[12px] font-semibold whitespace-nowrap">
            {MENU.map((item) => (
              <NavDropdown key={item.href} item={item} tone={scrolled ? "text-ink" : "text-white/85 hover:text-lime"} />
            ))}
          </nav>

          <Link
            href={accountHref}
            className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold transition-colors ${
              scrolled
                ? "bg-green-dk2 text-white hover:bg-green-dk"
                : "bg-white text-green-dk2 hover:bg-lime"
            }`}
          >
            {accountLabel}
          </Link>
        </div>
        </div>
      </header>
    );
  }

  // All other pages: utility bar scrolls away, main nav stays sticky.
  return (
    <div>
      <TopUtilityBar />
      <header className="sticky top-0 z-40 hidden md:block bg-white border-b border-line">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-2.5">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.png" alt="Logo MUI Jakarta Timur" width={34} height={34} className="object-contain" />
          <div className="leading-none">
            <div className="font-extrabold text-[13px] text-green-dk2">Majelis Ulama Indonesia</div>
            <div className="text-[9.5px] text-ink-soft font-semibold mt-0.5">Kota Adm. Jakarta Timur</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-[12.5px] font-semibold whitespace-nowrap">
          {MENU.map((item) => (
            <NavDropdown key={item.href} item={item} tone="text-ink" />
          ))}
        </nav>

        <Link
          href={accountHref}
          className="shrink-0 rounded-full border-[1.5px] border-green-dk text-green-dk px-4 py-1.5 text-[12.5px] font-bold hover:bg-green-dk hover:text-white transition-colors"
        >
          {accountLabel}
        </Link>
      </div>
      </header>
    </div>
  );
}
