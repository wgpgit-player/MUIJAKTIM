import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthedProfile } from "@/lib/rbac";

const NAV = [
  { href: "/admin", label: "Dashboard", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/news", label: "Berita", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/fatwa", label: "Fatwa", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/faq", label: "Tanya Ulama", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/pengurus", label: "Pengurus", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/bidang-komisi", label: "Bidang/Komisi", roles: ["ADMIN", "SUPER_ADMIN"] },
  { href: "/admin/hero-slide", label: "Hero Slide", roles: ["ADMIN", "SUPER_ADMIN"] },
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
    <div className="min-h-[80vh] bg-cream flex">
      <aside className="w-56 shrink-0 bg-green-dk2 text-white min-h-screen py-6 px-4 hidden md:block">
        <div className="text-[11px] font-bold uppercase tracking-wide text-lime mb-6 px-2">
          Admin MUI Jaktim
        </div>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2.5 rounded-xl text-[13.5px] font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 px-3 text-[11.5px] text-white/50">
          Role: <span className="font-bold text-white/80">{profile.role}</span>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
