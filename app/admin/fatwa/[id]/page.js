import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FatwaForm from "@/components/admin/FatwaForm";
import { updateFatwa } from "../actions";

export const metadata = { title: "Edit Fatwa — Admin MUI Jakarta Timur" };

export default async function EditFatwaPage({ params }) {
  const { id } = await params;
  const item = await prisma.fatwa.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Edit Fatwa</h1>
      <FatwaForm action={updateFatwa.bind(null, id)} initial={item} />
    </div>
  );
}
