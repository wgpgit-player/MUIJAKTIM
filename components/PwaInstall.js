"use client";
import {useEffect,useState} from "react";
import Image from "next/image";
export default function PwaInstall(){
  const [prompt,setPrompt]=useState(null);const [installed,setInstalled]=useState(true);const [guide,setGuide]=useState(false);const [ios,setIos]=useState(false);
  useEffect(()=>{
    setInstalled(window.matchMedia('(display-mode: standalone)').matches||!!navigator.standalone);
    setIos(/iPad|iPhone|iPod/.test(navigator.userAgent));
    const offer=e=>{e.preventDefault();setPrompt(e);};const done=()=>{setInstalled(true);setPrompt(null);};
    window.addEventListener('beforeinstallprompt',offer);window.addEventListener('appinstalled',done);
    return()=>{window.removeEventListener('beforeinstallprompt',offer);window.removeEventListener('appinstalled',done);};
  },[]);
  if(installed)return null;
  async function install(){if(!prompt){setGuide(value=>!value);return;}await prompt.prompt();const choice=await prompt.userChoice;setPrompt(null);if(choice.outcome==='accepted')setInstalled(true);}
  return <aside className="app-install md:hidden"><div><Image src="/logo.png" alt="" width={36} height={36}/><span><strong>MUI Jaktim di layar utama</strong><small>Akses layanan lebih cepat.</small></span><button type="button" onClick={install} aria-expanded={guide} aria-controls="install-guide">{prompt?'Pasang':'Cara pasang'}</button></div><p id="install-guide" hidden={!guide}>{ios?'Di Safari, buka Bagikan, lalu pilih Tambahkan ke Layar Utama.':'Buka menu browser, lalu pilih Instal aplikasi atau Tambahkan ke layar utama jika tersedia.'}</p></aside>;
}
