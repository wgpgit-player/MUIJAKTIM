"use client";

import { useEffect, useState } from "react";

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "Baru saja";
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const SOURCE_COLOR = {
  "NU Online": "bg-emerald/10 text-emerald",
  Republika: "bg-amber-50 text-amber-700",
};

export default function ExternalNewsFeed() {
  const [state, setState] = useState({ loading: true, items: [] });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/news-feed")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setState({ loading: false, items: data.ok ? data.items : [] });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, items: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-white border border-line rounded-2xl p-6 md:p-7">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="font-extrabold text-[15.5px] text-green-dk2">Kabar dari Sumber Lain</div>
          <p className="text-[12px] text-ink-soft mt-1">
            Kurasi otomatis dari NU Online &amp; Republika, memperbarui sendiri secara berkala.
          </p>
        </div>
        <span className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full bg-cream border border-line px-3 py-1.5 text-[10.5px] font-bold text-ink-soft">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
          Auto-update
        </span>
      </div>

      <div className="mt-5 flex flex-col divide-y divide-line">
        {state.loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="py-4 animate-pulse">
              <div className="h-3 w-20 bg-line rounded-full mb-2.5" />
              <div className="h-4 w-3/4 bg-line rounded-full" />
            </div>
          ))}

        {!state.loading && state.items.length === 0 && (
          <div className="py-8 text-center text-[13px] text-ink-soft">
            Belum bisa memuat kabar eksternal saat ini, coba muat ulang halaman sebentar lagi.
          </div>
        )}

        {!state.loading &&
          state.items.slice(0, 6).map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 group first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                    SOURCE_COLOR[item.source] ?? "bg-cream text-ink-soft"
                  }`}
                >
                  {item.source}
                </span>
                <span className="text-[11px] text-ink-soft font-medium">{timeAgo(item.pubDate)}</span>
              </div>
              <div className="text-[13.5px] font-bold text-ink leading-snug group-hover:text-green-dk2 group-hover:underline underline-offset-2">
                {item.title}
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}
