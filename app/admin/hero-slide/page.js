import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteHeroSlide } from "./actions";

export const metadata = { title: "Kelola Hero Slide — Admin MUI Jakarta Timur" };

export default async function AdminHeroSlidePage() {
  const items = await prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-extrabold text-green-dk2">Kelola Hero Slide</h1>
        <Link
          href="/admin/hero-slide/new"
          className="bg-green-dk2 text-white font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-green-dk transition-colors"
        >
          + Slide Baru
        </Link>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream text-[11.5px] uppercase text-ink-soft font-bold">
            <tr>
              <th className="px-5 py-3">Judul</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Urutan</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">{s.title}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      s.active ? "bg-emerald/15 text-green-dk2" : "bg-ink-soft/15 text-ink-soft"
                    }`}
                  >
                    {s.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">{s.sortOrder}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/hero-slide/${s.id}`} className="text-[12.5px] font-bold text-green-dk mr-4 hover:underline">
                    Edit
                  </Link>
                  <DeleteButton action={deleteHeroSlide.bind(null, s.id)} confirmText={`Hapus slide "${s.title}"?`} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-[13px] text-ink-soft">
                  Belum ada hero slide.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
