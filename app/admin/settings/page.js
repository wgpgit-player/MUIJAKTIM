import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { updateDefaultLocation } from "./actions";

export const metadata = { title: "Pengaturan — Admin MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireRole(["SUPER_ADMIN"]);

  const [locationSetting] = await Promise.all([
    prisma.setting.findUnique({ where: { key: "default_location" } }),
  ]);

  const loc = locationSetting?.value ?? { lat: -6.225, lon: 106.9004, label: "Jakarta Timur (default)" };
  const igConfigured = !!process.env.IG_ACCESS_TOKEN && !!process.env.IG_USER_ID;
  const cronConfigured = !!process.env.CRON_SECRET;

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Pengaturan</h1>

      <div className="bg-white border border-line rounded-2xl p-6 mb-6 max-w-xl">
        <h2 className="text-[15px] font-extrabold text-ink mb-1">Lokasi Default Jadwal Sholat</h2>
        <p className="text-[12.5px] text-ink-soft mb-5">
          Dipakai sebagai fallback saat pengunjung belum mengizinkan akses lokasi di browser mereka.
        </p>
        <form action={updateDefaultLocation} className="flex flex-col gap-4">
          <div>
            <label className="block text-[12.5px] font-bold text-ink mb-1.5">Label</label>
            <input
              name="label"
              required
              defaultValue={loc.label}
              className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-bold text-ink mb-1.5">Latitude</label>
              <input
                type="number"
                step="any"
                name="lat"
                required
                defaultValue={loc.lat}
                className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-bold text-ink mb-1.5">Longitude</label>
              <input
                type="number"
                step="any"
                name="lon"
                required
                defaultValue={loc.lon}
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
      </div>

      <div className="bg-white border border-line rounded-2xl p-6 max-w-xl">
        <h2 className="text-[15px] font-extrabold text-ink mb-4">Status Integrasi</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-ink-soft">Instagram Feed (IG_ACCESS_TOKEN / IG_USER_ID)</span>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                igConfigured ? "bg-emerald/15 text-green-dk2" : "bg-red-100 text-red-600"
              }`}
            >
              {igConfigured ? "Terhubung" : "Belum diatur"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-ink-soft">Cron Keep-Alive (CRON_SECRET)</span>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                cronConfigured ? "bg-emerald/15 text-green-dk2" : "bg-red-100 text-red-600"
              }`}
            >
              {cronConfigured ? "Terhubung" : "Belum diatur"}
            </span>
          </div>
        </div>
        <p className="text-[11.5px] text-ink-soft mt-4 leading-relaxed">
          Kredensial ini diatur lewat environment variable (bukan lewat halaman ini) karena
          sifatnya rahasia. Hubungi developer untuk mengubahnya.
        </p>
      </div>
    </div>
  );
}
