"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useGeolocation } from "@/lib/useGeolocation";

const DEFAULT_LOC = { lat: -6.225, lon: 106.9004, label: "Jakarta Timur (default)" };
const SCHEDULE_ITEMS = [
  { key: "Fajr", label: "Subuh" },
  { key: "Dhuhr", label: "Dzuhur" },
  { key: "Asr", label: "Ashar" },
  { key: "Maghrib", label: "Maghrib" },
  { key: "Isha", label: "Isya" },
];

export default function TopUtilityBar() {
  const { loc, request: requestLocation } = useGeolocation(DEFAULT_LOC);
  const [timings, setTimings] = useState(null);
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now
    ? now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";
  const timeStr = now ? now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/prayer-times?lat=${loc.lat}&lon=${loc.lon}`, { signal: AbortSignal.timeout(8000) })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.ok) setTimings(data.timings);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [loc]);

  const activeKey = useMemo(() => {
    if (!timings || !now) return null;
    const todayStr = now.toDateString();
    const entries = SCHEDULE_ITEMS.map(({ key }) => {
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
    <div className="hidden md:flex items-center justify-between bg-green-dk2 px-8 h-9 text-[11.5px] text-white/80">
      <div className="flex items-center gap-5">
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {loc.label}
        </span>
        {dateStr && (
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2.5" />
              <path d="M3 9h18M8 2v4M16 2v4" />
            </svg>
            {dateStr}
          </span>
        )}
        {timeStr && (
          <span className="flex items-center gap-1.5 font-mono tabular-nums">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3.5 2" />
            </svg>
            {timeStr} WIB
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 font-bold text-white">
          <Image src="/icons/jadwal-shalat.png" alt="" width={14} height={14} className="object-contain" />
          Jadwal Sholat:
        </span>
        {SCHEDULE_ITEMS.map((s) => (
          <span key={s.key} className={`flex items-center gap-1 ${s.key === activeKey ? "text-lime font-bold" : ""}`}>
            {s.label} {timings ? timings[s.key] ?? "--:--" : "--:--"}
          </span>
        ))}
      </div>
    </div>
  );
}
