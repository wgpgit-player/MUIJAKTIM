import { getLastGood, setLastGood } from "@/lib/staleCache";

export const revalidate = 86400;

export async function GET(request, { params }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  const cacheKey = `hadith-${slug}-page-${page}`;

  try {
    const res = await fetch(`https://hadis-api-id.vercel.app/hadith/${slug}?page=${page}`, {
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
