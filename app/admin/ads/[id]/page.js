import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdForm from "@/components/admin/AdForm";
import { updateAd } from "../actions";

export const metadata = { title: "Edit Iklan — Admin MUI Jakarta Timur" };

export default async function EditAdPage({ params }) {
  const { id } = await params;
  const item = await prisma.advertisement.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Edit Iklan</h1>
      <AdForm action={updateAd.bind(null, id)} initial={item} />
    </div>
  );
}
