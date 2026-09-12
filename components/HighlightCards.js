import Link from "next/link";
import Image from "next/image";

export default function HighlightCards({ icons }) {
  return (
    <div className="max-w-6xl mx-auto bg-white border border-line rounded-lg shadow-[0_16px_40px_-16px_rgba(11,77,51,0.25)] divide-y sm:divide-y-0 sm:divide-x divide-line grid grid-cols-2 sm:grid-cols-4">
      {icons.map((c) => (
        <Link
          key={c.id}
          href={c.linkUrl}
          className="flex items-center gap-3 px-4 py-6 md:px-5 md:py-8 group hover:bg-cream transition-colors"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 relative shrink-0">
            <Image src={c.iconUrl} alt="" fill className="object-contain" sizes="56px" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-[13.5px] md:text-[14.5px] text-ink leading-tight">{c.label}</div>
            {c.description && (
              <div className="text-[11.5px] md:text-[12px] text-ink-soft leading-tight mt-1 truncate hidden md:block">
                {c.description}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
