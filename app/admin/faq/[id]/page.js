import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FaqForm from "@/components/admin/FaqForm";
import { updateFaq } from "../actions";

export const metadata = { title: "Edit FAQ — Admin MUI Jakarta Timur" };

export default async function EditFaqPage({ params }) {
  const { id } = await params;
  const item = await prisma.faqTanyaUlama.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Edit FAQ</h1>
      <FaqForm action={updateFaq.bind(null, id)} initial={item} />
    </div>
  );
}
