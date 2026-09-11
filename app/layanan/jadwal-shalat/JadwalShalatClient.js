"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
const KAABA = { lat: 21.4225, lon: 39.8262 };

function toRad(d) {
  return (d * Math.PI) / 180;
}
function toDeg(r) {
  return (r * 180) / Math.PI;
}

function qiblaBearing(lat, lon) {
  const phiK = toRad(KAABA.lat);
  const lambdaK = toRad(KAABA.lon);
  const phi = toRad(lat);
  const lambda = toRad(lon);
  const psi =
    toDeg(
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
      )
    ) % 360;
  return (psi + 360) % 360;
}

function compassLabel(deg) {
  const dirs = ["Utara", "Timur Laut", "Timur", "Tenggara", "Selatan", "Barat Daya", "Barat", "Barat Laut"];
  return dirs[Math.round(deg / 45) % 8];
}

function formatCountdown(ms) {
  if (ms < 0) ms = 0;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function JadwalShalatClient() {
  const [loc, setLoc] = useState(DEFAULT_LOC);
  const [locStatus, setLocStatus] = useState("idle"); // idle | loading | done | error
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
      try {
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(
          2,
          "0"
        )}-${today.getFullYear()}`;
        const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${loc.lat}&longitude=${loc.lon}&method=11`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (cancelled) return;
        setTimings(data.data.timings);
        setHijriDate(data.data.date.hijri);
        setStatus("done");
      } catch (e) {
        if (!cancelled) setStatus("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [loc]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus("error");
      return;
    }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: "Lokasi Anda saat ini" });
        setLocStatus("done");
      },
      () => setLocStatus("error"),
      { timeout: 8000 }
    );
  };

  const bearing = useMemo(() => qiblaBearing(loc.lat, loc.lon), [loc]);

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
                  {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
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
            <div className="relative w-48 h-48 mb-4">
              <div className="absolute inset-0 rounded-full border-[3px] border-line" />
              <div className="absolute inset-3 rounded-full border border-line/60" />
              {["U", "T", "S", "B"].map((label, i) => (
                <div
                  key={label}
                  className="absolute text-[11px] font-bold text-ink-soft"
                  style={{
                    top: i === 0 ? "4px" : i === 2 ? "auto" : "50%",
                    bottom: i === 2 ? "4px" : "auto",
                    left: i === 3 ? "6px" : i === 1 ? "auto" : "50%",
                    right: i === 1 ? "6px" : "auto",
                    transform: i === 0 || i === 2 ? "translateX(-50%)" : "translateY(-50%)",
                  }}
                >
                  {label}
                </div>
              ))}
              <div
                className="absolute top-1/2 left-1/2 origin-bottom"
                style={{
                  width: "3px",
                  height: "76px",
                  marginLeft: "-1.5px",
                  marginTop: "-76px",
                  transform: `rotate(${bearing}deg)`,
                  transformOrigin: "bottom center",
                }}
              >
                <div className="w-full h-full bg-green-dk2 rounded-full relative">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-green-dk2" />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 -mt-[5px] -ml-[5px] rounded-full bg-green-dk2" />
            </div>
            <div className="text-[22px] font-extrabold text-green-dk2">{bearing.toFixed(1)}°</div>
            <div className="text-[12.5px] text-ink-soft font-semibold mt-0.5">
              dari Utara &middot; ke arah {compassLabel(bearing)}
            </div>
            <p className="text-[11.5px] text-ink-soft text-center leading-relaxed mt-4">
              Arahkan garis hijau sesuai kompas fisik (mis. kompas HP) yang menunjuk Utara sebenarnya untuk
              menyelaraskan arah kiblat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
