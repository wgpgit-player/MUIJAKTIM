import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PengurusForm from "@/components/admin/PengurusForm";
import { updatePengurus } from "../actions";

export const metadata = { title: "Edit Pengurus — Admin MUI Jakarta Timur" };

export default async function EditPengurusPage({ params }) {
  const { id } = await params;
  const item = await prisma.pengurus.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Edit Pengurus</h1>
      <PengurusForm action={updatePengurus.bind(null, id)} initial={item} />
    </div>
  );
}
