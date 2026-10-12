"use client";
import { useEffect, useState } from "react";
import Icon from "./Icon";

export default function HomeInteractions() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > Math.max(800, window.innerHeight));
    update(); window.addEventListener("scroll", update, {passive:true});
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    if (!reduce.matches && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {entry.target.classList.add("section-arrived"); observer.unobserve(entry.target);}
      }), {threshold:0.08});
      document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    }
    return () => {window.removeEventListener("scroll", update); observer?.disconnect();};
  }, []);
  return visible && <div className="back-top-dock"><button className="back-top" type="button" aria-label="Kembali ke atas" onClick={() => {
    window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
    document.querySelector(".site-brand")?.focus({preventScroll:true});
  }}><Icon name="arrow-up-outline" size={20}/><span>Ke atas</span></button></div>;
}
