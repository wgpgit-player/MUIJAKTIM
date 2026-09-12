import { prisma } from "@/lib/prisma";
import { getAuthedProfile } from "@/lib/rbac";
import { formatDateID } from "@/lib/date";
import { createComment } from "@/app/actions/comments";
import CommentForm from "./CommentForm";

export default async function CommentSection({ contentType, contentId, path }) {
  const [comments, profile] = await Promise.all([
    prisma.comment.findMany({
      where: { contentType, contentId, isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { username: true, firstName: true, lastName: true } } },
    }),
    getAuthedProfile(),
  ]);

  const action = createComment.bind(null, contentType, contentId, path);

  return (
    <div className="mt-10">
      <h3 className="text-[15px] font-extrabold text-green-dk2 mb-4">Komentar ({comments.length})</h3>
      <div className="mb-6">
        <CommentForm action={action} isLoggedIn={!!profile} />
      </div>
      <div className="flex flex-col gap-4">
        {comments.map((c) => (
          <div key={c.id} className="border-b border-line pb-4">
            <div className="text-[12.5px] font-bold text-ink">
              {c.author.firstName} {c.author.lastName}{" "}
              <span className="text-ink-soft font-normal">@{c.author.username} · {formatDateID(c.createdAt)}</span>
            </div>
            <p className="text-[13.5px] text-ink mt-1">{c.body}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-[13px] text-ink-soft">Belum ada komentar.</p>}
      </div>
    </div>
  );
}
