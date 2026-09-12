"use client";

import RoleSelect from "@/components/admin/RoleSelect";
import { updateUserRole, setUserActive } from "./actions";

export default function UsersTable({ users, currentUserId }) {
  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-cream text-[11.5px] uppercase text-ink-soft font-bold">
          <tr>
            <th className="px-5 py-3">Nama</th>
            <th className="px-5 py-3">Username</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {users.map((u) => {
            const isSelf = u.id === currentUserId;
            return (
              <tr key={u.id}>
                <td className="px-5 py-3 text-[13.5px] font-semibold text-ink">
                  {u.first_name} {u.last_name}
                  {isSelf && <span className="text-[11px] text-ink-soft font-normal ml-1.5">(Anda)</span>}
                </td>
                <td className="px-5 py-3 text-[13px] text-ink-soft">@{u.username}</td>
                <td className="px-5 py-3">
                  <RoleSelect userId={u.id} role={u.role} onChange={isSelf ? () => {} : updateUserRole} />
                </td>
                <td className="px-5 py-3">
                  <button
                    disabled={isSelf}
                    onClick={() => setUserActive(u.id, !u.is_active)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full disabled:opacity-50 ${
                      u.is_active ? "bg-emerald/15 text-green-dk2" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {u.is_active ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
