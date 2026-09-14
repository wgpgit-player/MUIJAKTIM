import { getLastGood, setLastGood } from "@/lib/staleCache";

export const revalidate = 86400;

export async function GET(request, { params }) {
  const { nomor } = await params;
  const n = parseInt(nomor, 10);
  if (!Number.isInteger(n) || n < 1 || n > 114) {
    return Response.json({ ok: false, error: "Nomor surat tidak valid" }, { status: 400 });
  }

  const cacheKey = `quran-surat-${n}`;

  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${n}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`equran.id ${res.status}`);
    const data = await res.json();
    setLastGood(cacheKey, data.data);
    return Response.json({ ok: true, data: data.data });
  } catch (err) {
    const stale = getLastGood(cacheKey);
    if (stale) return Response.json({ ok: true, stale: true, data: stale });
    return Response.json({ ok: false, error: String(err), data: null }, { status: 200 });
  }
}
