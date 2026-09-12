"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", username: "", firstName: "", lastName: "" });
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { username: form.username, first_name: form.firstName, last_name: form.lastName },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-[13.5px] text-ink-soft leading-relaxed">
        Pendaftaran berhasil. Silakan cek email Anda untuk verifikasi, lalu{" "}
        <a href="/login" className="text-green-dk font-bold hover:text-emerald">
          login di sini
        </a>
        .
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">Nama Depan</label>
          <input
            required
            value={form.firstName}
            onChange={update("firstName")}
            className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
          />
        </div>
        <div>
          <label className="block text-[12.5px] font-bold text-ink mb-1.5">Nama Belakang</label>
          <input
            required
            value={form.lastName}
            onChange={update("lastName")}
            className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
          />
        </div>
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Username</label>
        <input
          required
          value={form.username}
          onChange={update("username")}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={update("email")}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      <div>
        <label className="block text-[12.5px] font-bold text-ink mb-1.5">Kata Sandi</label>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={update("password")}
          className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
        />
      </div>
      {error && <p className="text-[12.5px] text-red-600 font-semibold">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full bg-green-dk2 text-white font-bold text-[13.5px] py-3 rounded-xl hover:bg-green-dk transition-colors disabled:opacity-60"
      >
        {loading ? "Memproses…" : "Daftar"}
      </button>
    </form>
  );
}
