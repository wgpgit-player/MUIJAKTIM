"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const SECTIONS={profil:"Tentang Kami",berita:"Berita & Opini",fatwa:"Fiqih & Fatwa",kitab:"Kitab",amalan:"Amalan",keluarga:"Keluarga",layanan:"Layanan Umat"};
export default function PageHeader({title,desc,variant="general",breadcrumbs,children,layout="wide"}) {
 const parts=(usePathname()||"").split("/").filter(Boolean);
 const trail=breadcrumbs||(parts.length>1&&SECTIONS[parts[0]]?[{label:SECTIONS[parts[0]],href:"/"+parts[0]}]:[]);
 return <header className={"page-header page-header--"+variant}><div className={variant === "article" || layout === "reading" ? "reading-container" : "site-container"}>
 <nav aria-label="Breadcrumb" className="breadcrumb"><ol><li><Link href="/">Beranda</Link></li>{trail.map((c,i)=><li key={i}><span aria-hidden="true">/</span><Link href={c.href}>{c.label}</Link></li>)}<li><span aria-hidden="true">/</span><span aria-current="page">{title}</span></li></ol></nav>
 <h1>{title}</h1>{desc&&<p className="page-header__description">{desc}</p>}{children&&<div className="page-header__meta">{children}</div>}</div></header>;
}
