"use client";
import {useEffect,useState} from 'react';import Icon from './Icon';
const channel='https://www.instagram.com/muijaktim';
export default function InstagramLive({variant='compact',count=4}){const [state,setState]=useState({loading:true,posts:[]});const [broken,setBroken]=useState({});
useEffect(()=>{let cancelled=false;fetch('/api/instagram',{signal:AbortSignal.timeout(8000)}).then(r=>r.json()).then(data=>{if(!cancelled)setState({loading:false,posts:data.ok?data.posts?.slice(0,count)||[]:[]});}).catch(()=>{if(!cancelled)setState({loading:false,posts:[]});});return()=>{cancelled=true;};},[count]);
if(state.loading)return <div><p role="status">Memuat galeri…</p><a className="media-channel-link" href={channel} target="_blank" rel="noopener noreferrer">Buka akun resmi</a></div>;
if(!state.posts.length)return <a href={channel} target="_blank" rel="noopener noreferrer" className="official-channel"><span className="submenu-icon"><Icon name="logo-instagram" size={28}/></span><span><strong>@muijaktim</strong><small>Foto dan kabar kegiatan. Buka akun resmi.</small></span><Icon name="arrow-forward-outline" size={20}/></a>;
return <div><div className={'instagram-grid '+(variant==='full'?'instagram-grid--full':'')}>{state.posts.map(item=><a key={item.id} href={item.permalink||channel} target="_blank" rel="noopener noreferrer" aria-label={item.caption||'Lihat kiriman Instagram'}>{item.mediaUrl&&!broken[item.id]?<img src={item.mediaUrl} alt="" onError={()=>setBroken(prev=>({...prev,[item.id]:true}))}/>:<Icon name="logo-instagram" size={28}/ >}{variant==='full'&&item.caption&&<span>{item.caption}</span>}</a>)}</div><a className="media-channel-link" href={channel} target="_blank" rel="noopener noreferrer">Ikuti @muijaktim</a></div>;}

