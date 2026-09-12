"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_SLIDES = [
  { imageUrl: "/hero/slide-1.jpg", linkUrl: null },
  { imageUrl: "/hero/slide-2.jpg", linkUrl: null },
  { imageUrl: "/hero/slide-3.jpg", linkUrl: null },
  { imageUrl: "/hero/slide-4.jpg", linkUrl: null },
  { imageUrl: "/hero/slide-5.jpg", linkUrl: null },
  { imageUrl: "/hero/slide-6.jpg", linkUrl: null },
  { imageUrl: "/hero/slide-7.jpg", linkUrl: null },
  { imageUrl: "/hero/slide-8.jpg", linkUrl: null },
];
const INTERVAL_MS = 15000;

export default function HeroSlideshow({ slides }) {
  const SLIDES = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setActive((prevIdx) => (prevIdx - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [active, next]);

  return (
    <div className="absolute inset-0">
      {SLIDES.map((slide, i) => {
        const image = (
          <Image
            src={slide.imageUrl}
            alt={slide.title ?? ""}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
        );
        return (
          <div
            key={slide.imageUrl + i}
            className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
          >
            {slide.linkUrl ? (
              <Link href={slide.linkUrl} className="absolute inset-0 block">
                {image}
              </Link>
            ) : (
              image
            )}
          </div>
        );
      })}

      {/* soft blur + gradient for legibility, Mercury-style dreamy look */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />

      {/* prev / next arrows */}
      <button
        aria-label="Slide sebelumnya"
        onClick={prev}
        className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 items-center justify-center hover:bg-white/20 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        aria-label="Slide berikutnya"
        onClick={next}
        className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 items-center justify-center hover:bg-white/20 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {/* slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-lime" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
