import Link from "next/link";
import { formatDateID } from "@/lib/date";

export default function NewsHighlight({ item }) {
  return (
    <Link
      href={`/berita/${item.slug}`}
      className="block bg-white border border-line rounded-2xl overflow-hidden group"
    >
      <div
        className={`relative h-[220px] md:h-[280px] overflow-hidden ${
          item.imageUrl ? "" : `bg-gradient-to-br ${item.gradient}`
        }`}
      >
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute top-4 left-4 text-[11px] font-bold px-3 py-1.5 rounded-full bg-lime text-green-dk2">
          {item.category}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <h3 className="text-white font-extrabold text-[17px] md:text-[21px] leading-snug mb-2 group-hover:underline underline-offset-2">
            {item.title}
          </h3>
          <div className="text-white/70 text-[12px] font-semibold">{formatDateID(item.date)}</div>
        </div>
      </div>
    </Link>
  );
}
