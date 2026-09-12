"use client";

export default function BidangKomisiForm({ action, initial }) {
  return (
    <form action={action} className="flex flex-col gap-5 max-w-xl">
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Nama Bidang/Komisi</label>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Deskripsi</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={initial?.description}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">Nama Ketua (opsional)</label>
          <input
            name="chairName"
            defaultValue={initial?.chairName ?? ""}
            className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
          />
        </div>
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">Nama Sekretaris (opsional)</label>
          <input
            name="secretaryName"
            defaultValue={initial?.secretaryName ?? ""}
            className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
          />
        </div>
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Anggota (JSON array)</label>
        <textarea
          name="members"
          rows={4}
          placeholder='["Nama A", "Nama B"]'
          defaultValue={initial?.members ? JSON.stringify(initial.members, null, 2) : "[]"}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13px] font-mono outline-none focus:border-emerald"
        />
        <p className="text-[11.5px] text-ink-soft mt-1">Format JSON array sederhana, mis. ["Nama A", "Nama B"].</p>
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
