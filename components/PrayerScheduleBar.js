"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_LOC = { lat: -6.225, lon: 106.9004, label: "Jakarta Timur" };

const ITEMS = [
  { key: "Imsak", label: "Imsak" },
  { key: "Fajr", label: "Subuh" },
  { key: "Dhuhr", label: "Dzuhur" },
  { key: "Asr", label: "Ashar" },
  { key: "Maghrib", label: "Maghrib" },
  { key: "Isha", label: "Isya" },
];

export default function PrayerScheduleBar() {
  const [loc, setLoc] = useState(DEFAULT_LOC);
  const [timings, setTimings] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: "Lokasi Anda saat ini" }),
      () => {},
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `prayer-times:${loc.lat.toFixed(2)}:${loc.lon.toFixed(2)}:${new Date().toDateString()}`;
    async function load() {
      try {
        const res = await fetch(`/api/prayer-times?lat=${loc.lat}&lon=${loc.lon}`, {
          signal: AbortSignal.timeout(8000),
        });
        const data = await res.json();
        if (cancelled || !data.ok) throw new Error("no data");
        setTimings(data.timings);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data.timings));
        } catch {}
      } catch {
        if (cancelled) return;
        try {
          const cached = localStorage.getItem(cacheKey);
          if (cached) setTimings(JSON.parse(cached));
        } catch {}
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [loc]);

  const activeKey = useMemo(() => {
    if (!timings) return null;
    const todayStr = now.toDateString();
    const entries = ITEMS.map(({ key }) => {
      const raw = timings[key];
      if (!raw) return null;
      const [h, m] = raw.split(":").map(Number);
      const d = new Date(todayStr);
      d.setHours(h, m, 0, 0);
      return { key, time: d };
    }).filter(Boolean);
    const upcoming = entries.find((e) => e.time.getTime() > now.getTime());
    return (upcoming ?? entries[entries.length - 1])?.key ?? null;
  }, [timings, now]);

  return (
    <div className="relative bg-green-dk2 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="flex items-start gap-3 max-w-sm">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5A524" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="3" />
            <path d="M3 9h18M8 2v4M16 2v4" />
          </svg>
        </div>
        <div>
          <div className="text-white font-extrabold text-[15px] md:text-[16px]">Jadwal Sholat {loc.label}</div>
          <p className="text-white/60 text-[12px] md:text-[12.5px] leading-relaxed mt-1">
            Menampilkan jadwal sholat fardu harian berdasarkan lokasi Anda saat ini. Diperbarui secara otomatis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 md:flex gap-2.5">
        {ITEMS.map((s) => {
          const active = s.key === activeKey;
          return (
            <div
              key={s.key}
              className={`rounded-xl px-4 py-2.5 text-center min-w-[74px] ${active ? "bg-[#F5A524]" : "bg-white/10"}`}
            >
              <div className={`text-[10.5px] font-semibold ${active ? "text-green-dk2/80" : "text-emerald"}`}>
                {s.label}
              </div>
              <div className={`text-[15px] font-extrabold ${active ? "text-green-dk2" : "text-white"}`}>
                {timings ? timings[s.key] ?? "--:--" : "--:--"}
              </div>
            </div>
          );
        })}
      </div>

      <a
        href="/layanan/jadwal-shalat"
        aria-label="Lihat jadwal lengkap & kiblat"
        className="hidden md:flex absolute -bottom-6 left-6 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center hover:bg-cream transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B4D33" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      </a>
    </div>
  );
}
