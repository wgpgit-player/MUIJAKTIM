// Proxy khusus arah Indonesia<->Arab untuk fitur Kamus.
//
// Awalnya pakai MyMemory API, tapi ternyata database terjemahan crowd-sourced mereka
// untuk pasangan id<->ar sering salah total (mis. "terima kasih" -> "tapador inti").
// Diganti ke endpoint publik translate.googleapis.com (tanpa API key, dipakai luas oleh
// proyek open-source sebagai "Google Translate tanpa key") yang hasilnya jauh lebih
// akurat karena mesin terjemahan sungguhan, bukan basis data hasil kontribusi manual.
const ALLOWED_PAIRS = new Set(["id|ar", "ar|id"]);

export async function POST(request) {
  try {
    const { text, from, to } = await request.json();
    const langpair = `${from}|${to}`;

    if (!text || !text.trim() || !ALLOWED_PAIRS.has(langpair)) {
      return Response.json({ ok: false, error: "Permintaan tidak valid" }, { status: 400 });
    }
    if (text.length > 500) {
      return Response.json({ ok: false, error: "Teks terlalu panjang (maks 500 karakter)" }, { status: 400 });
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`translate ${res.status}`);
    const data = await res.json();

    const translated = data?.[0]?.map((seg) => seg[0]).join("");
    if (!translated) throw new Error("no translation");

    return Response.json({ ok: true, translated });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 200 });
  }
}
