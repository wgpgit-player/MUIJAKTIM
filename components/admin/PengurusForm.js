"use client";

export default function PengurusForm({ action, initial }) {
  return (
    <form action={action} className="flex flex-col gap-5 max-w-xl">
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Nama</label>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Jabatan</label>
        <input
          name="position"
          required
          defaultValue={initial?.position}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">URL Foto (opsional)</label>
        <input
          name="photoUrl"
          defaultValue={initial?.photoUrl ?? ""}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">Periode</label>
          <input
            name="period"
            required
            placeholder="2026-2031"
            defaultValue={initial?.period}
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

      <button
        type="submit"
        className="mt-2 w-fit bg-green-dk2 text-white font-bold text-[13.5px] px-6 py-3 rounded-xl hover:bg-green-dk transition-colors"
      >
        Simpan
      </button>
    </form>
  );
}
