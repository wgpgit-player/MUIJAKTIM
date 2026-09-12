import PengurusForm from "@/components/admin/PengurusForm";
import { createPengurus } from "../actions";

export const metadata = { title: "Pengurus Baru — Admin MUI Jakarta Timur" };

export default function NewPengurusPage() {
  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Pengurus Baru</h1>
      <PengurusForm action={createPengurus} />
    </div>
  );
}
