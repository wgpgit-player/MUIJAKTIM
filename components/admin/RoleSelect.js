"use client";

import * as Select from "@radix-ui/react-select";
import { useTransition } from "react";

const ROLES = ["USER", "ADMIN", "SUPER_ADMIN"];

export default function RoleSelect({ userId, role, onChange }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select.Root
      value={role}
      disabled={isPending}
      onValueChange={(value) => startTransition(() => onChange(userId, value))}
    >
      <Select.Trigger className="inline-flex items-center justify-between gap-2 border border-line rounded-lg px-3 py-1.5 text-[12.5px] font-bold text-ink min-w-[130px] bg-white disabled:opacity-60">
        <Select.Value />
        <Select.Icon>▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white border border-line rounded-xl shadow-lg overflow-hidden z-50">
          <Select.Viewport>
            {ROLES.map((r) => (
              <Select.Item
                key={r}
                value={r}
                className="px-4 py-2.5 text-[12.5px] font-semibold text-ink cursor-pointer hover:bg-cream outline-none"
              >
                <Select.ItemText>{r}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
