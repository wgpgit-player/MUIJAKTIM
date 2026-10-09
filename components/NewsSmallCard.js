import NewsImage from "./NewsImage";
import Link from "next/link";
import { formatDateID } from "@/lib/date";

export default function NewsSmallCard({ item }) {
  return (
    <Link
      href={`/berita/${item.slug}`}
      className="flex gap-3.5 bg-white border border-line rounded-2xl overflow-hidden p-3 group hover:border-emerald/40 transition-colors"
    >
      <div className="news-thumb"><NewsImage src={item.imageUrl} category={item.category} compact /></div>
      <div className="min-w-0 flex flex-col justify-center">
        <div className="text-[10.5px] font-bold text-emerald mb-1 uppercase tracking-wide truncate">
          {item.category}
        </div>
        <div className="text-[15px] font-bold leading-snug text-ink line-clamp-2 group-hover:text-green-dk transition-colors">
          {item.title}
        </div>
        <div className="text-[11px] text-ink-soft font-semibold mt-1.5">{formatDateID(item.date)}</div>
      </div>
    </Link>
  );
}
