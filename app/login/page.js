import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "Login — MUI Jakarta Timur" };

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-14 bg-cream">
      <div className="w-full max-w-sm bg-white border border-line rounded-2xl p-8">
        <div className="text-[11.5px] font-bold uppercase tracking-wide text-emerald mb-2">Portal Sinergi MUI</div>
        <h1 className="text-[22px] font-extrabold text-green-dk2 mb-1.5">Login</h1>
        <p className="text-[13px] text-ink-soft leading-relaxed mb-6">
          Masuk untuk memberi komentar, atau lanjut ke panel admin bila Anda pengurus/staf.
        </p>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="text-[12px] text-ink-soft text-center mt-6">
          Belum punya akun?{" "}
          <a href="/register" className="text-green-dk font-bold hover:text-emerald">
            Daftar
          </a>
          {" · "}
          <a href="/" className="text-green-dk font-bold hover:text-emerald">
            Kembali ke beranda
          </a>
        </p>
      </div>
    </div>
  );
}
