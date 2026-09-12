import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateID } from "@/lib/date";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteKnowledgeDocument } from "./actions";

export const metadata = { title: "Knowledge Base — Admin MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

const STATUS_LABEL = {
  READY: { label: "Siap", cls: "bg-emerald/15 text-green-dk2" },
  PROCESSING: { label: "Memproses…", cls: "bg-amber-100 text-amber-700" },
  ERROR: { label: "Gagal", cls: "bg-red-100 text-red-600" },
};

export default async function AdminKnowledgePage() {
  const docs = await prisma.knowledgeDocument.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { chunks: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[22px] font-extrabold text-green-dk2">Knowledge Base (Tanya AI)</h1>
        <Link
          href="/admin/knowledge/new"
          className="bg-green-dk2 text-white font-bold text-[13px] px-4 py-2.5 rounded-xl hover:bg-green-dk transition-colors"
        >
          + Upload Dokumen
        </Link>
      </div>
      <p className="text-[12.5px] text-ink-soft mb-6">
        Dokumen di sini jadi sumber jawaban widget &quot;Tanya AI&quot; di situs. Pencarian berbasis
        kata kunci lokal (gratis, tanpa API eksternal) — kalau tidak ketemu, pengunjung diarahkan
        chat admin.
      </p>

      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream text-[11.5px] uppercase text-ink-soft font-bold">
            <tr>
              <th className="px-5 py-3">Judul</th>
              <th className="px-5 py-3">Tipe</th>
              <th className="px-5 py-3">Potongan Teks</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Diupload</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {docs.map((d) => {
              const st = STATUS_LABEL[d.status] ?? STATUS_LABEL.ERROR;
              return (
                <tr key={d.id}>
                  <td className="px-5 py-3 text-[13.5px] font-semibold text-ink max-w-[220px] truncate">{d.title}</td>
                  <td className="px-5 py-3 text-[12px] text-ink-soft uppercase">{d.fileType}</td>
                  <td className="px-5 py-3 text-[12.5px] text-ink-soft">{d._count.chunks}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${st.cls}`} title={d.errorMessage ?? ""}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-ink-soft">{formatDateID(d.createdAt)}</td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <DeleteButton
                      action={deleteKnowledgeDocument.bind(null, d.id)}
                      confirmText={`Hapus dokumen "${d.title}"? Semua potongan teksnya juga akan terhapus.`}
                    />
                  </td>
                </tr>
              );
            })}
            {docs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-[13px] text-ink-soft">
                  Belum ada dokumen knowledge. Upload file .md atau .pdf untuk mulai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
