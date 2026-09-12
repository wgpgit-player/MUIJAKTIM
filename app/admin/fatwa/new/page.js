import FatwaForm from "@/components/admin/FatwaForm";
import { createFatwa } from "../actions";

export const metadata = { title: "Fatwa Baru — Admin MUI Jakarta Timur" };

export default function NewFatwaPage() {
  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Fatwa Baru</h1>
      <FatwaForm action={createFatwa} />
    </div>
  );
}
