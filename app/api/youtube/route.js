// Menarik video terbaru dari kanal YouTube resmi MUI Jakarta Timur lewat RSS feed publik
// (tidak butuh API key). Channel ID ditemukan lewat pencarian resmi:
// https://www.youtube.com/channel/UCPCvI_k-9ActfrHedgePADw
const CHANNEL_ID = "UCPCvI_k-9ActfrHedgePADw";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export const revalidate = 900; // cache 15 menit di server

function extract(tag, block) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : "";
}

function parseFeed(xml) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
  return entries.slice(0, 4).map((entry) => {
    const videoId = extract("yt:videoId", entry);
    const title = extract("media:title", entry) || extract("title", entry);
    const published = extract("published", entry);
    return {
      id: videoId,
      title: title.replace(/^<!\[CDATA\[|\]\]>$/g, ""),
      published,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    };
  });
}

export async function GET() {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate } });
    if (!res.ok) throw new Error(`feed ${res.status}`);
    const xml = await res.text();
    const videos = parseFeed(xml);
    if (videos.length === 0) throw new Error("no videos parsed");
    return Response.json({ ok: true, videos });
  } catch (err) {
    return Response.json({ ok: false, error: String(err), videos: [] }, { status: 200 });
  }
}
