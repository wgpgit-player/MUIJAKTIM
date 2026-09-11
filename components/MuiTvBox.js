"use client";

import { useEffect, useState } from "react";

export default function MuiTvBox() {
  const [state, setState] = useState({ loading: true, video: null });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/youtube")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.videos?.length > 0) {
          setState({ loading: false, video: data.videos[0] });
        } else {
          setState({ loading: false, video: null });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, video: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const v = state.video;

  return (
    <div className="bg-white border border-line rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3.5">
        <span className="font-extrabold text-[13.5px] text-ink">MUI Jaktim TV</span>
        <a
          href="https://www.youtube.com/channel/UCPCvI_k-9ActfrHedgePADw"
          target="_blank"
          rel="noreferrer"
          className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full hover:bg-red-100 transition-colors"
        >
          Subscribe
        </a>
      </div>

      <a
        href={v ? v.url : "https://www.youtube.com/channel/UCPCvI_k-9ActfrHedgePADw"}
        target="_blank"
        rel="noreferrer"
        className="relative aspect-video rounded-xl bg-ink/80 flex items-center justify-center overflow-hidden block group"
      >
        {v?.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={v.thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
        <div className="relative w-11 h-11 rounded-full bg-white/90 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0B4D33">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </a>

      <div className="text-[12.5px] font-bold text-ink leading-snug mt-3">
        {v ? v.title : "Kajian Rutin: Merawat Ukhuwah Islamiyah di Tengah Keberagaman"}
      </div>
      <p className="text-[11px] text-ink-soft/70 mt-1.5">
        {v ? "Video terbaru dari kanal YouTube MUI Jakarta Timur." : "Menampilkan pratinjau. Video terbaru akan tampil otomatis di sini."}
      </p>
    </div>
  );
}
