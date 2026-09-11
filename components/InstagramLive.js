"use client";

import { useEffect, useState } from "react";

const FALLBACK_POSTS = [
  { caption: "Kajian Fiqih Muamalah: hukum jual-beli online dan akad digital.", gradient: "from-green-dk2 to-emerald" },
  { caption: "Tanya jawab: bagaimana hukum investasi saham syariah?", gradient: "from-emerald to-green" },
  { caption: "Fatwa terbaru seputar zakat penghasilan profesi.", gradient: "from-green-dk to-green" },
  { caption: "Dokumentasi sidang komisi fatwa MUI Jakarta Timur.", gradient: "from-green-dk2 to-green" },
  { caption: "Ringkasan hukum ibadah harian: qadha shalat dan puasa.", gradient: "from-emerald to-green-dk" },
  { caption: "Edukasi ekonomi syariah untuk pelaku UMKM.", gradient: "from-green to-emerald" },
];

/**
 * variant "compact": grid 2 kolom kecil (dipakai di sidebar homepage)
 * variant "full": grid 2/3 kolom dengan caption overlay (dipakai di halaman Fiqih & Fatwa)
 */
export default function InstagramLive({ variant = "compact", count = 4 }) {
  const [state, setState] = useState({ loading: true, live: false, posts: [] });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.posts?.length > 0) {
          setState({ loading: false, live: true, posts: data.posts.slice(0, count) });
        } else {
          setState({ loading: false, live: false, posts: [] });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, live: false, posts: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [count]);

  const items = state.live ? state.posts : FALLBACK_POSTS.slice(0, count);
  const gridCols = variant === "full" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2";
  const gap = variant === "full" ? "gap-2.5 md:gap-3" : "gap-2";

  return (
    <div>
      <div className={`grid ${gridCols} ${gap}`}>
        {items.map((item, i) => {
          const isLive = state.live;
          const href = isLive ? item.permalink : "https://www.instagram.com/muijaktim";
          return (
            <a
              key={isLive ? item.id : i}
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`group relative aspect-square rounded-lg overflow-hidden ${
                isLive ? "bg-cream" : `bg-gradient-to-br ${item.gradient}`
              }`}
            >
              {isLive && item.mediaUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.mediaUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <svg
                  width={variant === "full" ? 22 : 16}
                  height={variant === "full" ? 22 : 16}
                  viewBox="0 0 24 24"
                  fill="#fff"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z" />
                </svg>
              </div>
              {variant === "full" && (
                <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-[10.5px] leading-snug line-clamp-2">{item.caption}</p>
                </div>
              )}
            </a>
          );
        })}
      </div>
      <p className="text-[11px] text-ink-soft/70 mt-3">
        {state.live
          ? "Konten ditarik otomatis dari akun Instagram resmi MUI Jakarta Timur."
          : "Menampilkan pratinjau. Hubungkan Instagram Graph API untuk menarik post terbaru secara otomatis."}
      </p>
    </div>
  );
}
