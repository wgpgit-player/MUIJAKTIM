import FaqForm from "@/components/admin/FaqForm";
import { createFaq } from "../actions";

export const metadata = { title: "FAQ Baru — Admin MUI Jakarta Timur" };

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">FAQ Baru</h1>
      <FaqForm action={createFaq} />
    </div>
  );
}
