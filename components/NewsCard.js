import {formatDateID} from "@/lib/date";
import NewsImage from "./NewsImage";
export default function NewsCard({item}){return <article className="news-card"><NewsImage src={item.imageUrl} category={item.category}/><div className="news-card__body"><p className="news-category">{item.category} · MUI Jakarta Timur</p><h2>{item.title}</h2><p className="news-date">{formatDateID(item.date)}</p></div></article>;}
