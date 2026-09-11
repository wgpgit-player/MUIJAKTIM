"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/",
    label: "Beranda",
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "#0B4D33" : "#5B6D64"} strokeWidth="2.2">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    href: "/fatwa",
    label: "Fatwa",
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "#0B4D33" : "#5B6D64"} strokeWidth="2">
        <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
      </svg>
    ),
  },
  {
    href: "/layanan/tanya-ulama",
    label: "Tanya",
    isFab: true,
  },
  {
    href: "/berita",
    label: "Berita",
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "#0B4D33" : "#5B6D64"} strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M8 9h8M8 13h5" />
      </svg>
    ),
  },
  {
    href: "/profil",
    label: "Profil",
    icon: (active) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "#0B4D33" : "#5B6D64"} strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-line px-2 pt-2.5 pb-3.5 shadow-nav">
      <div className="flex justify-around items-end">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          if (tab.isFab) {
            return (
              <Link key={tab.href} href={tab.href} className="flex flex-col items-center -mt-6">
                <div className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-lime flex items-center justify-center shadow-[0_6px_16px_rgba(200,240,73,0.5)] border-4 border-cream">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#083C28" strokeWidth="2.4">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span className="text-[9.5px] font-extrabold text-green-dk2 mt-0.5">{tab.label}</span>
              </Link>
            );
          }
          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-1">
              {tab.icon(active)}
              <span className={`text-[10px] font-bold ${active ? "text-green-dk" : "text-ink-soft"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
