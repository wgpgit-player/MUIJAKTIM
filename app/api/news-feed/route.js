// Agregator berita otomatis — menarik headline terbaru dari sumber Islami terpercaya
// lewat RSS publik (bukan menerbitkan ulang teks utuh, hanya judul + ringkasan singkat +
// tautan balik ke sumber asli, supaya tidak melanggar hak cipta media sumber).
// Tayang otomatis tanpa perlu direview manual karena isinya murni kurasi tautan, bukan
// konten editorial atas nama MUI Jakarta Timur.
import { getLastGood, setLastGood } from "@/lib/staleCache";

const SOURCES = [
  { key: "nu-online", name: "NU Online", feed: "https://nu.or.id/rss.xml" },
  { key: "republika", name: "Republika", feed: "https://www.republika.co.id/rss" },
];

const CACHE_KEY = "news-feed-items";

export const revalidate = 1800; // cache 30 menit

function extract(tag, block) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  if (!m) return "";
  return m[1]
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function parseRss(xml, source) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  return items.slice(0, 6).map((block) => {
    const title = extract("title", block);
    const link = extract("link", block);
    const pubDate = extract("pubDate", block);
    const descRaw = extract("description", block);
    const excerpt = descRaw.length > 160 ? descRaw.slice(0, 157).trimEnd() + "…" : descRaw;
    return {
      title,
      link,
      pubDate,
      excerpt,
      source: source.name,
      sourceKey: source.key,
    };
  });
}

export async function GET() {
  const results = await Promise.allSettled(
    SOURCES.map(async (source) => {
      const res = await fetch(source.feed, {
        next: { revalidate },
        headers: { "User-Agent": "Mozilla/5.0 (compatible; MUIJaktimBot/1.0)" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`${source.key} ${res.status}`);
      const xml = await res.text();
      return parseRss(xml, source);
    })
  );

  const items = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  const errors = results
    .map((r, i) => (r.status === "rejected" ? `${SOURCES[i].key}: ${r.reason}` : null))
    .filter(Boolean);

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  if (items.length > 0) {
    setLastGood(CACHE_KEY, items);
    return Response.json({ ok: true, items, sources: SOURCES.map((s) => s.name), errors });
  }

  const stale = getLastGood(CACHE_KEY);
  if (stale) {
    return Response.json({ ok: true, stale: true, items: stale, sources: SOURCES.map((s) => s.name), errors });
  }

  return Response.json({ ok: false, items: [], sources: SOURCES.map((s) => s.name), errors });
}
