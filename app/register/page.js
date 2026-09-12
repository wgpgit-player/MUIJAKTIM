import RegisterForm from "./RegisterForm";

export const metadata = { title: "Daftar — MUI Jakarta Timur" };

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-14 bg-cream">
      <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-8">
        <div className="text-[11.5px] font-bold uppercase tracking-wide text-emerald mb-2">Portal Sinergi MUI</div>
        <h1 className="text-[22px] font-extrabold text-green-dk2 mb-1.5">Daftar Akun</h1>
        <p className="text-[13px] text-ink-soft leading-relaxed mb-6">
          Daftar untuk bisa memberi komentar pada berita, fatwa, dan tanya ulama.
        </p>

        <RegisterForm />

        <p className="text-[12px] text-ink-soft text-center mt-6">
          Sudah punya akun?{" "}
          <a href="/login" className="text-green-dk font-bold hover:text-emerald">
            Masuk
          </a>
        </p>
      </div>
    </div>
  );
}
