"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function softDeleteComment(id) {
  const profile = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  await prisma.comment.update({
    where: { id },
    data: { isDeleted: true, deletedBy: profile.id },
  });
  revalidatePath("/admin/comments");
}
