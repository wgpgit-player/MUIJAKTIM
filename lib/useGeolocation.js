"use client";

import { useCallback, useState } from "react";

/**
 * Wraps navigator.geolocation with: a clear error reason (denied/timeout/unavailable/
 * unsupported/insecure) instead of silently falling back, and reverse geocoding
 * (BigDataCloud's free, no-key, CORS-enabled endpoint) so the UI can show an actual
 * place name instead of a generic "your location" label.
 */
export function useGeolocation(defaultLoc) {
  const [loc, setLoc] = useState(defaultLoc);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [errorReason, setErrorReason] = useState(null);

  const request = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!window.isSecureContext) {
      setStatus("error");
      setErrorReason("insecure");
      return;
    }
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorReason("unsupported");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let label = "Lokasi Anda saat ini";
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`,
            { signal: AbortSignal.timeout(5000) }
          );
          if (res.ok) {
            const data = await res.json();
            const parts = [data.locality, data.city, data.principalSubdivision].filter(Boolean);
            if (parts.length > 0) label = [...new Set(parts)].slice(0, 2).join(", ");
          }
        } catch {
          // Reverse geocode is cosmetic only — keep the generic label on failure.
        }
        setLoc({ lat: latitude, lon: longitude, label });
        setStatus("done");
      },
      (err) => {
        setStatus("error");
        setErrorReason(err.code === err.PERMISSION_DENIED ? "denied" : err.code === err.TIMEOUT ? "timeout" : "unavailable");
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  return { loc, status, errorReason, request };
}

export const GEO_ERROR_MESSAGES = {
  denied: "Izin lokasi ditolak. Aktifkan izin lokasi untuk situs ini di pengaturan browser, lalu coba lagi.",
  timeout: "Waktu mencari lokasi habis. Coba lagi atau periksa koneksi GPS/internet.",
  unavailable: "Lokasi tidak dapat ditentukan saat ini. Coba lagi sebentar lagi.",
  unsupported: "Perangkat/browser ini tidak mendukung fitur lokasi.",
  insecure: "Fitur lokasi hanya bisa dipakai lewat koneksi HTTPS.",
};
