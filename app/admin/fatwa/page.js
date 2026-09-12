import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateID } from "@/lib/date";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteFatwa } from "./actions";

export const metadata = { title: "Kelola Fatwa — Admin MUI Jakarta Timur" };

const CATEGORY_LABEL = {
  MUAMALAH: "Muamalah",
  IBADAH_KESEHATAN: "Ibadah & Kesehatan",
  DIREKTORI_KONTEMPORER: "Direktori Kontemporer",
};

export default async function AdminFatwaPage() {
  const items = await prisma.fatwa.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-extrabold text-green-dk2">Kelola Fatwa</h1>
        <Link
          href="/admin/fatwa/new"
          className="bg-green-dk2 text-white font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-green-dk transition-colors"
        >
          + Fatwa Baru
        </Link>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream text-[11.5px] uppercase text-ink-soft font-bold">
            <tr>
              <th className="px-5 py-3">Judul</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((f) => (
              <tr key={f.id}>
                <td className="px-5 py-3 text-[13.5px] font-semibold text-ink max-w-[280px] truncate">{f.title}</td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">{CATEGORY_LABEL[f.category]}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      f.status === "PUBLISHED" ? "bg-emerald/15 text-green-dk2" : "bg-ink-soft/15 text-ink-soft"
                    }`}
                  >
                    {f.status === "PUBLISHED" ? "Tayang" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">{formatDateID(f.createdAt)}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/fatwa/${f.id}`} className="text-[12.5px] font-bold text-green-dk mr-4 hover:underline">
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteFatwa.bind(null, f.id)}
                    confirmText={`Hapus fatwa "${f.title}"? Tindakan ini tidak dapat dibatalkan.`}
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[13px] text-ink-soft">
                  Belum ada fatwa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
