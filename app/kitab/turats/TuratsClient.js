"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function TuratsClient() {
  const [books, setBooks] = useState([]);
  const [booksStatus, setBooksStatus] = useState("loading");

  const [selected, setSelected] = useState(null); // slug
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState(null);
  const [listStatus, setListStatus] = useState("idle");

  const [numberFilter, setNumberFilter] = useState("");
  const [single, setSingle] = useState(null);
  const [singleStatus, setSingleStatus] = useState("idle");

  const [mobileView, setMobileView] = useState("list");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/hadith/books", { signal: AbortSignal.timeout(10000) })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.data.length > 0) {
          setBooks(data.data);
          setBooksStatus("done");
          setSelected(data.data[0].slug);
        } else {
          setBooksStatus("error");
        }
      })
      .catch(() => !cancelled && setBooksStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selected || numberFilter.trim()) return;
    let cancelled = false;
    setListStatus("loading");
    fetch(`/api/hadith/${selected}?page=${page}`, { signal: AbortSignal.timeout(10000) })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.data) {
          setPageData(data.data);
          setListStatus("done");
        } else {
          setListStatus("error");
        }
      })
      .catch(() => !cancelled && setListStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [selected, page, numberFilter]);

  useEffect(() => {
    const n = parseInt(numberFilter, 10);
    if (!selected || !numberFilter.trim() || !Number.isInteger(n) || n < 1) {
      setSingle(null);
      setSingleStatus("idle");
      return;
    }
    let cancelled = false;
    setSingleStatus("loading");
    fetch(`/api/hadith/${selected}/${n}`, { signal: AbortSignal.timeout(10000) })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.data && !data.data.error) {
          setSingle(data.data);
          setSingleStatus("done");
        } else {
          setSingle(null);
          setSingleStatus("notfound");
        }
      })
      .catch(() => !cancelled && setSingleStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [selected, numberFilter]);

  const selectedBook = useMemo(() => books.find((b) => b.slug === selected), [books, selected]);

  function selectBook(slug) {
    setSelected(slug);
    setPage(1);
    setNumberFilter("");
    setMobileView("detail");
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-[12.5px] text-lime font-bold mb-2 flex items-center gap-1.5">
            <Link href="/kitab" className="hover:underline">Kitab</Link>
            <span>&rsaquo;</span>
            <span>Kitab Turats (Hadits)</span>
          </div>
          <h1 className="text-[26px] md:text-[36px] font-extrabold text-white">Kitab Turats</h1>
          <p className="text-white/70 text-[13px] md:text-[14px] mt-2 max-w-xl">
            9 kitab hadits klasik lengkap teks Arab dan terjemahan Bahasa Indonesia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 md:py-8">
        <div className="grid md:grid-cols-[260px_1fr] gap-5 md:gap-6 items-start">
          {/* Kiri: daftar kitab */}
          <div
            className={`${mobileView === "detail" ? "hidden" : "block"} md:block bg-white border border-line rounded-2xl overflow-hidden md:sticky md:top-6`}
          >
            <div className="px-4 py-3 border-b border-line text-[12px] font-bold uppercase tracking-wide text-ink-soft">
              Kitab Hadits
            </div>
            <div className="max-h-[65vh] md:max-h-[560px] overflow-y-auto divide-y divide-line">
              {booksStatus === "loading" && (
                <div className="p-4 text-[12.5px] text-ink-soft text-center">Memuat daftar kitab…</div>
              )}
              {booksStatus === "error" && (
                <div className="p-4 text-[12.5px] text-ink-soft text-center">Gagal memuat daftar kitab.</div>
              )}
              {books.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => selectBook(b.slug)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                    selected === b.slug ? "bg-green-dk2 text-white" : "hover:bg-cream text-ink"
                  }`}
                >
                  <span className={`text-[13.5px] font-bold ${selected === b.slug ? "text-white" : "text-ink"}`}>
                    {b.name}
                  </span>
                  <span className={`text-[11px] font-semibold ${selected === b.slug ? "text-white/70" : "text-ink-soft"}`}>
                    {b.total.toLocaleString("id-ID")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Kanan: daftar/detail hadits */}
          <div className={`${mobileView === "list" ? "hidden" : "block"} md:block`}>
            <button
              onClick={() => setMobileView("list")}
              className="md:hidden flex items-center gap-1.5 text-[13px] font-bold text-green-dk mb-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m15 6-6 6 6 6" />
              </svg>
              Daftar Kitab
            </button>

            {selectedBook && (
              <div className="bg-white rounded-2xl border border-line p-5 md:p-6 mb-4">
                <h2 className="text-[19px] md:text-[22px] font-extrabold text-green-dk2">{selectedBook.name}</h2>
                <p className="text-[12.5px] text-ink-soft mt-1">{selectedBook.total.toLocaleString("id-ID")} hadits</p>
                <div className="mt-4">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={numberFilter}
                    onChange={(e) => setNumberFilter(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder={`Cari nomor hadits (1–${selectedBook.total})…`}
                    className="w-full border border-line rounded-lg px-3.5 py-2.5 text-[13px] outline-none focus:border-green-dk transition-colors"
                  />
                </div>
              </div>
            )}

            {numberFilter.trim() ? (
              <>
                {singleStatus === "loading" && (
                  <div className="bg-white rounded-2xl border border-line p-8 text-center text-[13px] text-ink-soft">
                    Mencari hadits…
                  </div>
                )}
                {singleStatus === "notfound" && (
                  <div className="bg-white rounded-2xl border border-line p-8 text-center text-[13px] text-ink-soft">
                    Hadits nomor {numberFilter} tidak ditemukan di {selectedBook?.name}.
                  </div>
                )}
                {singleStatus === "done" && single && (
                  <div className="bg-white rounded-2xl border border-line p-5 md:p-6">
                    <span className="inline-block w-8 h-8 rounded-full bg-green-dk2 text-white text-[12px] font-bold flex items-center justify-center mb-3">
                      {single.number}
                    </span>
                    <p dir="rtl" className="text-[22px] md:text-[26px] leading-loose text-right text-ink font-arabic mb-3">
                      {single.arab}
                    </p>
                    <p className="text-[14px] text-ink leading-relaxed">{single.id}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {listStatus === "loading" && (
                  <div className="bg-white rounded-2xl border border-line p-8 text-center text-[13px] text-ink-soft">
                    Memuat hadits…
                  </div>
                )}
                {listStatus === "error" && (
                  <div className="bg-white rounded-2xl border border-line p-8 text-center text-[13px] text-ink-soft">
                    Gagal memuat hadits.
                  </div>
                )}
                {listStatus === "done" && pageData && (
                  <>
                    <div className="flex flex-col gap-3">
                      {pageData.items.map((h) => (
                        <div key={h.number} className="bg-white rounded-2xl border border-line p-5 md:p-6">
                          <span className="inline-block w-8 h-8 rounded-full bg-green-dk2 text-white text-[12px] font-bold flex items-center justify-center mb-3">
                            {h.number}
                          </span>
                          <p dir="rtl" className="text-[22px] md:text-[26px] leading-loose text-right text-ink font-arabic mb-3">
                            {h.arab}
                          </p>
                          <p className="text-[14px] text-ink leading-relaxed">{h.id}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-5 bg-white rounded-2xl border border-line px-4 py-3">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="text-[12.5px] font-bold text-green-dk disabled:text-ink-soft/40 disabled:cursor-not-allowed"
                      >
                        &larr; Sebelumnya
                      </button>
                      <span className="text-[12px] text-ink-soft">
                        Halaman {pageData.pagination.currentPage} / {pageData.pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPage((p) => Math.min(pageData.pagination.totalPages, p + 1))}
                        disabled={page >= pageData.pagination.totalPages}
                        className="text-[12.5px] font-bold text-green-dk disabled:text-ink-soft/40 disabled:cursor-not-allowed"
                      >
                        Berikutnya &rarr;
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
