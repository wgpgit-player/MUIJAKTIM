import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QuickIconForm from "@/components/admin/QuickIconForm";
import { updateQuickIcon } from "../actions";

export const metadata = { title: "Edit Icon — Admin MUI Jakarta Timur" };

export default async function EditQuickIconPage({ params }) {
  const { id } = await params;
  const item = await prisma.quickIcon.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Edit Icon</h1>
      <QuickIconForm action={updateQuickIcon.bind(null, id)} initial={item} />
    </div>
  );
}
