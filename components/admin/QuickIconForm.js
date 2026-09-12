"use client";

import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";

function ToggleField({ label, name, defaultChecked }) {
  const [checked, setChecked] = useState(defaultChecked ?? true);
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <Switch.Root
        checked={checked}
        onCheckedChange={setChecked}
        className="w-10 h-6 rounded-full bg-ink-soft/30 data-[state=checked]:bg-green-dk2 relative transition-colors"
      >
        <Switch.Thumb className="block w-4.5 h-4.5 bg-white rounded-full translate-x-1 data-[state=checked]:translate-x-5 transition-transform" />
      </Switch.Root>
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <input type="hidden" name={name} value={checked ? "on" : ""} />
    </label>
  );
}

export default function QuickIconForm({ action, initial }) {
  return (
    <form action={action} className="flex flex-col gap-5 max-w-xl">
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Ikon</label>
        {initial?.iconUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={initial.iconUrl}
            alt=""
            className="w-16 h-16 object-contain rounded-xl border border-line mb-2 bg-cream p-2"
          />
        )}
        <input
          type="file"
          name="iconFile"
          accept="image/*"
          required={!initial?.iconUrl}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-emerald file:mr-3 file:rounded-lg file:border-0 file:bg-green-dk2 file:text-white file:px-3 file:py-1.5 file:text-[12px] file:font-bold"
        />
        <p className="text-[11.5px] text-ink-soft mt-1">
          {initial?.iconUrl ? "Kosongkan kalau tidak ingin mengganti ikon." : "Upload gambar ikon (PNG transparan disarankan)."}
        </p>
        <input type="hidden" name="currentIconUrl" value={initial?.iconUrl ?? ""} />
      </div>

      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Label</label>
        <input
          name="label"
          required
          defaultValue={initial?.label}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Deskripsi (opsional, desktop saja)</label>
        <input
          name="description"
          defaultValue={initial?.description ?? ""}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Tautan Tujuan</label>
        <input
          name="linkUrl"
          required
          placeholder="/layanan/jadwal-shalat"
          defaultValue={initial?.linkUrl}
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

      <div className="flex flex-wrap gap-6">
        <ToggleField label="Aktif" name="active" defaultChecked={initial?.active ?? true} />
        <ToggleField label="Tampil di Desktop" name="showOnDesktop" defaultChecked={initial?.showOnDesktop ?? true} />
        <ToggleField label="Tampil di Mobile" name="showOnMobile" defaultChecked={initial?.showOnMobile ?? true} />
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
