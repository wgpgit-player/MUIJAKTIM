import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";
import { deletePengurus } from "./actions";

export const metadata = { title: "Kelola Pengurus — Admin MUI Jakarta Timur" };

export default async function AdminPengurusPage() {
  const items = await prisma.pengurus.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-extrabold text-green-dk2">Kelola Pengurus</h1>
        <Link
          href="/admin/pengurus/new"
          className="bg-green-dk2 text-white font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-green-dk transition-colors"
        >
          + Pengurus Baru
        </Link>
      </div>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream text-[11.5px] uppercase text-ink-soft font-bold">
            <tr>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Jabatan</th>
              <th className="px-5 py-3">Periode</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">{p.name}</td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">{p.position}</td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">{p.period}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/pengurus/${p.id}`} className="text-[12.5px] font-bold text-green-dk mr-4 hover:underline">
                    Edit
                  </Link>
                  <DeleteButton
                    action={deletePengurus.bind(null, p.id)}
                    confirmText={`Hapus data pengurus "${p.name}"?`}
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-[13px] text-ink-soft">
                  Belum ada data pengurus.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
