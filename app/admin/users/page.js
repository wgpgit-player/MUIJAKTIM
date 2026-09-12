import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import UsersTable from "./UsersTable";

export const metadata = { title: "Kelola Pengguna — Admin MUI Jakarta Timur" };

export default async function AdminUsersPage() {
  const profile = await requireRole(["SUPER_ADMIN"]);
  const users = await prisma.profile.findMany({ orderBy: { createdAt: "desc" } });

  const rows = users.map((u) => ({
    id: u.id,
    first_name: u.firstName,
    last_name: u.lastName,
    username: u.username,
    role: u.role,
    is_active: u.isActive,
  }));

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Kelola Pengguna</h1>
      <UsersTable users={rows} currentUserId={profile.id} />
    </div>
  );
}
