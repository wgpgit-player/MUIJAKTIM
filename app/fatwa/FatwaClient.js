"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, FATWA_LIST } from "./fatwa-data";

function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5" />
      <path d="M8.5 13h7M8.5 16.5h5" />
    </svg>
  );
}

const CAT_LABEL = Object.fromEntries(CATEGORIES.filter((c) => c.key !== "semua").map((c) => [c.key, c.label]));

export default function FatwaClient() {
  const [cat, setCat] = useState("semua");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return FATWA_LIST.filter((f) => {
      if (cat !== "semua" && f.category !== cat) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!f.title.toLowerCase().includes(q) && !f.number.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [cat, query]);

  const total = FATWA_LIST.length;
  const countIbadah = FATWA_LIST.filter((f) => f.category === "ibadah").length;
  const countMuamalah = FATWA_LIST.filter((f) => f.category === "muamalah").length;
  const countKontemporer = FATWA_LIST.filter((f) => f.category === "kontemporer").length;

  return (
    <div>
      {/* Hero */}
      <div className="bg-green-dk2 px-5 pt-12 pb-16 md:px-16 md:pt-16 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-[12.5px] text-lime font-bold mb-2">Beranda &rsaquo; Fiqih &amp; Fatwa</div>
          <div className="max-w-xl">
            <h1 className="text-[26px] md:text-[36px] font-extrabold leading-tight text-white mb-3">
              Kumpulan Fatwa &amp; Pedoman
            </h1>
            <p className="text-white/70 text-[13.5px] md:text-[14px] leading-relaxed">
              Pusat penelusuran dokumen hukum dan pedoman keagamaan, dihimpun dari arsip resmi Fatwa MUI Pusat
              sebagai pedoman nasional bagi umat di Jakarta Timur.
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards, mengambang menembus batas hero */}
      <div className="max-w-5xl mx-auto px-5 md:px-8 -mt-9 md:-mt-10 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Total Fatwa", value: total },
          { label: "Fiqih Ibadah", value: countIbadah },
          { label: "Fiqih Muamalah", value: countMuamalah },
          { label: "Isu Kontemporer", value: countKontemporer },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-line rounded-lg p-4 md:p-5 shadow-[0_8px_24px_-10px_rgba(11,77,51,0.2)]">
            <div className="text-[10.5px] md:text-[11px] font-bold text-ink-soft uppercase tracking-wide mb-1.5">{s.label}</div>
            <div className="text-[24px] md:text-[28px] font-extrabold text-green-dk2">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter + search */}
      <div className="max-w-7xl mx-auto px-5 md:px-16 pt-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between border-b border-line mb-6">
          <div className="flex gap-5 overflow-x-auto -mb-px">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`shrink-0 py-3 text-[13px] font-bold border-b-2 transition-colors ${
                  cat === c.key
                    ? "border-green-dk2 text-green-dk2"
                    : "border-transparent text-ink-soft hover:text-green-dk2"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="relative shrink-0 md:w-72 mb-3 md:mb-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5B6D64" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul atau nomor fatwa"
              className="w-full rounded-md border border-line pl-9 pr-4 py-2.5 text-[13px] outline-none focus:border-green-dk transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col divide-y divide-line border-t border-b border-line mb-8">
          {filtered.length === 0 && (
            <div className="text-center py-14 text-ink-soft text-[13.5px]">
              Tidak ada fatwa yang cocok dengan pencarian.
            </div>
          )}
          {filtered.map((f, i) => (
            <div key={i} className="py-4 md:py-5 flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-md bg-cream text-green-dk2 flex items-center justify-center shrink-0 mt-0.5">
                <DocIcon />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 mb-1 flex-wrap text-[11.5px]">
                  <span className="font-bold text-emerald">{CAT_LABEL[f.category]}</span>
                  <span className="text-ink-soft/50">&middot;</span>
                  <span className="text-ink-soft font-medium">{f.date}</span>
                </div>
                <div className="font-extrabold text-[14.5px] md:text-[15px] text-ink leading-snug group-hover:text-green-dk2 transition-colors">
                  {f.title}
                </div>
              </div>
              {f.pdfUrl ? (
                <a
                  href={f.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 hidden sm:inline-flex items-center gap-1.5 text-[12.5px] font-bold text-green-dk hover:text-emerald mt-1 whitespace-nowrap"
                >
                  Buka PDF &rarr;
                </a>
              ) : (
                <Link
                  href="/layanan/tanya-ulama"
                  className="shrink-0 hidden sm:inline-block text-[12.5px] font-bold text-green-dk hover:text-emerald mt-1 whitespace-nowrap"
                >
                  Detail &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="pb-4 flex flex-wrap gap-3">
          <Link
            href="/layanan/tanya-ulama"
            className="rounded-md border-[1.5px] border-green-dk text-green-dk font-bold text-[13px] px-5 py-3 hover:bg-green-dk hover:text-white transition-colors"
          >
            Tanya Ulama Langsung
          </Link>
        </div>

        <p className="text-[11.5px] text-ink-soft pb-14 leading-relaxed">
          Daftar fatwa di atas dihimpun dari arsip resmi{" "}
          <a href="https://muijakarta.or.id/fatwa" target="_blank" rel="noreferrer" className="text-green-dk font-bold hover:underline">
            Fatwa MUI Pusat
          </a>{" "}
          sebagai rujukan nasional. Tautan setiap fatwa mengarah langsung ke berkas PDF resminya. Komisi Fatwa
          MUI Jakarta Timur sendiri belum memiliki arsip nomor fatwa daerah yang dipublikasikan.
        </p>
      </div>
    </div>
  );
}
