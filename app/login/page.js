export const metadata = { title: "Login Anggota — MUI Jakarta Timur" };

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-14 bg-cream">
      <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-8">
        <div className="text-[11.5px] font-bold uppercase tracking-wide text-emerald mb-2">Portal Sinergi MUI</div>
        <h1 className="text-[22px] font-extrabold text-green-dk2 mb-1.5">Login Anggota</h1>
        <p className="text-[13px] text-ink-soft leading-relaxed mb-6">
          Khusus untuk pengurus dan anggota MUI Jakarta Timur. Masukkan akun Sinergi MUI Anda untuk melanjutkan.
        </p>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-[12.5px] font-bold text-ink mb-1.5">Email / NIA</label>
            <input
              type="text"
              placeholder="nama@muijaktim.or.id"
              className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-bold text-ink mb-1.5">Kata Sandi</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full bg-green-dk2 text-white font-bold text-[13.5px] py-3 rounded-xl hover:bg-green-dk transition-colors"
          >
            Masuk
          </button>
        </form>

        <p className="text-[12px] text-ink-soft text-center mt-6">
          Bukan pengurus? <a href="/" className="text-green-dk font-bold hover:text-emerald">Kembali ke beranda</a>
        </p>
      </div>
    </div>
  );
}
