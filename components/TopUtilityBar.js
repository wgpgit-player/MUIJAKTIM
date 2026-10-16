"use client";

import Icon from "./Icon";

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
    if(window.matchMedia("(min-width:1200px)").matches)requestLocation();
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
          <Icon name="location-outline" size={14}/>
          {loc.label}
        </span>
        {dateStr && (
          <span className="flex items-center gap-1.5">
            <Icon name="calendar-outline" size={14}/>
            {dateStr}
          </span>
        )}
        {timeStr && (
          <span className="flex items-center gap-1.5 font-mono tabular-nums">
            <Icon name="time-outline" size={14}/>
            {timeStr} WIB
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 font-bold text-white">
          <Icon name="time-outline" size={16}/>
          Jadwal Shalat:
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

