import AdForm from "@/components/admin/AdForm";
import { createAd } from "../actions";

export const metadata = { title: "Iklan Baru — Admin MUI Jakarta Timur" };

export default function NewAdPage() {
  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Iklan Baru</h1>
      <AdForm action={createAd} />
    </div>
  );
}
