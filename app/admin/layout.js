import { redirect } from "next/navigation";
import { getAuthedProfile } from "@/lib/rbac";
import AdminShell from "@/components/admin/AdminShell";

const NAV = [
  { href: "/admin", label: "Dashboard", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/analytics", label: "Analitik", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/news", label: "Berita", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/fatwa", label: "Fatwa", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/faq", label: "Tanya Ulama", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/pengurus", label: "Pengurus", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/bidang-komisi", label: "Bidang/Komisi", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/hero-slide", label: "Hero Slide", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/quick-icons", label: "Icon", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/ads", label: "Iklan", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/page-content", label: "Halaman Statis", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/articles", label: "Artikel", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/comments", label: "Komentar", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/users", label: "Pengguna", roles: ["SUPER_ADMIN"] },
  { href: "/admin/settings", label: "Pengaturan", roles: ["SUPER_ADMIN"] },
];

export default async function AdminLayout({ children }) {
  const profile = await getAuthedProfile();

  if (!profile || !profile.isActive) {
    redirect("/login?next=/admin");
  }
  if (profile.role !== "ADMIN" && profile.role !== "SUPER_ADMIN") {
    redirect("/?denied=1");
  }

  const items = NAV.filter((item) => item.roles.includes(profile.role));

  return (
    <AdminShell items={items} role={profile.role}>
      {children}
    </AdminShell>
  );
}
