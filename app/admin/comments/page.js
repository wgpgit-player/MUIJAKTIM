import { prisma } from "@/lib/prisma";
import { formatDateID } from "@/lib/date";
import DeleteButton from "@/components/admin/DeleteButton";
import { softDeleteComment } from "./actions";

export const metadata = { title: "Moderasi Komentar — Admin MUI Jakarta Timur" };

const CONTENT_LABEL = { news: "Berita", fatwa: "Fatwa", faq: "Tanya Ulama" };

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { author: { select: { username: true, firstName: true, lastName: true } } },
  });

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Moderasi Komentar</h1>
      <div className="bg-white border border-line rounded-2xl divide-y divide-line">
        {comments.map((c) => (
          <div key={c.id} className="px-5 py-4 flex items-start justify-between gap-4">
            <div>
              <div className="text-[12px] text-ink-soft font-semibold mb-1">
                {c.author.firstName} {c.author.lastName} (@{c.author.username}) ·{" "}
                <span className="uppercase">{CONTENT_LABEL[c.contentType] ?? c.contentType}</span> ·{" "}
                {formatDateID(c.createdAt)}
              </div>
              <div className="text-[13.5px] text-ink">{c.body}</div>
            </div>
            <DeleteButton
              action={softDeleteComment.bind(null, c.id)}
              confirmText="Hapus komentar ini? Komentar akan disembunyikan dari publik."
            />
          </div>
        ))}
        {comments.length === 0 && (
          <div className="px-5 py-8 text-center text-[13px] text-ink-soft">Belum ada komentar.</div>
        )}
      </div>
    </div>
  );
}
