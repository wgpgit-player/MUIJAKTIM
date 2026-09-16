"use client";

import * as Switch from "@radix-ui/react-switch";
import * as Select from "@radix-ui/react-select";
import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

const SECTIONS = [
  { value: "KABAR_JAKARTA_TIMUR", label: "Kabar Jakarta Timur" },
  { value: "OPINI_ULAMA", label: "Opini Ulama" },
  { value: "RILIS_PERS", label: "Rilis Pers / Maklumat" },
];

export default function NewsForm({ action, initial }) {
  const [status, setStatus] = useState(initial?.status === "PUBLISHED");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [section, setSection] = useState(initial?.section ?? "KABAR_JAKARTA_TIMUR");

  return (
    <form action={action} className="flex flex-col gap-5 max-w-2xl">
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Gambar Sampul</label>
        {initial?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={initial.imageUrl}
            alt=""
            className="w-full max-w-xs h-40 object-cover rounded-xl border border-line mb-2"
          />
        )}
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-emerald file:mr-3 file:rounded-lg file:border-0 file:bg-green-dk2 file:text-white file:px-3 file:py-1.5 file:text-[12px] file:font-bold"
        />
        <p className="text-[11.5px] text-ink-soft mt-1">
          Tampil sebagai banner di halaman detail berita &amp; di kartu-kartu berita.
          {initial?.imageUrl ? " Kosongkan kalau tidak ingin mengganti gambar." : ""}
        </p>
        <input type="hidden" name="currentImageUrl" value={initial?.imageUrl ?? ""} />
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
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Bagian (Section)</label>
        <Select.Root value={section} onValueChange={setSection}>
          <Select.Trigger className="inline-flex items-center justify-between gap-2 border border-line rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-ink min-w-[240px] bg-white">
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
        <p className="text-[11.5px] text-ink-soft mt-1">
          Menentukan tab filter di halaman /berita. Berbeda dari &quot;Kategori&quot; di
          bawah (badge kecil di kartu berita).
        </p>
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
        <RichTextEditor name="body" initialContent={initial?.body ?? ""} />
        <p className="text-[11.5px] text-ink-soft mt-1">
          Gunakan toolbar untuk format teks dan menyisipkan gambar di dalam isi berita.
        </p>
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
