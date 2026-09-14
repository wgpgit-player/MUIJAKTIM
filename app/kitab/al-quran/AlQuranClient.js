"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function AlQuranClient() {
  const [suratList, setSuratList] = useState([]);
  const [listStatus, setListStatus] = useState("loading"); // loading | done | error
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(1);
  const [detail, setDetail] = useState(null);
  const [detailStatus, setDetailStatus] = useState("loading");
  const [ayatFilter, setAyatFilter] = useState("");
  // Mobile only: master-detail drill-down instead of stacking both columns (which used
  // to force scrolling past the entire 114-surat list before reaching any ayat).
  const [mobileView, setMobileView] = useState("list"); // list | detail

  useEffect(() => {
    let cancelled = false;
    fetch("/api/quran/surat", { signal: AbortSignal.timeout(10000) })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.data.length > 0) {
          setSuratList(data.data);
          setListStatus("done");
        } else {
          setListStatus("error");
        }
      })
      .catch(() => !cancelled && setListStatus("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setDetailStatus("loading");
    setAyatFilter("");
    fetch(`/api/quran/surat/${selected}`, { signal: AbortSignal.timeout(10000) })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok && data.data) {
          setDetail(data.data);
          setDetailStatus("done");
        } else {
          setDetailStatus("error");
        }
      })
      .catch(() => !cancelled && setDetailStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const filteredSuratList = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return suratList;
    return suratList.filter(
      (s) => s.namaLatin.toLowerCase().includes(q) || s.arti.toLowerCase().includes(q) || String(s.nomor) === q
    );
  }, [suratList, search]);

  const filteredAyat = useMemo(() => {
    if (!detail) return [];
    const q = ayatFilter.trim().toLowerCase();
    if (!q) return detail.ayat;
    return detail.ayat.filter(
      (a) => String(a.nomorAyat) === q || a.teksIndonesia.toLowerCase().includes(q) || a.teksLatin.toLowerCase().includes(q)
    );
  }, [detail, ayatFilter]);

  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-[12.5px] text-lime font-bold mb-2 flex items-center gap-1.5">
            <Link href="/kitab" className="hover:underline">Kitab</Link>
            <span>&rsaquo;</span>
            <span>Al-Qur&apos;an Digital</span>
          </div>
          <h1 className="text-[26px] md:text-[36px] font-extrabold text-white">Al-Qur&apos;an Digital</h1>
          <p className="text-white/70 text-[13px] md:text-[14px] mt-2 max-w-xl">
            114 surat lengkap dengan teks Arab, latin, dan terjemahan Bahasa Indonesia.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 md:py-8">
        <div className="grid md:grid-cols-[300px_1fr] gap-5 md:gap-6 items-start">
          {/* Kiri: daftar surat, kecil & bisa discroll. Di mobile: layar penuh, disembunyikan
              begitu 1 surat dipilih (lihat mobileView). */}
          <div
            className={`${mobileView === "detail" ? "hidden" : "block"} md:block bg-white border border-line rounded-2xl overflow-hidden md:sticky md:top-6`}
          >
            <div className="p-3 border-b border-line">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari surat…"
                className="w-full border border-line rounded-lg px-3 py-2 text-[13px] outline-none focus:border-green-dk transition-colors"
              />
            </div>
            <div className="max-h-[65vh] md:max-h-[560px] overflow-y-auto divide-y divide-line">
              {listStatus === "loading" && (
                <div className="p-4 text-[12.5px] text-ink-soft text-center">Memuat daftar surat…</div>
              )}
              {listStatus === "error" && (
                <div className="p-4 text-[12.5px] text-ink-soft text-center">Gagal memuat daftar surat.</div>
              )}
              {filteredSuratList.map((s) => (
                <button
                  key={s.nomor}
                  onClick={() => {
                    setSelected(s.nomor);
                    setMobileView("detail");
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                    selected === s.nomor ? "bg-green-dk2 text-white" : "hover:bg-cream text-ink"
                  }`}
                >
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      selected === s.nomor ? "bg-white/20 text-white" : "bg-cream text-green-dk2"
                    }`}
                  >
                    {s.nomor}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[13px] font-bold truncate ${selected === s.nomor ? "text-white" : "text-ink"}`}>
                      {s.namaLatin}
                    </span>
                    <span className={`block text-[11px] truncate ${selected === s.nomor ? "text-white/70" : "text-ink-soft"}`}>
                      {s.arti} · {s.jumlahAyat} ayat
                    </span>
                  </span>
                  <span dir="rtl" className={`shrink-0 text-[15px] font-arabic ${selected === s.nomor ? "text-white" : "text-green-dk2"}`}>
                    {s.nama}
                  </span>
                </button>
              ))}
              {listStatus === "done" && filteredSuratList.length === 0 && (
                <div className="p-4 text-[12.5px] text-ink-soft text-center">Surat tidak ditemukan.</div>
              )}
            </div>
          </div>

          {/* Kanan: ayat + terjemahan. Di mobile: layar penuh, cuma tampil setelah pilih surat. */}
          <div className={`${mobileView === "list" ? "hidden" : "block"} md:block`}>
            <button
              onClick={() => setMobileView("list")}
              className="md:hidden flex items-center gap-1.5 text-[13px] font-bold text-green-dk mb-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m15 6-6 6 6 6" />
              </svg>
              Daftar Surat
            </button>
            {detailStatus === "loading" && (
              <div className="bg-white rounded-2xl border border-line p-10 text-center text-ink-soft text-[13px]">
                Memuat ayat…
              </div>
            )}
            {detailStatus === "error" && (
              <div className="bg-white rounded-2xl border border-line p-10 text-center text-ink-soft text-[13px]">
                Gagal memuat surat ini. Coba pilih surat lain atau muat ulang halaman.
              </div>
            )}
            {detailStatus === "done" && detail && (
              <>
                <div className="bg-white rounded-2xl border border-line p-5 md:p-6 mb-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="text-[19px] md:text-[22px] font-extrabold text-green-dk2">
                        {detail.namaLatin} <span className="text-ink-soft font-semibold text-[14px]">({detail.arti})</span>
                      </h2>
                      <p className="text-[12.5px] text-ink-soft mt-1">
                        {detail.tempatTurun} · {detail.jumlahAyat} ayat
                      </p>
                    </div>
                    <span dir="rtl" className="text-[26px] font-arabic text-green-dk2">
                      {detail.nama}
                    </span>
                  </div>
                  <div className="mt-4">
                    <input
                      type="text"
                      value={ayatFilter}
                      onChange={(e) => setAyatFilter(e.target.value)}
                      placeholder="Filter ayat: nomor ayat atau kata kunci terjemahan…"
                      className="w-full border border-line rounded-lg px-3.5 py-2.5 text-[13px] outline-none focus:border-green-dk transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {filteredAyat.map((a) => (
                    <div key={a.nomorAyat} className="bg-white rounded-2xl border border-line p-5 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-8 h-8 rounded-full bg-green-dk2 text-white text-[12px] font-bold flex items-center justify-center">
                          {a.nomorAyat}
                        </span>
                      </div>
                      <p dir="rtl" className="text-[24px] md:text-[28px] leading-loose text-right text-ink font-arabic mb-3">
                        {a.teksArab}
                      </p>
                      <p className="text-[13px] italic text-ink-soft mb-2 leading-relaxed">{a.teksLatin}</p>
                      <p className="text-[14px] text-ink leading-relaxed">{a.teksIndonesia}</p>
                    </div>
                  ))}
                  {filteredAyat.length === 0 && (
                    <div className="bg-white rounded-2xl border border-line p-8 text-center text-[13px] text-ink-soft">
                      Tidak ada ayat yang cocok dengan filter.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
