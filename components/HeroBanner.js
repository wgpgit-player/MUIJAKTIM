import Image from "next/image";
import Link from "next/link";

export default function HeroBanner({ slide }) {
  const image = <Image src={slide?.imageUrl || "/hero/slide-1.jpg"} alt={slide?.title || ""} fill priority className="object-cover" sizes="100vw" />;
  return <div className="absolute inset-0" data-hero="static">
    {slide?.linkUrl ? <Link href={slide.linkUrl} className="absolute inset-0 block" tabIndex={-1}>{image}</Link> : image}
    <div className="absolute inset-0 pointer-events-none" style={{background:"linear-gradient(180deg, rgba(8,60,40,0.24) 0%, rgba(0,0,0,0.60) 30%, rgba(0,0,0,0.60) 70%, rgba(8,60,40,0.30) 100%)"}} />
  </div>;
}
