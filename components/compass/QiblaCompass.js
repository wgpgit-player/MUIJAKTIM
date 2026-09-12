"use client";

import { useEffect, useState } from "react";
import { qiblaBearing, compassLabel } from "@/lib/qibla";

export default function QiblaCompass({ lat, lon }) {
  const [heading, setHeading] = useState(null);
  const [supportStatus, setSupportStatus] = useState("idle"); // idle | needs-permission | active | unsupported
  const [error, setError] = useState(null);

  const bearing = lat != null && lon != null ? qiblaBearing(lat, lon) : null;

  useEffect(() => {
    if (typeof window === "undefined" || !window.DeviceOrientationEvent) {
      setSupportStatus("unsupported");
      return;
    }
    // iOS 13+ requires an explicit permission request from a user gesture.
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      setSupportStatus("needs-permission");
    } else {
      setSupportStatus("active");
    }
  }, []);

  useEffect(() => {
    if (supportStatus !== "active") return;

    function handleOrientation(e) {
      const compassHeading = e.webkitCompassHeading ?? (e.alpha != null ? 360 - e.alpha : null);
      if (compassHeading != null) setHeading(compassHeading);
    }

    const eventName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(eventName, handleOrientation, true);
    return () => window.removeEventListener(eventName, handleOrientation, true);
  }, [supportStatus]);

  async function requestPermission() {
    try {
      const result = await DeviceOrientationEvent.requestPermission();
      if (result === "granted") {
        setSupportStatus("active");
      } else {
        setError("Izin sensor kompas ditolak.");
      }
    } catch (e) {
      setError("Gagal meminta izin sensor: " + String(e));
    }
  }

  if (bearing == null) {
    return <p className="text-[13px] text-ink-soft">Menunggu lokasi untuk menghitung arah kiblat…</p>;
  }

  const needleRotation = heading != null ? bearing - heading : bearing;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-56 h-56 rounded-full border-4 border-green-dk2/20 bg-white shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-ink-soft">
          <span className="absolute top-2">U</span>
          <span className="absolute bottom-2">S</span>
          <span className="absolute left-2">B</span>
          <span className="absolute right-2">T</span>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-150"
          style={{ transform: `rotate(${needleRotation}deg)` }}
        >
          <svg width="28" height="140" viewBox="0 0 28 140">
            <polygon points="14,0 28,60 14,46 0,60" fill="#0B4D33" />
            <rect x="11" y="60" width="6" height="70" fill="#0B4D33" opacity="0.35" />
          </svg>
        </div>
      </div>

      <div className="text-center">
        <div className="text-[15px] font-extrabold text-green-dk2">
          Kiblat: {bearing.toFixed(1)}° ({compassLabel(bearing)})
        </div>
        {supportStatus === "active" && heading != null && (
          <p className="text-[12px] text-ink-soft mt-1">Jarum mengikuti arah device secara live.</p>
        )}
        {supportStatus === "needs-permission" && (
          <button
            onClick={requestPermission}
            className="mt-2 bg-green-dk2 text-white font-bold text-[13px] px-4 py-2 rounded-xl hover:bg-green-dk transition-colors"
          >
            Aktifkan Sensor Kompas
          </button>
        )}
        {supportStatus === "unsupported" && (
          <p className="text-[12px] text-ink-soft mt-1">
            Perangkat/browser ini tidak mendukung sensor kompas — gunakan sudut di atas secara manual.
          </p>
        )}
        {error && <p className="text-[12px] text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  );
}
