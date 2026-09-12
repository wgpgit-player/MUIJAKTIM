import BidangKomisiForm from "@/components/admin/BidangKomisiForm";
import { createBidangKomisi } from "../actions";

export const metadata = { title: "Bidang Baru — Admin MUI Jakarta Timur" };

export default function NewBidangKomisiPage() {
  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Bidang/Komisi Baru</h1>
      <BidangKomisiForm action={createBidangKomisi} />
    </div>
  );
}
