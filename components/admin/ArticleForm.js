"use client";

import * as Switch from "@radix-ui/react-switch";
import * as Select from "@radix-ui/react-select";
import { useState } from "react";

const SECTIONS = [
  { value: "DOA_DZIKIR", label: "Amalan — Doa & Dzikir" },
  { value: "HIKMAH_AKHLAK", label: "Amalan — Hikmah & Akhlak" },
  { value: "KHUTBAH_JUMAT", label: "Amalan — Khutbah Jumat" },
  { value: "FIQIH_WANITA", label: "Keluarga — Fiqih Wanita" },
  { value: "PARENTING", label: "Keluarga — Parenting" },
  { value: "KITAB_KAMUS", label: "Kitab — Kamus Istilah" },
  { value: "KITAB_TURATS", label: "Kitab — Turats" },
];

export default function ArticleForm({ action, initial }) {
  const [section, setSection] = useState(initial?.section ?? SECTIONS[0].value);
  const [status, setStatus] = useState(initial?.status === "PUBLISHED");

  return (
    <form action={action} className="flex flex-col gap-5 max-w-2xl">
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Bagian (Section)</label>
        <Select.Root value={section} onValueChange={setSection}>
          <Select.Trigger className="inline-flex items-center justify-between gap-2 border border-line rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-ink min-w-[280px] bg-white">
            <Select.Value />
            <Select.Icon>▾</Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white border border-line rounded-xl shadow-lg overflow-hidden z-50">
              <Select.Viewport>
                {SECTIONS.map((s) => (
                  <Select.Item
                    key={s.value}
                    value={s.value}
                    className="px-4 py-2.5 text-[13px] font-semibold text-ink cursor-pointer hover:bg-cream outline-none"
                  >
                    <Select.ItemText>{s.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        <input type="hidden" name="section" value={section} />
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
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Ringkasan (opsional)</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={initial?.excerpt ?? ""}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Isi</label>
        <textarea
          name="body"
          required
          rows={10}
          defaultValue={initial?.body}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Data Tambahan (JSON, opsional)</label>
        <textarea
          name="extra"
          rows={3}
          placeholder='mis. {"arabic": "...", "latin": "..."} untuk doa'
          defaultValue={initial?.extra ? JSON.stringify(initial.extra, null, 2) : "{}"}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13px] font-mono outline-none focus:border-emerald"
        />
        <p className="text-[11.5px] text-ink-soft mt-1">
          Untuk field khusus per jenis konten (mis. teks Arab &amp; latin untuk doa). Boleh dikosongkan ({"{}"}).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">Urutan Tampil</label>
          <input
            type="number"
            name="sortOrder"
            defaultValue={initial?.sortOrder ?? 0}
            className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer pb-2.5">
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
