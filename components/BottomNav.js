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
    icon: (active) => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "#0B4D33" : "#5B6D64"} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
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

  return <nav aria-label="Navigasi ponsel" className="bottom-nav">{TABS.map(tab=>{const active=pathname===tab.href||(tab.href!=="/"&&pathname?.startsWith(tab.href+"/"));return <Link key={tab.href} href={tab.href} aria-current={active?"page":undefined} className={active?"is-active":""}>{tab.icon(active)}<span>{tab.label}</span></Link>;})}</nav>;
}
