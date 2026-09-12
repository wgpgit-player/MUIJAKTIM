import { prisma } from "@/lib/prisma";
import ProfilClient from "./ProfilClient";

export const metadata = {
  title: "Profil — MUI Jakarta Timur",
};
export const dynamic = "force-dynamic";

const PIMPINAN_INTI_POSITIONS = ["Ketua Umum", "Wakil Ketua Umum", "Sekretaris Umum", "Bendahara Umum"];

export default async function ProfilPage({ searchParams }) {
  const params = await searchParams;
  const initialTab = params?.tab ?? "sejarah";

  const [allPengurus, bidangList, pageContentRows] = await Promise.all([
    prisma.pengurus.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.bidangKomisi.findMany({ orderBy: { name: "asc" } }),
    prisma.pageContent.findMany({ where: { key: { in: ["sejarah", "visi", "misi"] } } }),
  ]);

  const pageContentByKey = Object.fromEntries(pageContentRows.map((p) => [p.key, p]));

  const pimpinanInti = allPengurus
    .filter((p) => PIMPINAN_INTI_POSITIONS.includes(p.position))
    .map((p) => ({ nama: p.name, jabatan: p.position }));

  const dewanRows = allPengurus.filter((p) => p.position.includes("Dewan Pertimbangan"));
  const dewanPertimbangan = {
    ketua: dewanRows.find((p) => p.position === "Ketua Dewan Pertimbangan")?.name ?? "",
    wakilKetua: dewanRows.find((p) => p.position === "Wakil Ketua Dewan Pertimbangan")?.name ?? "",
    sekretaris: dewanRows.find((p) => p.position === "Sekretaris Dewan Pertimbangan")?.name ?? "",
    anggota: dewanRows.filter((p) => p.position === "Anggota Dewan Pertimbangan").map((p) => p.name),
  };

  const bidangListPlain = bidangList.map((b) => ({
    slug: b.slug,
    nama: b.name,
    ketua: b.chairName,
    members: Array.isArray(b.members) ? b.members : [],
  }));

  return (
    <ProfilClient
      initialTab={initialTab}
      pimpinanInti={pimpinanInti}
      dewanPertimbangan={dewanPertimbangan}
      bidangList={bidangListPlain}
      sejarah={pageContentByKey.sejarah}
      visi={pageContentByKey.visi}
      misi={pageContentByKey.misi}
    />
  );
}
