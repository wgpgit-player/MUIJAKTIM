import { getLastGood, setLastGood } from "@/lib/staleCache";

export const revalidate = 86400;

export async function GET(request, { params }) {
  const { slug, number } = await params;
  const n = parseInt(number, 10);
  if (!Number.isInteger(n) || n < 1) {
    return Response.json({ ok: false, error: "Nomor hadits tidak valid" }, { status: 400 });
  }

  const cacheKey = `hadith-${slug}-number-${n}`;

  try {
    const res = await fetch(`https://hadis-api-id.vercel.app/hadith/${slug}/${n}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`hadis-api-id ${res.status}`);
    const data = await res.json();
    setLastGood(cacheKey, data);
    return Response.json({ ok: true, data });
  } catch (err) {
    const stale = getLastGood(cacheKey);
    if (stale) return Response.json({ ok: true, stale: true, data: stale });
    return Response.json({ ok: false, error: String(err), data: null }, { status: 200 });
  }
}
