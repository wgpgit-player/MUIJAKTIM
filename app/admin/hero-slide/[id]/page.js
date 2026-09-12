import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import HeroSlideForm from "@/components/admin/HeroSlideForm";
import { updateHeroSlide } from "../actions";

export const metadata = { title: "Edit Hero Slide — Admin MUI Jakarta Timur" };

export default async function EditHeroSlidePage({ params }) {
  const { id } = await params;
  const item = await prisma.heroSlide.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Edit Hero Slide</h1>
      <HeroSlideForm action={updateHeroSlide.bind(null, id)} initial={item} />
    </div>
  );
}
