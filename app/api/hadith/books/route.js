// Proxy ke hadis-api-id.vercel.app (gratis, tanpa API key) untuk daftar 9 kitab hadits
// klasik (Kutubus Sittah + Malik + Ahmad + Darimi) lengkap Arab + terjemahan Indonesia.
import { getLastGood, setLastGood } from "@/lib/staleCache";

export const revalidate = 86400;

const CACHE_KEY = "hadith-books";

export async function GET() {
  try {
    const res = await fetch("https://hadis-api-id.vercel.app/hadith", {
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`hadis-api-id ${res.status}`);
    const data = await res.json();
    setLastGood(CACHE_KEY, data);
    return Response.json({ ok: true, data });
  } catch (err) {
    const stale = getLastGood(CACHE_KEY);
    if (stale) return Response.json({ ok: true, stale: true, data: stale });
    return Response.json({ ok: false, error: String(err), data: [] }, { status: 200 });
  }
}
