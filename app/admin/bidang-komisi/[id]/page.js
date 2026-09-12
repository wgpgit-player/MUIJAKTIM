import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BidangKomisiForm from "@/components/admin/BidangKomisiForm";
import { updateBidangKomisi } from "../actions";

export const metadata = { title: "Edit Bidang/Komisi — Admin MUI Jakarta Timur" };

export default async function EditBidangKomisiPage({ params }) {
  const { id } = await params;
  const item = await prisma.bidangKomisi.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Edit Bidang/Komisi</h1>
      <BidangKomisiForm action={updateBidangKomisi.bind(null, id)} initial={item} />
    </div>
  );
}
