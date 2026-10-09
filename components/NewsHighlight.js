import Link from "next/link";
import NewsCard from "./NewsCard";
export default function NewsHighlight({item}){return <Link href={"/berita/"+item.slug} className="block h-full"><NewsCard item={item}/></Link>;}
