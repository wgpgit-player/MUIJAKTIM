"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDateID } from "@/lib/date";
import QiblaCompass from "@/components/compass/QiblaCompass";
import { useGeolocation, GEO_ERROR_MESSAGES } from "@/lib/useGeolocation";

const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_LABELS = {
  Fajr: "Subuh",
  Sunrise: "Terbit",
  Dhuhr: "Dzuhur",
  Asr: "Ashar",
  Maghrib: "Maghrib",
  Isha: "Isya",
};

const DEFAULT_LOC = { lat: -6.225, lon: 106.9004, label: "Jakarta Timur (default)" };

function formatCountdown(ms) {
  if (ms < 0) ms = 0;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function JadwalShalatClient() {
  const { loc, status: locStatus, errorReason, request: useMyLocation } = useGeolocation(DEFAULT_LOC);
  const [timings, setTimings] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | done | error
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("loading");
      const cacheKey = `prayer-times:${loc.lat.toFixed(2)}:${loc.lon.toFixed(2)}:${new Date().toDateString()}`;
      try {
        const res = await fetch(`/api/prayer-times?lat=${loc.lat}&lon=${loc.lon}`, {
          signal: AbortSignal.timeout(8000),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!data.ok) throw new Error(data.error || "fetch failed");
        setTimings(data.timings);
        setHijriDate(data.hijri);
        setStatus("done");
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ timings: data.timings, hijri: data.hijri }));
        } catch {}
      } catch (e) {
        if (cancelled) return;
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) {
            const parsed = JSON.parse(cached);
            setTimings(parsed.timings);
            setHijriDate(parsed.hijri);
            setStatus("done");
            return;
          }
        } catch {}
        setStatus("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [loc]);

  // Minta lokasi otomatis saat halaman dibuka, supaya jadwal & kiblat langsung akurat
  // tanpa perlu klik manual. Kalau ditolak/gagal, tetap fallback ke DEFAULT_LOC.
  useEffect(() => {
    useMyLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextPrayer = useMemo(() => {
    if (!timings) return null;
    const todayStr = now.toDateString();
    const entries = PRAYER_KEYS.map((key) => {
      const [h, m] = timings[key].split(":").map(Number);
      const d = new Date(todayStr);
      d.setHours(h, m, 0, 0);
      return { key, time: d };
    });
    let upcoming = entries.find((e) => e.time.getTime() > now.getTime());
    if (!upcoming) {
      // after Isha — next is tomorrow's Fajr, just show countdown to midnight+Fajr estimate reset at refetch
      upcoming = entries[0];
    }
    return upcoming;
  }, [timings, now]);

  return (
    <div>
      <div className="bg-gradient-to-br from-green-dk2 to-green-dk px-5 py-10 md:px-16 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-[11px] md:text-[12.5px] text-lime font-bold mb-2 flex items-center gap-1.5 flex-wrap">
            <Link href="/layanan" className="hover:underline">Layanan Umat</Link>
            <span>&rsaquo;</span>
            <span>Jadwal Shalat &amp; Kiblat</span>
          </div>
          <h1 className="text-[26px] md:text-[36px] font-extrabold text-white">Jadwal Shalat &amp; Kiblat</h1>
          <p className="text-white/70 text-[13px] md:text-[14px] mt-2 max-w-xl">
            Waktu shalat dihitung real-time berdasarkan lokasi, lengkap dengan arah kiblat.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 md:py-12 grid md:grid-cols-[1.4fr_1fr] gap-8">
        {/* Prayer times */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className="text-[13px] font-bold text-ink">{loc.label}</div>
              {hijriDate && (
                <div className="text-[12px] text-ink-soft">
                  {formatDateID(now)}
                  {" · "}
                  {hijriDate.day} {hijriDate.month.en} {hijriDate.year} H
                </div>
              )}
            </div>
            <button
              onClick={useMyLocation}
              className="shrink-0 rounded-full border border-green-dk text-green-dk text-[12px] font-bold px-4 py-2 hover:bg-green-dk hover:text-white transition-colors"
            >
              {locStatus === "loading" ? "Mencari lokasi…" : "Gunakan Lokasi Saya"}
            </button>
          </div>

          {locStatus === "error" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-[12.5px] text-amber-800 leading-relaxed">
              {GEO_ERROR_MESSAGES[errorReason] ?? "Gagal mendapatkan lokasi."} Menampilkan jadwal untuk{" "}
              <strong>{DEFAULT_LOC.label}</strong>.
            </div>
          )}

          {status === "loading" && (
            <div className="bg-white rounded-2xl border border-line p-8 text-center text-ink-soft text-[13px]">
              Memuat jadwal shalat…
            </div>
          )}

          {status === "error" && (
            <div className="bg-white rounded-2xl border border-line p-8 text-center text-ink-soft text-[13px]">
              Gagal memuat data waktu shalat. Coba muat ulang halaman.
            </div>
          )}

          {status === "done" && timings && (
            <>
              {nextPrayer && (
                <div className="bg-green-dk2 rounded-2xl p-5 md:p-6 mb-4 text-center">
                  <div className="text-lime text-[11.5px] font-bold uppercase tracking-wide mb-1">
                    Waktu Sholat Berikutnya
                  </div>
                  <div className="text-white text-[26px] md:text-[30px] font-extrabold">
                    {PRAYER_LABELS[nextPrayer.key]} {timings[nextPrayer.key]}
                  </div>
                  <div className="text-white/80 text-[13px] font-bold mt-1">
                    − {formatCountdown(nextPrayer.time.getTime() - now.getTime())} lagi
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-line divide-y divide-line overflow-hidden">
                {["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((key) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between px-5 py-3.5 ${
                      nextPrayer?.key === key ? "bg-cream" : ""
                    }`}
                  >
                    <span className="text-[13.5px] font-semibold text-ink">{PRAYER_LABELS[key]}</span>
                    <span className="text-[14px] font-extrabold text-green-dk2">{timings[key]} WIB</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Qibla compass */}
        <div>
          <div className="text-[13px] font-bold text-ink mb-4">Arah Kiblat</div>
          <div className="bg-white rounded-2xl border border-line p-6 flex flex-col items-center">
            <QiblaCompass lat={loc.lat} lon={loc.lon} />
          </div>
        </div>
      </div>
    </div>
  );
}
