"use client";
import { useRef, useState } from "react";
import Icon from "./Icon";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const input = useRef(null);
  return <form action="/fatwa" className="hero-search" role="search">
    <Icon name="search-outline" size={20} />
    <input ref={input} type="search" name="q" aria-label="Cari judul atau nomor fatwa" placeholder="Cari fatwa, mis. zakat penghasilan" value={query} onChange={e => setQuery(e.target.value)} />
    {query && <button type="button" className="search-reset" aria-label="Hapus pencarian" onClick={() => {setQuery(""); input.current?.focus();}}><Icon name="close-outline" size={20} /></button>}
    <button type="submit" className="search-submit">Cari Fatwa</button>
  </form>;
}
