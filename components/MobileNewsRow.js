import Link from "next/link";

// List rapat ala NU Online: badge kategori + judul di kiri, thumbnail kecil di kanan,
// dipisah garis tipis antar-baris — bukan kartu-kartu terpisah yang renggang.
export default function MobileNewsRow({ item }) {
  return (
    <Link href={`/berita/${item.slug}`} className="flex items-center gap-3 py-3.5 border-b border-line last:border-0">
      <div className="min-w-0 flex-1">
        <span className="inline-block text-[10px] font-semibold text-emerald bg-emerald/10 px-2 py-0.5 rounded mb-1.5">
          {item.category}
        </span>
        <div className="text-[13px] font-semibold leading-snug text-ink line-clamp-2">{item.title}</div>
      </div>
      <div className={`w-16 h-16 shrink-0 rounded-lg bg-gradient-to-br ${item.gradient}`} />
    </Link>
  );
}
