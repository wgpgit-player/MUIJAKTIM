"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useGeolocation, GEO_ERROR_MESSAGES } from "@/lib/useGeolocation";
import { formatDateID } from "@/lib/date";

const DEFAULT_LOC = { lat: -6.225, lon: 106.9004, label: "Jakarta Timur (default)" };
const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_LABELS = { Fajr: "Subuh", Dhuhr: "Dzuhur", Asr: "Ashar", Maghrib: "Maghrib", Isha: "Isya" };

function formatCountdown(ms) {
  if (ms < 0) ms = 0;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Mobile-only hero — murni wallpaper + info sholat, dikembalikan ke ukuran lega
// (bukan versi padat) supaya tetap jadi tampilan pembuka yang menarik.
// Quick-access dipindah ke section terpisah (lihat MobileQuickAccess.js) — tidak ada lagi
// yang mengambang di atas hero, mengikuti pola NU Online: tiap section punya ruangnya sendiri.
export default function MobileHero({ heroImageUrl }) {
  const { loc, status: locStatus, errorReason, request: requestLocation } = useGeolocation(DEFAULT_LOC);
  const [timings, setTimings] = useState(null);
  const [hijri, setHijri] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/prayer-times?lat=${loc.lat}&lon=${loc.lon}`, {
          signal: AbortSignal.timeout(8000),
        });
        const data = await res.json();
        if (cancelled || !data.ok) return;
        setTimings(data.timings);
        setHijri(data.hijri);
      } catch {
        // Keep whatever timings were already shown; the widget just won't refresh.
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [loc]);

  const nextPrayer = useMemo(() => {
    if (!timings) return null;
    const todayStr = now.toDateString();
    const entries = PRAYER_KEYS.map((key) => {
      const [h, m] = timings[key].split(":").map(Number);
      const d = new Date(todayStr);
      d.setHours(h, m, 0, 0);
      return { key, time: d };
    });
    return entries.find((e) => e.time.getTime() > now.getTime()) ?? entries[0];
  }, [timings, now]);

  return (
    <section className="md:hidden relative overflow-hidden rounded-b-2xl pt-6 pb-10 px-5">
      <div className="absolute inset-0">
        <Image src={heroImageUrl || "/hero/slide-1.jpg"} alt="" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />
      </div>

      {/* baris atas: logo + notifikasi */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
              <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6z" />
            </svg>
          </div>
          <span className="text-white font-bold text-[14px]">MUI JAKTIM</span>
        </div>
        <button aria-label="Notifikasi" className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        </button>
      </div>

      {/* lokasi */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 mb-5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        <span className="text-white text-[13px] font-semibold">{loc.label}</span>
        <button onClick={requestLocation} className="text-white text-[13px] font-bold">
          {locStatus === "loading" ? "…" : "(Ganti)"}
        </button>
      </div>
      {locStatus === "error" && (
        <p className="relative z-10 text-center text-[11px] text-amber-200 mb-4 px-4 leading-relaxed">
          {GEO_ERROR_MESSAGES[errorReason] ?? "Gagal mendapatkan lokasi."}
        </p>
      )}

      {/* waktu sholat — besar & lega, jadi fokus utama hero */}
      <div className="relative z-10 text-center">
        <div className="text-white text-[13px] font-semibold mb-2">Waktu Sholat Berikutnya</div>
        {nextPrayer ? (
          <>
            <div className="text-white text-[28px] font-extrabold leading-tight">
              {PRAYER_LABELS[nextPrayer.key]} <span className="text-white">{timings[nextPrayer.key]}</span>{" "}
              <span className="text-[15px] font-bold text-white/90">WIB</span>
            </div>
            <div className="text-white text-[13px] font-bold mt-2">
              - {formatCountdown(nextPrayer.time.getTime() - now.getTime())} lagi
            </div>
          </>
        ) : (
          <div className="text-white/80 text-[14px] font-semibold">Memuat jadwal…</div>
        )}
        <div className="text-white/85 text-[11.5px] font-semibold mt-3">
          {formatDateID(now)}
          {hijri && ` M / ${hijri.day} ${hijri.month.en} ${hijri.year} H`}
        </div>
      </div>
    </section>
  );
}
