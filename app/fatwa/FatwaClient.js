"use client";
import PageHeader from "@/components/PageHeader";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "./fatwa-data";

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

export default function FatwaClient({ fatwaList }) {
  const [cat, setCat] = useState("semua");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(20);
  useEffect(() => { setQuery(new URLSearchParams(window.location.search).get("q") || ""); }, []);

  const filtered = useMemo(() => {
    return fatwaList.filter((f) => {
      if (cat !== "semua" && f.category !== cat) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!f.title.toLowerCase().includes(q) && !(f.number || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [cat, query, fatwaList]);

  const total = fatwaList.length;
  const countIbadah = fatwaList.filter((f) => f.category === "ibadah").length;
  const countMuamalah = fatwaList.filter((f) => f.category === "muamalah").length;
  const countKontemporer = fatwaList.filter((f) => f.category === "kontemporer").length;

  return (
    <div>
      {/* Hero */}
      <PageHeader title="Kumpulan Fatwa & Pedoman" desc="Pusat penelusuran dokumen hukum dan pedoman keagamaan, dihimpun dari arsip resmi Fatwa MUI Pusat sebagai pedoman nasional bagi umat di Jakarta Timur." />

      {/* Filter + search */}
      <div className="site-container pt-8">
        <div className="fatwa-controls">
          <div className="category-filters">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                aria-pressed={cat === c.key}
                onClick={() => { setCat(c.key); setVisible(20); }}
                className={`filter-chip shrink-0 py-3 text-[13px] font-bold border transition-colors ${
                  cat === c.key
                    ? "border-green-dk2 bg-green-dk2 text-white"
                    : "border-line bg-white text-ink-soft hover:text-green-dk2"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="fatwa-search relative">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5B6D64" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              aria-label="Cari judul atau nomor fatwa"
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisible(20); }}
              placeholder="Cari judul atau nomor fatwa"
              className="w-full rounded-md border border-line pl-9 pr-4 py-2.5 text-[13px] outline-none focus:border-green-dk transition-colors"
            />
          </div>
        </div>

        <div className="fatwa-summary" aria-label="Statistik arsip">{[{label:"Total Fatwa",value:total},{label:"Fiqih Ibadah",value:countIbadah},{label:"Fiqih Muamalah",value:countMuamalah},{label:"Isu Kontemporer",value:countKontemporer}].map(s=><div key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>)}</div>
        <p className="results-count" role="status">{filtered.length} dokumen ditemukan{query.trim() ? ' untuk “'+query.trim()+'”' : ''}. Menampilkan {Math.min(visible,filtered.length)} dokumen.</p>
        {/* List */}
        <div className="flex flex-col divide-y divide-line border-t border-b border-line mb-8">
          {filtered.length === 0 && (
            <div className="text-center py-14 text-ink-soft text-[13.5px]">
              Tidak ada fatwa yang cocok dengan pencarian.
            </div>
          )}
          {filtered.slice(0, visible).map((f, i) => (
            <div key={i} className="fatwa-row py-4 md:py-5 flex items-start gap-4 group">
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
                  className="shrink-0 inline-flex min-h-[44px] items-center gap-1.5 text-[12.5px] font-bold text-green-dk hover:text-emerald mt-1 whitespace-nowrap"
                >
                  Buka PDF &rarr;
                </a>
              ) : (
                <Link
                  href="/layanan/tanya-ulama"
                  className="shrink-0 inline-flex min-h-[44px] text-[12.5px] font-bold text-green-dk hover:text-emerald mt-1 whitespace-nowrap"
                >
                  Detail &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>

        {visible < filtered.length && <button className="load-more" onClick={()=>setVisible(n=>n+20)}>Muat 20 dokumen berikutnya</button>}
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
