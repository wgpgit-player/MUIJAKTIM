// Proxy ke equran.id (API Qur'an gratis, tanpa key, teks Arab + latin + terjemahan
// Indonesia) untuk daftar 114 surat. Data ini nyaris tidak pernah berubah, jadi cache
// lama (1 hari) + fallback ke cache terakhir kalau API sedang down.
import { getLastGood, setLastGood } from "@/lib/staleCache";

export const revalidate = 86400;

const CACHE_KEY = "quran-surat-list";

export async function GET() {
  try {
    const res = await fetch("https://equran.id/api/v2/surat", {
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`equran.id ${res.status}`);
    const data = await res.json();
    const list = data.data;
    setLastGood(CACHE_KEY, list);
    return Response.json({ ok: true, data: list });
  } catch (err) {
    const stale = getLastGood(CACHE_KEY);
    if (stale) return Response.json({ ok: true, stale: true, data: stale });
    return Response.json({ ok: false, error: String(err), data: [] }, { status: 200 });
  }
}
