"use client";
import {useEffect,useRef,useState} from "react";
export default function NewsImage({src,alt="",category="Berita",featured=false,compact=false}){
 const [failed,setFailed]=useState(false);const imageRef=useRef(null);
 useEffect(()=>{setFailed(false);if(imageRef.current?.complete && !imageRef.current.naturalWidth)setFailed(true);},[src]);
 return src&&!failed?<img ref={imageRef} src={src} alt={alt} onError={()=>setFailed(true)} className={featured?"news-image news-image--featured":"news-image"}/>:<div className={"news-image-fallback"+(compact?" news-image-fallback--compact":"")}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>{!compact&&<span>{category} · MUI Jakarta Timur</span>}</div>;
}
