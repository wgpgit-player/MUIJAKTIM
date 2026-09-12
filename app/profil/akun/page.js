import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthedProfile } from "@/lib/rbac";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata = { title: "Akun Saya — MUI Jakarta Timur" };
export const dynamic = "force-dynamic";

export default async function AkunPage() {
  const authed = await getAuthedProfile();
  if (!authed) redirect("/login?next=/profil/akun");

  const profile = await prisma.profile.findUnique({ where: { id: authed.id } });

  return (
    <div className="max-w-lg mx-auto px-5 py-12">
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-1">Akun Saya</h1>
      <p className="text-[13px] text-ink-soft mb-8">
        {profile?.firstName} {profile?.lastName} · @{profile?.username} ·{" "}
        <span className="font-bold text-green-dk">{profile?.role}</span>
      </p>

      <div className="bg-white border border-line rounded-2xl p-6 mb-6">
        <h2 className="text-[15px] font-extrabold text-ink mb-4">Ganti Kata Sandi</h2>
        <ChangePasswordForm />
      </div>

      <form action="/api/auth/signout" method="POST">
        <button
          type="submit"
          className="text-[13px] font-bold text-red-600 hover:underline"
        >
          Keluar dari akun
        </button>
      </form>
    </div>
  );
}
