// Menarik post terbaru dari akun Instagram resmi @muijaktim lewat Instagram Graph API.
// Instagram TIDAK punya feed publik tanpa autentikasi (beda dengan YouTube RSS) — jadi ini
// butuh access token dari akun Instagram Business/Creator yang terhubung ke Facebook Page milik
// MUI Jakarta Timur. Cara mendapatkannya:
//   1. Ubah akun Instagram @muijaktim jadi akun Business/Creator dan hubungkan ke Facebook Page.
//   2. Buat App di developers.facebook.com, aktifkan produk "Instagram Graph API".
//   3. Ambil User Access Token lalu tukar jadi Long-Lived Page Access Token (berlaku ~60 hari,
//      bisa di-refresh otomatis lewat cron sebelum kedaluwarsa).
//   4. Set di environment variable hosting (mis. Vercel): IG_ACCESS_TOKEN dan IG_USER_ID.
// Selama dua variabel ini belum di-set, endpoint mengembalikan ok:false dan komponen di
// frontend otomatis menampilkan galeri fallback supaya tampilan tetap rapi.
export const revalidate = 900;

export async function GET() {
  const token = process.env.IG_ACCESS_TOKEN;
  const userId = process.env.IG_USER_ID;

  if (!token || !userId) {
    return Response.json(
      {
        ok: false,
        configured: false,
        error: "IG_ACCESS_TOKEN / IG_USER_ID belum di-set di environment variable.",
        posts: [],
      },
      { status: 200 }
    );
  }

  try {
    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&access_token=${token}&limit=6`;
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) throw new Error(`graph api ${res.status}`);
    const data = await res.json();
    const posts = (data.data ?? []).map((p) => ({
      id: p.id,
      caption: p.caption ?? "",
      mediaUrl: p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url,
      permalink: p.permalink,
      timestamp: p.timestamp,
    }));
    return Response.json({ ok: true, configured: true, posts });
  } catch (err) {
    return Response.json({ ok: false, configured: true, error: String(err), posts: [] }, { status: 200 });
  }
}
