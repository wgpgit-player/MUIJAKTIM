"use client";

import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";

export default function HeroSlideForm({ action, initial }) {
  const [active, setActive] = useState(initial?.active ?? true);

  return (
    <form action={action} className="flex flex-col gap-5 max-w-xl">
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">URL Gambar</label>
        <input
          name="imageUrl"
          required
          defaultValue={initial?.imageUrl}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
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
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">URL Tautan (opsional)</label>
        <input
          name="linkUrl"
          defaultValue={initial?.linkUrl ?? ""}
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

      <label className="flex items-center gap-3 cursor-pointer">
        <Switch.Root
          checked={active}
          onCheckedChange={setActive}
          className="w-10 h-6 rounded-full bg-ink-soft/30 data-[state=checked]:bg-green-dk2 relative transition-colors"
        >
          <Switch.Thumb className="block w-4.5 h-4.5 bg-white rounded-full translate-x-1 data-[state=checked]:translate-x-5 transition-transform" />
        </Switch.Root>
        <span className="text-[13px] font-semibold text-ink">{active ? "Aktif" : "Nonaktif"}</span>
      </label>
      <input type="hidden" name="active" value={active ? "on" : ""} />

      <button
        type="submit"
        className="mt-2 w-fit bg-green-dk2 text-white font-bold text-[13.5px] px-6 py-3 rounded-xl hover:bg-green-dk transition-colors"
      >
        Simpan
      </button>
    </form>
  );
}
