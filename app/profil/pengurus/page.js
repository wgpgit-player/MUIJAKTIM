import { redirect } from "next/navigation";

// Digabung ke dalam tab "Profil Pimpinan" di halaman /profil.
export default function PengurusRedirect() {
  redirect("/profil?tab=pengurus");
}
