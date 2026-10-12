"use client";
import Icon from "./Icon";
import {useEffect,useRef,useState} from "react";
export default function NewsImage({src,alt="",category="Berita",featured=false,compact=false}){
 const [failed,setFailed]=useState(false);const imageRef=useRef(null);
 useEffect(()=>{setFailed(false);if(imageRef.current?.complete && !imageRef.current.naturalWidth)setFailed(true);},[src]);
 return src&&!failed?<img ref={imageRef} src={src} alt={alt} onError={()=>setFailed(true)} className={featured?"news-image news-image--featured":"news-image"}/>:<div className={"news-image-fallback"+(compact?" news-image-fallback--compact":"")}><Icon name="newspaper-outline" size={26}/>{!compact&&<span>{category} · MUI Jakarta Timur</span>}</div>;
}
