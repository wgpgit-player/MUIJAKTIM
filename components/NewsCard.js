import { formatDateID } from "@/lib/date";

export default function NewsCard({ item }) {
  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden">
      <div
        className={`relative h-[170px] md:h-[190px] flex items-end p-4 ${
          item.imageUrl ? "" : `bg-gradient-to-br ${item.gradient}`
        }`}
      >
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <span className="relative text-[11.5px] font-bold px-3 py-1.5 rounded-full bg-white/92 text-green-dk">
          {item.category}
        </span>
      </div>
      <div className="p-5">
        <div className="text-[12px] text-ink-soft font-semibold mb-2">{formatDateID(item.date)}</div>
        <div className="text-[15.5px] font-bold leading-snug text-ink">{item.title}</div>
      </div>
    </div>
  );
}
