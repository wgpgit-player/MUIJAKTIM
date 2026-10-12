"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {formatDateID} from "@/lib/date";
import Icon from "./Icon";
import Image from "next/image";
import { useGeolocation } from "@/lib/useGeolocation";


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

export default function MobileHero() {
  const { loc, status: locStatus, request: requestLocation } = useGeolocation(DEFAULT_LOC);
  const [loadStatus,setLoadStatus]=useState("loading");
  const [timings, setTimings] = useState(null);
  const [hijri,setHijri]=useState(null);
  const [scheduleOpen,setScheduleOpen]=useState(false);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);



  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadStatus("loading");
      setTimings(null);
      try {
        const res = await fetch(`/api/prayer-times?lat=${loc.lat}&lon=${loc.lon}`, {
          signal: AbortSignal.timeout(8000),
        });
        const data = await res.json();
        if (cancelled) return;
        if(!data.ok){setLoadStatus("error");return;}
        setLoadStatus("ready");
        setTimings(data.timings);
        setHijri(data.hijri||null);

      } catch {
        if(!cancelled)setLoadStatus("error");
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
    const upcoming=entries.find(e=>e.time.getTime()>now.getTime()); if(upcoming)return upcoming; entries[0].time.setDate(entries[0].time.getDate()+1); return entries[0];
  }, [timings, now]);

return <section className="mobile-home-hero mobile-dashboard md:hidden">
    <header className="mobile-brand">
      <Image src="/logo.png" alt="Logo resmi MUI" width={46} height={46} priority/>
      <div><h1>MUI Jakarta Timur</h1><p>Rumah Fatwa &amp; Dakwah</p></div>
    </header>
    <div className="mobile-prayer-card">
      <div className="mobile-prayer-location"><span><Icon name="location-outline" size={16}/>{loc.label.replace(' (default)','')}</span><button type="button" onClick={requestLocation} disabled={locStatus==='loading'}>{locStatus==='loading'?'Mencari…':'Ganti lokasi'}</button></div>
      <Link href="/layanan/jadwal-shalat" className="mobile-prayer-main">
        <div><span className="mobile-prayer-eyebrow">{nextPrayer?'Shalat berikutnya':'Jadwal shalat'}</span><strong>{nextPrayer?PRAYER_LABELS[nextPrayer.key]:loadStatus==='error'?'Lihat jadwal':'Memuat…'}</strong></div>
        {nextPrayer?<div className="mobile-prayer-time"><strong>{timings[nextPrayer.key]}</strong><span>WIB</span></div>:<Icon name="chevron-forward-outline" size={22}/>}
      </Link>
      <div className="mobile-prayer-footer"><span>{nextPrayer?'Dalam '+formatCountdown(nextPrayer.time.getTime()-now.getTime()):loadStatus==='error'?'Jadwal belum tersedia. Coba lagi di halaman jadwal.':'Menyiapkan jadwal untuk Anda'}</span><button type="button" className="prayer-expand" aria-expanded={scheduleOpen} aria-controls="mobile-daily-prayers" onClick={()=>setScheduleOpen(value=>!value)}>Jadwal hari ini <Icon name="chevron-forward-outline" size={16}/></button></div>
      <div id="mobile-daily-prayers" className="mobile-daily-prayers" hidden={!scheduleOpen}>{timings?<><div>{PRAYER_KEYS.map(key=><div key={key} className={nextPrayer?.key===key?"is-next":""}><span>{PRAYER_LABELS[key]}</span><strong>{timings[key]}</strong></div>)}</div><Link href="/layanan/jadwal-shalat">Buka jadwal lengkap →</Link></>:<Link href="/layanan/jadwal-shalat">Lihat jadwal lengkap →</Link>}</div>
    </div>
    <p className="mobile-calendar">{formatDateID(now)}{hijri&&<span>{hijri.day+' '+hijri.month?.en+' '+hijri.year+' H'}</span>}</p>
  </section>;
}
