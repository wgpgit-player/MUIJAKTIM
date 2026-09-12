import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePageContent } from "../actions";

export const metadata = { title: "Edit Halaman Statis — Admin MUI Jakarta Timur" };

export default async function EditPageContentPage({ params }) {
  const { key } = await params;
  const item = await prisma.pageContent.findUnique({ where: { key } });
  if (!item) notFound();

  const isMulti = key === "sejarah" || key === "misi";

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-2">Edit: {item.title}</h1>
      {isMulti && (
        <p className="text-[12.5px] text-ink-soft mb-6">
          Pisahkan {key === "sejarah" ? "paragraf" : "poin misi"} dengan baris kosong{key === "misi" ? " (1 poin per baris)" : ""}.
        </p>
      )}
      <form action={updatePageContent.bind(null, key)} className="flex flex-col gap-5 max-w-2xl">
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">Judul</label>
          <input
            name="title"
            required
            defaultValue={item.title}
            className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
          />
        </div>
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">Isi</label>
          <textarea
            name="body"
            required
            rows={12}
            defaultValue={item.body}
            className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-fit bg-green-dk2 text-white font-bold text-[13.5px] px-6 py-3 rounded-xl hover:bg-green-dk transition-colors"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
