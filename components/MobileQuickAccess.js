import Link from "next/link";
import Image from "next/image";

// Section fitur tersendiri (bukan mengambang di atas hero) — background putih penuh,
// persis pola NU Online: tiap section berdiri sendiri dengan ruangnya masing-masing.
export default function MobileQuickAccess({ icons }) {
  return (
    <section className="md:hidden bg-white px-5 pt-7 pb-6 grid grid-cols-4 gap-y-6">
      {icons.map((item) => (
        <Link key={item.id} href={item.linkUrl} className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 relative">
            <Image src={item.iconUrl} alt="" fill className="object-contain" sizes="64px" />
          </div>
          <span className="text-[10.5px] font-medium text-ink leading-tight">{item.label}</span>
        </Link>
      ))}
    </section>
  );
}
