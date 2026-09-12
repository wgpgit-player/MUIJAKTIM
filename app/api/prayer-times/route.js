// Proxy ke Aladhan API berdasarkan koordinat pengguna (current location), dengan
// timeout + fallback ke cache terakhir yang valid per (lat,lon,tanggal) kalau fetch gagal.
import { getLastGood, setLastGood } from "@/lib/staleCache";

export const revalidate = 3600;

function roundCoord(n) {
  return Math.round(n * 100) / 100; // ~1.1km precision, cukup untuk jadwal sholat
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat"));
  const lon = parseFloat(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ ok: false, error: "lat/lon wajib diisi dan valid" }, { status: 400 });
  }

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${today.getFullYear()}`;
  const cacheKey = `prayer-times:${roundCoord(lat)}:${roundCoord(lon)}:${dateStr}`;

  try {
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=11`;
    const res = await fetch(url, { next: { revalidate }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`aladhan ${res.status}`);
    const data = await res.json();
    const payload = {
      timings: data.data.timings,
      hijri: data.data.date.hijri,
      gregorian: data.data.date.gregorian,
    };
    setLastGood(cacheKey, payload);
    return Response.json({ ok: true, ...payload });
  } catch (err) {
    const stale = getLastGood(cacheKey);
    if (stale) {
      return Response.json({ ok: true, stale: true, ...stale });
    }
    return Response.json({ ok: false, error: String(err) }, { status: 200 });
  }
}
