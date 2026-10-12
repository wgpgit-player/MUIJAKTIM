"use client";
import {useEffect,useState} from 'react';import Icon from './Icon';
const channel='https://www.youtube.com/channel/UCPCvI_k-9ActfrHedgePADw';
export default function MuiTvBox(){const [state,setState]=useState({loading:true,video:null});const [broken,setBroken]=useState(false);
useEffect(()=>{let cancelled=false;fetch('/api/youtube',{signal:AbortSignal.timeout(8000)}).then(r=>r.json()).then(data=>{if(!cancelled)setState({loading:false,video:data.ok?data.videos?.[0]||null:null});}).catch(()=>{if(!cancelled)setState({loading:false,video:null});});return()=>{cancelled=true;};},[]);
const v=state.video;return <div className="media-card"><h3><Icon name="logo-youtube" size={22}/>MUI Jaktim TV</h3>{state.loading?<div><p role="status">Memuat video terbaru…</p><a className="media-channel-link" href={channel} target="_blank" rel="noopener noreferrer">Buka kanal resmi</a></div>:v?.thumbnail&&!broken?<a href={v.url||channel} target="_blank" rel="noopener noreferrer" className="video-link"><div className="video-thumbnail"><img src={v.thumbnail} alt="" onError={()=>setBroken(true)}/><span><Icon name="play-outline" size={24}/></span></div><strong>{v.title}</strong><small>Tonton di YouTube</small></a>:<a href={channel} target="_blank" rel="noopener noreferrer" className="official-channel"><span className="submenu-icon"><Icon name="logo-youtube" size={28}/></span><span><strong>Kanal YouTube MUI Jaktim</strong><small>Kajian dan dokumentasi kegiatan. Buka kanal resmi.</small></span><Icon name="arrow-forward-outline" size={20}/></a>}</div>;
}

