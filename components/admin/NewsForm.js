"use client";

import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";

export default function NewsForm({ action, initial }) {
  const [status, setStatus] = useState(initial?.status === "PUBLISHED");
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  return (
    <form action={action} className="flex flex-col gap-5 max-w-2xl">
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Judul</label>
        <input
          name="title"
          required
          defaultValue={initial?.title}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Kategori</label>
        <input
          name="category"
          required
          defaultValue={initial?.category}
          placeholder="mis. Kabar Jakarta Timur, Opini Ulama, Rilis Pers"
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Ringkasan (Excerpt)</label>
        <textarea
          name="excerpt"
          required
          rows={2}
          defaultValue={initial?.excerpt}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Isi Berita</label>
        <textarea
          name="body"
          required
          rows={10}
          defaultValue={initial?.body}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>

      <div className="flex items-center gap-8">
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

        <label className="flex items-center gap-3 cursor-pointer">
          <Switch.Root
            checked={featured}
            onCheckedChange={setFeatured}
            className="w-10 h-6 rounded-full bg-ink-soft/30 data-[state=checked]:bg-green-dk2 relative transition-colors"
          >
            <Switch.Thumb className="block w-4.5 h-4.5 bg-white rounded-full translate-x-1 data-[state=checked]:translate-x-5 transition-transform" />
          </Switch.Root>
          <span className="text-[13px] font-semibold text-ink">Jadikan Unggulan</span>
        </label>
        <input type="hidden" name="featured" value={featured ? "on" : ""} />
      </div>

      <button
        type="submit"
        className="mt-2 w-fit bg-green-dk2 text-white font-bold text-[13.5px] px-6 py-3 rounded-xl hover:bg-green-dk transition-colors"
      >
        Simpan
      </button>
    </form>
  );
}
