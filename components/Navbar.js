"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import Icon from "./Icon";
import TopUtilityBar from "./TopUtilityBar";
import { createClient } from "@/lib/supabase/client";

const MENU = [
  {
    label: "Tentang Kami",
    href: "/profil",
    sub: [
      { label: "Profil MUI Jaktim", href: "/profil", desc: "Sejarah, latar belakang, serta fungsi MUI di Jakarta Timur" },
      { label: "Susunan Pengurus", href: "/profil?tab=pengurus", desc: "Bagan struktur dan daftar nama pengurus lengkap setiap komisi" },
      { label: "Bidang & Komisi", href: "/profil/komisi", desc: "Daftar lengkap bidang, jumlah anggota, dan susunan kepengurusan tiap komisi" },
      { label: "Visi, Misi & Program", href: "/profil?tab=visi-misi", desc: "Arah tujuan organisasi dan daftar program kerja unggulan" },
    ],
  },
  {
    label: "Berita & Opini",
    href: "/berita",
    sub: [
      { label: "Kabar Jakarta Timur", href: "/berita/kabar-jakarta-timur", desc: "Liputan acara, kegiatan, dan berita keagamaan lokal" },
      { label: "Opini Ulama", href: "/berita/opini", desc: "Tulisan dan pandangan ulama terkait isu sosial-keagamaan terkini" },
      { label: "Rilis Pers / Maklumat", href: "/berita/rilis-pers", desc: "Dokumen pernyataan sikap, himbauan, atau pengumuman resmi" },
    ],
  },
  {
    label: "Fiqih & Fatwa",
    href: "/fatwa",
    sub: [
      { label: "Fiqih Ibadah & Kesehatan", href: "/fatwa/ibadah-kesehatan", desc: "Panduan praktis ibadah harian (shalat, puasa) dan adab" },
      { label: "Fiqih Muamalah (Ekonomi Syariah)", href: "/fatwa/muamalah", desc: "Hukum transaksi modern, jual beli, dan investasi" },
      { label: "Direktori Fatwa Kontemporer", href: "/fatwa/direktori-kontemporer", desc: "Arsip putusan fatwa MUI mengenai masalah-masalah modern" },
    ],
  },
  {
    label: "Kitab",
    href: "/kitab",
    sub: [
      { label: "Al-Qur'an Digital", href: "/kitab/al-quran", desc: "Al-Qur'an dengan terjemahan, tajwid, dan tafsir ringkas" },
      { label: "Turats (Kitab-kitab)", href: "/kitab/turats", desc: "Direktori rujukan dan terjemahan kitab klasik (salaf & khalaf)" },
      { label: "Kamus", href: "/kitab/kamus", desc: "Kamus Arab-Indonesia, Inggris-Indonesia & glosarium istilah" },
    ],
  },
  {
    label: "Amalan",
    href: "/amalan",
    sub: [
      { label: "Fiqih Wanita (Muslimah)", href: "/keluarga/fiqih-wanita", desc: "Hukum syariat khusus perempuan (haid, aurat, perhiasan, dll)" },
      { label: "Parenting Islami", href: "/keluarga/parenting", desc: "Tips mendidik anak dan membangun keluarga harmonis" },
      { label: "Doa & Dzikir", href: "/amalan/doa-dzikir", desc: "Kumpulan doa harian dan dzikir rutin sesuai tuntunan" },
      { label: "Teks Khutbah Jumat", href: "/amalan/khutbah-jumat", desc: "Bank naskah khutbah berkualitas dan siap diedit" },
      { label: "Hikmah & Akhlak", href: "/amalan/hikmah-akhlak", desc: "Kisah teladan, nasehat bijak, dan materi penyucian jiwa" },
    ],
  },
  {
    label: "Layanan Umat",
    href: "/layanan",
    sub: [
      { label: "Tanya Ulama", href: "/layanan/tanya-ulama", desc: "Panduan umum untuk pertanyaan agama sehari-hari" },
      { label: "Jadwal Shalat & Kiblat", href: "/layanan/jadwal-shalat", desc: "Penunjuk waktu shalat real-time dan kompas kiblat" },
      { label: "Kalkulator Zakat", href: "/layanan/kalkulator-zakat", desc: "Alat hitung zakat fitrah, harta (maal), emas, dan profesi" },
      { label: "Konsultasi Keluarga", href: "/keluarga/konsultasi", desc: "Solusi seputar konflik rumah tangga, warisan, dan pernikahan" },
    ],
  },
];

function iconFor(href) {
 if(href.includes('pengurus')||href.includes('komisi'))return 'people-outline';
 if(href.startsWith('/profil'))return 'business-outline';
 if(href.startsWith('/berita'))return 'newspaper-outline';
 if(href.startsWith('/fatwa'))return 'document-text-outline';
 if(href.includes('tanya')||href.includes('konsultasi'))return 'chatbubbles-outline';
 if(href.includes('shalat'))return 'time-outline';
 if(href.includes('zakat'))return 'calculator-outline';
 return 'book-outline';
}
function MenuItem({item,onClick,pathname}) {return <Link href={item.href} onClick={onClick} aria-current={pathname===item.href?'page':undefined} className="submenu-item"><span className="submenu-icon"><Icon name={iconFor(item.href)} size={22}/></span><span><strong>{item.label}</strong><small>{item.desc}</small></span></Link>;}
function NavDropdown({item,pathname}) {
 const [open,setOpen]=useState(false); const id=useId(); const trigger=useRef(null);
 const active=pathname===item.href||pathname.startsWith(item.href+'/');
 return <div className="nav-dropdown" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();setOpen(false);trigger.current?.focus();}}}>
 <div className="nav-dropdown__trigger"><Link href={item.href} aria-current={active?'page':undefined}>{item.label}</Link><button ref={trigger} type="button" aria-label={'Menu '+item.label} aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setOpen(true);requestAnimationFrame(()=>document.getElementById(id)?.querySelector('a')?.focus());}}}><Icon name="chevron-down-outline" size={16}/></button></div>
 <div id={id} hidden={!open} className="nav-dropdown__panel">{item.sub.map(c=><MenuItem key={c.href} item={c} pathname={pathname} onClick={()=>setOpen(false)}/>)}</div></div>;
}
export default function Navbar(){
 const pathname=usePathname()||'/';const [menuOpen,setMenuOpen]=useState(false);const [scrolled,setScrolled]=useState(false);const [isLoggedIn,setIsLoggedIn]=useState(false);const menuRef=useRef(null);const toggleRef=useRef(null);
 useEffect(()=>{const toggle=()=>setMenuOpen(value=>!value);window.addEventListener('mui:menu-toggle',toggle);return()=>window.removeEventListener('mui:menu-toggle',toggle);},[]);
 useEffect(()=>{window.dispatchEvent(new CustomEvent('mui:menu-state',{detail:menuOpen}));},[menuOpen]);
 const home=pathname==='/';
 useEffect(()=>{setMenuOpen(false);},[pathname]);
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>36);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);},[pathname]);
 useEffect(()=>{const supabase=createClient();supabase.auth.getSession().then(({data})=>setIsLoggedIn(!!data.session));const {data}=supabase.auth.onAuthStateChange((_event,session)=>setIsLoggedIn(!!session));return()=>data.subscription.unsubscribe();},[]);
 useEffect(()=>{if(!menuOpen)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';menuRef.current?.querySelector('a')?.focus();return()=>{document.body.style.overflow=old;};},[menuOpen]);
 function closeMenu(){setMenuOpen(false);if(window.matchMedia('(max-width:767px)').matches)document.querySelector('.bottom-nav-menu')?.focus();else toggleRef.current?.focus();}
 function trap(e){if(e.key==='Escape'){closeMenu();return;}if(e.key!=='Tab')return;const els=[...menuRef.current.querySelectorAll('a,button,summary')].filter(x=>x&&x.getClientRects().length);const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
 return <div className={'navbar-space'+(home?' navbar-space--home':'')}><header className={'site-navbar'+(home?' site-navbar--home':'')+(scrolled?' is-scrolled':'')+(menuOpen?' menu-is-open':'')} onKeyDown={menuOpen?trap:undefined}>
 <div className="desktop-utility"><TopUtilityBar/></div>
 <div className="site-container navbar-row"><Link href="/" className="site-brand"><Image src="/logo.png" alt="Logo resmi MUI" width={40} height={40}/><span><strong>MUI Jakarta Timur</strong><small>Majelis Ulama Indonesia</small></span></Link>
 <nav aria-label="Navigasi utama" className="desktop-menu">{MENU.map(item=><NavDropdown key={item.href} item={item} pathname={pathname}/>)}</nav>
 <Link className="account-link" href={isLoggedIn?'/profil/akun':'/login'}>{isLoggedIn?'Akun Saya':'Login'}</Link>
 <button ref={toggleRef} className="mobile-menu-toggle" aria-label={menuOpen?'Tutup menu situs':'Buka menu situs'} aria-expanded={menuOpen} aria-controls="site-menu" onClick={()=>menuOpen?closeMenu():setMenuOpen(true)}><span>{menuOpen?'Tutup':'Menu'}</span><Icon name={menuOpen?'close-outline':'menu-outline'} size={22}/></button></div>
 {menuOpen&&<nav ref={menuRef} id="site-menu" aria-label="Seluruh bagian situs" className="mobile-site-menu"><div className="app-menu-heading"><strong>Jelajahi MUI Jaktim</strong><button type="button" aria-label="Tutup panel menu" onClick={closeMenu}><Icon name="close-outline" size={22}/></button></div><Link href="/" onClick={closeMenu}>Beranda</Link>{MENU.map(item=><details key={item.href} open={pathname.startsWith(item.href)}><summary>{item.label}<Icon name="chevron-down-outline" size={16}/></summary><Link href={item.href} onClick={closeMenu}>Lihat {item.label}</Link>{item.sub.map(c=><MenuItem key={c.href} item={c} pathname={pathname} onClick={closeMenu}/>)}</details>)}<Link href={isLoggedIn?'/profil/akun':'/login'} onClick={closeMenu}>{isLoggedIn?'Akun Saya':'Login'}</Link></nav>}
 </header></div>;
}

