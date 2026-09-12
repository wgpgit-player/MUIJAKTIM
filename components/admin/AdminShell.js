"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const COLLAPSE_KEY = "mv_admin_sidebar_collapsed";

function NavIcon({ label, className }) {
  // One compact glyph set covering every admin section — kept as simple stroked
  // shapes so a new nav item never needs a bespoke icon drawn for it.
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, className };
  switch (label) {
    case "Dashboard":
      return <svg {...common}><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="5" rx="1.5" /><rect x="13" y="11" width="8" height="10" rx="1.5" /><rect x="3" y="14" width="8" height="7" rx="1.5" /></svg>;
    case "Analitik":
      return <svg {...common}><path d="M4 19V9M12 19V5M20 19v-7" /></svg>;
    case "Berita":
      return <svg {...common}><path d="M4 5h13a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2Z" /><path d="M8 9h7M8 13h7M8 17h4" /></svg>;
    case "Fatwa":
      return <svg {...common}><path d="M6 3h9l4 4v14H6Z" /><path d="M14 3v5h5" /><path d="M8.5 13h7M8.5 16.5h5" /></svg>;
    case "Tanya Ulama":
      return <svg {...common}><path d="M21 11.5a8.5 8.5 0 0 1-12.9 7.3L3 20l1.2-5A8.5 8.5 0 1 1 21 11.5Z" /></svg>;
    case "Pengurus":
      return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" /><circle cx="17" cy="9" r="2.2" /><path d="M15 19c0-2.2 1.5-3.8 3.5-4" /></svg>;
    case "Bidang/Komisi":
      return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 4v16" /></svg>;
    case "Hero Slide":
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m5 17 4-4 3 3 5-5 3 3" /></svg>;
    case "Icon":
      return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2.5" /></svg>;
    case "Iklan":
      return <svg {...common}><path d="M3 10v4h4l6 4V6L7 10Z" /><path d="M17 8a5 5 0 0 1 0 8" /></svg>;
    case "Tanya AI":
      return <svg {...common}><path d="M12 2a7 7 0 0 0-7 7c0 3 1.5 4.7 2 6-.2.9-.7 2-1.5 3 1.3.2 2.5-.1 3.5-.7A7 7 0 1 0 12 2Z" /></svg>;
    case "Halaman Statis":
      return <svg {...common}><path d="M4 19.5V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v13" /><path d="M4 19.5A1.5 1.5 0 0 1 5.5 18H19" /><path d="M8 7h7M8 10.5h7" /></svg>;
    case "Artikel":
      return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h5" /></svg>;
    case "Komentar":
      return <svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /></svg>;
    case "Pengguna":
      return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>;
    case "Pengaturan":
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.6 1Z" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

function NavLink({ item, active, collapsed, onNavigate }) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13.5px] font-semibold transition-colors ${
        collapsed ? "justify-center" : ""
      } ${
        active
          ? "bg-white/20 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <NavIcon label={item.label} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export default function AdminShell({ items, role, children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {}
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  const isActive = (href) => (href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href));

  const sidebarInner = (onNavigate) => (
    <>
      <div className={`flex items-center gap-2.5 px-2 mb-6 ${collapsed && !onNavigate ? "justify-center px-0" : ""}`}>
        <div className="w-8 h-8 rounded-xl bg-lime/90 text-green-dk2 flex items-center justify-center font-extrabold text-[13px] shrink-0">
          M
        </div>
        {(!collapsed || onNavigate) && (
          <div className="min-w-0">
            <div className="text-[12px] font-extrabold text-white leading-tight truncate">Admin MUI Jaktim</div>
            <div className="text-[10.5px] text-white/50 leading-tight">{role}</div>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            collapsed={collapsed && !onNavigate}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <a
        href="/"
        className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 mt-2 text-[13px] font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-colors ${
          collapsed && !onNavigate ? "justify-center" : ""
        }`}
        title={collapsed && !onNavigate ? "Kembali ke Situs" : undefined}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
          <path d="m4 10 8-7 8 7" />
          <path d="M6 9.5V20h12V9.5" />
        </svg>
        {(!collapsed || onNavigate) && <span>Kembali ke Situs</span>}
      </a>
    </>
  );

  return (
    <div className="min-h-[80vh] bg-cream flex">
      {/* Desktop glass sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 sticky top-0 h-screen py-5 px-3 transition-[width] duration-200 ${
          collapsed ? "w-[76px]" : "w-64"
        } bg-green-dk2/75 backdrop-blur-2xl border-r border-white/10 shadow-[8px_0_32px_-16px_rgba(11,77,51,0.4)]`}
      >
        {sidebarInner(null)}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[12px] font-bold text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
          {!collapsed && "Ciutkan"}
        </button>
      </aside>

      {/* Mobile top bar + slide-over drawer */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 bg-green-dk2/80 backdrop-blur-2xl border-b border-white/10">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Buka menu admin"
          className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div className="text-[13px] font-extrabold text-white">Admin MUI Jaktim</div>
        <a href="/" className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="m4 10 8-7 8 7" />
            <path d="M6 9.5V20h12V9.5" />
          </svg>
        </a>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 max-w-[80vw] h-full flex flex-col py-5 px-3 bg-green-dk2/90 backdrop-blur-2xl border-r border-white/10">
            {sidebarInner(() => setMobileOpen(false))}
          </div>
        </div>
      )}

      <main className="flex-1 p-5 pt-20 md:pt-8 md:p-8 min-w-0">
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-5 md:p-8 shadow-[0_8px_40px_-16px_rgba(11,77,51,0.15)]">
          {children}
        </div>
      </main>
    </div>
  );
}
