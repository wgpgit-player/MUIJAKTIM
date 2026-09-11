import ProfilClient from "./ProfilClient";

export const metadata = {
  title: "Profil — MUI Jakarta Timur",
};

export default function ProfilPage({ searchParams }) {
  const initialTab = searchParams?.tab ?? "sejarah";
  return <ProfilClient initialTab={initialTab} />;
}
