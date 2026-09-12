import { createKnowledgeDocument } from "../actions";

export const metadata = { title: "Upload Dokumen — Admin MUI Jakarta Timur" };

export default function NewKnowledgeDocumentPage() {
  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Upload Dokumen Knowledge</h1>
      <form action={createKnowledgeDocument} className="flex flex-col gap-5 max-w-xl">
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">Judul Dokumen</label>
          <input
            name="title"
            required
            placeholder="mis. Panduan Zakat Fitrah"
            className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
          />
        </div>
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">File (.md, .txt, atau .pdf)</label>
          <input
            type="file"
            name="file"
            accept=".md,.txt,.pdf"
            required
            className="w-full border border-line rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-emerald file:mr-3 file:rounded-lg file:border-0 file:bg-green-dk2 file:text-white file:px-3 file:py-1.5 file:text-[12px] file:font-bold"
          />
          <p className="text-[11.5px] text-ink-soft mt-1">
            Teks otomatis diambil dan dipecah jadi potongan-potongan untuk pencarian widget Tanya AI.
          </p>
        </div>
        <button
          type="submit"
          className="mt-2 w-fit bg-green-dk2 text-white font-bold text-[13.5px] px-6 py-3 rounded-xl hover:bg-green-dk transition-colors"
        >
          Upload &amp; Proses
        </button>
      </form>
    </div>
  );
}
