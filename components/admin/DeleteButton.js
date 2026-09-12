"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useTransition } from "react";

export default function DeleteButton({ action, label = "Hapus", confirmText }) {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="text-[12.5px] font-bold text-red-600 hover:underline">{label}</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
          <AlertDialog.Title className="text-[16px] font-extrabold text-green-dk2 mb-2">
            Konfirmasi Hapus
          </AlertDialog.Title>
          <AlertDialog.Description className="text-[13px] text-ink-soft mb-6">
            {confirmText || "Tindakan ini tidak dapat dibatalkan."}
          </AlertDialog.Description>
          <div className="flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button className="text-[13px] font-bold text-ink-soft px-4 py-2 rounded-xl hover:bg-cream">
                Batal
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                disabled={isPending}
                onClick={() => startTransition(() => action())}
                className="text-[13px] font-bold text-white bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? "Menghapus…" : "Ya, Hapus"}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
