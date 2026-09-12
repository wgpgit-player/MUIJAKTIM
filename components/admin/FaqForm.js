"use client";

import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";

export default function FaqForm({ action, initial }) {
  const [status, setStatus] = useState(initial?.status === "PUBLISHED");

  return (
    <form action={action} className="flex flex-col gap-5 max-w-2xl">
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Pertanyaan</label>
        <textarea
          name="question"
          required
          rows={2}
          defaultValue={initial?.question}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Jawaban</label>
        <textarea
          name="answer"
          required
          rows={6}
          defaultValue={initial?.answer}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Kata Kunci (pisahkan dengan koma)</label>
        <input
          name="keywords"
          defaultValue={Array.isArray(initial?.keywords) ? initial.keywords.join(", ") : ""}
          placeholder="zakat fitrah, besaran zakat fitrah"
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
        <p className="text-[11.5px] text-ink-soft mt-1">
          Digunakan oleh chatbot Tanya Ulama untuk mencocokkan pertanyaan pengguna.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">Kategori</label>
          <input
            name="category"
            required
            defaultValue={initial?.category}
            className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
          />
        </div>
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">Urutan Tampil</label>
          <input
            type="number"
            name="sortOrder"
            defaultValue={initial?.sortOrder ?? 0}
            className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <Switch.Root
          checked={status}
          onCheckedChange={setStatus}
          className="w-10 h-6 rounded-full bg-ink-soft/30 data-[state=checked]:bg-green-dk2 relative transition-colors"
        >
          <Switch.Thumb className="block w-4.5 h-4.5 bg-white rounded-full translate-x-1 data-[state=checked]:translate-x-5 transition-transform" />
        </Switch.Root>
        <span className="text-[13px] font-semibold text-ink">{status ? "Tayang" : "Draft"}</span>
      </label>
      <input type="hidden" name="status" value={status ? "PUBLISHED" : "DRAFT"} />

      <button
        type="submit"
        className="mt-2 w-fit bg-green-dk2 text-white font-bold text-[13.5px] px-6 py-3 rounded-xl hover:bg-green-dk transition-colors"
      >
        Simpan
      </button>
    </form>
  );
}
