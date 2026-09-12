import HeroSlideForm from "@/components/admin/HeroSlideForm";
import { createHeroSlide } from "../actions";

export const metadata = { title: "Slide Baru — Admin MUI Jakarta Timur" };

export default function NewHeroSlidePage() {
  return (
    <div>
      <h1 className="text-[22px] font-extrabold text-green-dk2 mb-6">Hero Slide Baru</h1>
      <HeroSlideForm action={createHeroSlide} />
    </div>
  );
}
