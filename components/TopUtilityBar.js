"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SCHEDULE = [
  { label: "Subuh", time: "04:37" },
  { label: "Dzuhur", time: "11:55", active: true },
  { label: "Ashar", time: "15:12" },
  { label: "Maghrib", time: "17:55" },
  { label: "Isya", time: "19:04" },
];

export default function TopUtilityBar() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    );
  }, []);

  return (
    <div className="hidden md:flex items-center justify-between bg-green-dk2 px-8 h-9 text-[11.5px] text-white/80">
      <div className="flex items-center gap-5">
        <span className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Jakarta Timur
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
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 font-bold text-white">
          <Image src="/icons/jadwal-shalat.png" alt="" width={14} height={14} className="object-contain" />
          Jadwal Sholat:
        </span>
        {SCHEDULE.map((s) => (
          <span key={s.label} className={`flex items-center gap-1 ${s.active ? "text-lime font-bold" : ""}`}>
            {s.label} {s.time}
          </span>
        ))}
      </div>
    </div>
  );
}
