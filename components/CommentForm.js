"use client";

import { useRef, useState, useTransition } from "react";

export default function CommentForm({ action, isLoggedIn }) {
  const formRef = useRef(null);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <p className="text-[13px] text-ink-soft">
        <a href="/login" className="text-green-dk font-bold hover:text-emerald">
          Masuk
        </a>{" "}
        untuk memberi komentar.
      </p>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(formRef.current);
    startTransition(async () => {
      try {
        await action(formData);
        formRef.current?.reset();
      } catch (err) {
        setError(err?.message ?? "Gagal mengirim komentar.");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        name="body"
        required
        rows={3}
        maxLength={1000}
        placeholder="Tulis komentar Anda…"
        className="w-full border border-line rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-emerald"
      />
      {error && <p className="text-[12.5px] text-red-600 font-semibold">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-fit bg-green-dk2 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl hover:bg-green-dk transition-colors disabled:opacity-60"
      >
        {isPending ? "Mengirim…" : "Kirim Komentar"}
      </button>
    </form>
  );
}
