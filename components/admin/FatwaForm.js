"use client";

import * as Switch from "@radix-ui/react-switch";
import * as Select from "@radix-ui/react-select";
import { useState } from "react";

const CATEGORIES = [
  { value: "MUAMALAH", label: "Muamalah" },
  { value: "IBADAH_KESEHATAN", label: "Ibadah & Kesehatan" },
  { value: "DIREKTORI_KONTEMPORER", label: "Direktori Kontemporer" },
];

export default function FatwaForm({ action, initial }) {
  const [status, setStatus] = useState(initial?.status === "PUBLISHED");
  const [category, setCategory] = useState(initial?.category ?? "MUAMALAH");

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
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Nomor Fatwa (opsional)</label>
        <input
          name="number"
          defaultValue={initial?.number ?? ""}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Kategori</label>
        <Select.Root value={category} onValueChange={setCategory}>
          <Select.Trigger className="inline-flex items-center justify-between gap-2 border border-line rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-ink min-w-[220px] bg-white">
            <Select.Value />
            <Select.Icon>▾</Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white border border-line rounded-xl shadow-lg overflow-hidden z-50">
              <Select.Viewport>
                {CATEGORIES.map((c) => (
                  <Select.Item
                    key={c.value}
                    value={c.value}
                    className="px-4 py-2.5 text-[13px] font-semibold text-ink cursor-pointer hover:bg-cream outline-none"
                  >
                    <Select.ItemText>{c.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        <input type="hidden" name="category" value={category} />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Isi Fatwa</label>
        <textarea
          name="body"
          required
          rows={10}
          defaultValue={initial?.body}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
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
