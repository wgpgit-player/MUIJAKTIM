import NewsForm from "@/components/admin/NewsForm";
import { createNews } from "../actions";

export const metadata = { title: "Berita Baru — Admin MUI Jakarta Timur" };

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Berita Baru</h1>
      <NewsForm action={createNews} />
    </div>
  );
}
