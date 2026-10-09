"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
const categories=[{label:"Semua",href:"/berita"},{label:"Kabar Jakarta Timur",href:"/berita/kabar-jakarta-timur"},{label:"Opini Ulama",href:"/berita/opini"},{label:"Rilis Pers & Maklumat",href:"/berita/rilis-pers"}];
export default function NewsFilters(){const pathname=usePathname();return <nav className="site-container py-6" aria-label="Kategori berita"><div className="category-filters">{categories.map(c=><Link key={c.href} href={c.href} aria-current={pathname===c.href?"page":undefined} className={"filter-chip shrink-0 border text-[13px] font-bold "+(pathname===c.href?"bg-green-dk2 text-white border-green-dk2":"bg-white border-line text-ink-soft")}>{c.label}</Link>)}</div></nav>;}
