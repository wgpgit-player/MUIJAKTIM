import QuickIconForm from "@/components/admin/QuickIconForm";
import { createQuickIcon } from "../actions";

export const metadata = { title: "Icon Baru — Admin MUI Jakarta Timur" };

export default function NewQuickIconPage() {
  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Icon Baru</h1>
      <QuickIconForm action={createQuickIcon} />
    </div>
  );
}
