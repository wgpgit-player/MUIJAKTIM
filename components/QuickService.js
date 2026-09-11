import Link from "next/link";

export default function QuickService({ href, label, icon }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 group">
      <div className="w-14 h-14 rounded-2xl bg-white border border-line flex items-center justify-center shadow-card group-active:scale-95 transition-transform">
        {icon}
      </div>
      <div className="text-[11px] font-bold text-center leading-tight">{label}</div>
    </Link>
  );
}
