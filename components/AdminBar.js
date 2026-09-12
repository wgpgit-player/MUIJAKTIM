"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const HIDE_KEY = "mv_adminbar_hidden";

export default function AdminBar() {
  const pathname = usePathname();
  const [role, setRole] = useState(null); // null = unknown/not admin
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRole(null);
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      setRole(profile?.role === "ADMIN" || profile?.role === "SUPER_ADMIN" ? profile.role : null);
    }
    loadRole();

    const { data: listener } = supabase.auth.onAuthStateChange(() => loadRole());
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    try {
      setHidden(localStorage.getItem(HIDE_KEY) === "1");
    } catch {}
  }, []);

  function hide() {
    setHidden(true);
    try {
      localStorage.setItem(HIDE_KEY, "1");
    } catch {}
  }

  function unhide() {
    setHidden(false);
    try {
      localStorage.removeItem(HIDE_KEY);
    } catch {}
  }

  if (!role || pathname?.startsWith("/admin")) return null;

  if (hidden) {
    return (
      <button
        onClick={unhide}
        aria-label="Tampilkan bar admin"
        className="fixed bottom-20 md:bottom-5 right-4 z-[60] w-11 h-11 rounded-full bg-green-dk2/90 backdrop-blur-xl border border-white/20 text-lime shadow-lg flex items-center justify-center hover:bg-green-dk transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 md:px-8 py-2.5 bg-green-dk2/85 backdrop-blur-xl border-b border-white/10 text-white text-[12.5px]">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2 h-2 rounded-full bg-lime shrink-0" />
        <span className="truncate">
          Anda masuk sebagai <strong>{role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</strong> — kelola konten situs ini.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="/admin"
          className="flex items-center gap-1.5 rounded-full bg-lime text-green-dk2 font-bold px-3.5 py-1.5 hover:bg-white transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Edit di Dashboard
        </a>
        <button
          onClick={hide}
          aria-label="Sembunyikan bar admin"
          className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
