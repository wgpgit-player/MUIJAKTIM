import { redirect } from "next/navigation";

// Digabung ke dalam tab "Visi & Misi" di halaman /profil.
export default function VisiMisiRedirect() {
  redirect("/profil?tab=visi-misi");
}
