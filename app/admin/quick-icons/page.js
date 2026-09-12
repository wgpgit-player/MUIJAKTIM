import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteQuickIcon } from "./actions";

export const metadata = { title: "Kelola Icon — Admin MUI Jakarta Timur" };

export default async function AdminQuickIconsPage() {
  const items = await prisma.quickIcon.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-extrabold text-green-dk2">Kelola Icon</h1>
        <Link
          href="/admin/quick-icons/new"
          className="bg-green-dk2 text-white font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-green-dk transition-colors"
        >
          + Icon Baru
        </Link>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream text-[11.5px] uppercase text-ink-soft font-bold">
            <tr>
              <th className="px-5 py-3">Preview</th>
              <th className="px-5 py-3">Label</th>
              <th className="px-5 py-3">Tautan</th>
              <th className="px-5 py-3">Tampil</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((i) => (
              <tr key={i.id}>
                <td className="px-5 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={i.iconUrl}
                    alt=""
                    className="w-10 h-10 object-contain rounded-lg border border-line bg-cream p-1.5"
                  />
                </td>
                <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">{i.label}</td>
                <td className="px-5 py-3 text-[12.5px] text-ink-soft max-w-[220px] truncate">{i.linkUrl}</td>
                <td className="px-5 py-3 text-[11.5px] text-ink-soft">
                  {[i.showOnDesktop && "Desktop", i.showOnMobile && "Mobile"].filter(Boolean).join(" + ") || "-"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      i.active ? "bg-emerald/15 text-green-dk2" : "bg-ink-soft/15 text-ink-soft"
                    }`}
                  >
                    {i.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/quick-icons/${i.id}`} className="text-[12.5px] font-bold text-green-dk mr-4 hover:underline">
                    Edit
                  </Link>
                  <DeleteButton action={deleteQuickIcon.bind(null, i.id)} confirmText={`Hapus icon "${i.label}"?`} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-[13px] text-ink-soft">
                  Belum ada icon.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
