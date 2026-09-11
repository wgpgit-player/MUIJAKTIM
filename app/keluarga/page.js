import { redirect } from "next/navigation";

// "Keluarga & Muslimah" digabung ke dalam nav "Amalan" —
// halaman index lama dialihkan supaya tidak jadi halaman yatim.
export default function KeluargaIndexRedirect() {
  redirect("/amalan");
}
