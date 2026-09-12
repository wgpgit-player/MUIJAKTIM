import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateID } from "@/lib/date";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteAd } from "./actions";

export const metadata = { title: "Kelola Iklan — Admin MUI Jakarta Timur" };

export default async function AdminAdsPage() {
  const items = await prisma.advertisement.findMany({ orderBy: [{ placement: "asc" }, { sortOrder: "asc" }] });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-extrabold text-green-dk2">Kelola Iklan</h1>
        <Link
          href="/admin/ads/new"
          className="bg-green-dk2 text-white font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-green-dk transition-colors"
        >
          + Iklan Baru
        </Link>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream text-[11.5px] uppercase text-ink-soft font-bold">
            <tr>
              <th className="px-5 py-3">Preview</th>
              <th className="px-5 py-3">Judul</th>
              <th className="px-5 py-3">Slot</th>
              <th className="px-5 py-3">Periode</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((a) => (
              <tr key={a.id}>
                <td className="px-5 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.imageUrl} alt="" className="w-24 h-9 object-cover rounded-lg border border-line" />
                </td>
                <td className="px-5 py-3 text-[13.5px] font-semibold text-ink max-w-[180px] truncate">{a.title}</td>
                <td className="px-5 py-3 text-[12px] text-ink-soft">
                  <code className="bg-cream px-1.5 py-0.5 rounded">{a.placement}</code>
                </td>
                <td className="px-5 py-3 text-[12px] text-ink-soft">
                  {a.startAt || a.endAt
                    ? `${a.startAt ? formatDateID(a.startAt) : "…"} – ${a.endAt ? formatDateID(a.endAt) : "…"}`
                    : "Tanpa batas"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      a.active ? "bg-emerald/15 text-green-dk2" : "bg-ink-soft/15 text-ink-soft"
                    }`}
                  >
                    {a.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/ads/${a.id}`} className="text-[12.5px] font-bold text-green-dk mr-4 hover:underline">
                    Edit
                  </Link>
                  <DeleteButton action={deleteAd.bind(null, a.id)} confirmText={`Hapus iklan "${a.title}"?`} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-[13px] text-ink-soft">
                  Belum ada iklan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
