import '@/lib/trust-system-ca'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {client,urlFor} from '@/lib/sanity'
import CasePortableContent from '@/components/CasePortableContent'
import CaseIndex from '@/components/CaseIndex'
import MediaReveal from '@/components/MediaReveal'
import {caseBlocks,caseOutline} from '@/lib/case-content'
export const dynamic = 'force-dynamic'
type CaseSummary = {_id:string;title?:string;slug:string;order?:number;thumbnail?:{asset?:{metadata?:{dimensions?:{width:number;height:number}}};alt?:string}}
type CaseDocument = CaseSummary & {excerpt?:string;problem?:string;process?:unknown[];metrics?:{_key?:string;label?:string;value?:number}[]}
const CASE_QUERY = `*[_type == "case" && slug.current == $slug][0]{
  _id,title,excerpt,problem,thumbnail{...,asset->{...,metadata{dimensions}}},metrics,"slug":slug.current,
  process[]{...,
    _type == "image" => {...,asset->{... ,metadata{dimensions}}},
    _type == "pdfBlock" => {...,file{...,asset->{url,originalFilename,mimeType,size}}}
  }
}`
// Explicit editorial priority first; ties and missing priorities use immutable lexical keys.
const CASE_ORDER_QUERY = `*[_type == "case" && defined(slug.current)] | order(coalesce(order,2147483647) asc,slug.current asc,_id asc){_id,title,"slug":slug.current,order,thumbnail}`
type Props = {params:Promise<{slug:string}>}
export async function generateMetadata({params}:Props) {
  const {slug}=await params
  const c = await client.fetch<CaseDocument | null>(CASE_QUERY,{slug})
  return c ? {title:`${c.title || 'Caso'} — David Godoy`,description:c.excerpt || c.problem} : {title:'Caso no encontrado — David Godoy'}
}
export default async function Caso({params}:Props) {
  const {slug}=await params
  const [c,cases] = await Promise.all([client.fetch<CaseDocument | null>(CASE_QUERY,{slug}),client.fetch<CaseSummary[]>(CASE_ORDER_QUERY)])
  if(!c)notFound()
  const blocks = caseBlocks(c.process)
  const outline = caseOutline(blocks)
  const index = cases.findIndex(item=>item._id===c._id)
  const previous = index>0 ? cases[index-1] : null
  const next = index>=0 ? cases[index+1] : null
  const image = c.thumbnail?.asset ? urlFor(c.thumbnail).width(1800).auto('format').url() : null
  const metrics = c.metrics?.filter(m=>m.label && typeof m.value==='number') || []
  return <main className="case-article">
    <nav className="case-breadcrumb" aria-label="Ruta de navegación"><Link href="/casos">Trabajo</Link>{c.title && <><span aria-hidden>/</span><span aria-current="page">{c.title}</span></>}</nav>
    {(c.title || c.excerpt || c.problem) && <header className="case-article-header">{c.title && <h1>{c.title}</h1>}{c.excerpt && <p className="case-deck">{c.excerpt}</p>}{c.problem && <p className="case-problem">{c.problem}</p>}</header>}
    {image && <figure className="case-cover"><MediaReveal><Image src={image} alt={c.thumbnail?.alt || ''} width={c.thumbnail?.asset?.metadata?.dimensions?.width || 1400} height={c.thumbnail?.asset?.metadata?.dimensions?.height || 900} sizes="(min-width: 1200px) 1200px, 100vw" priority /></MediaReveal></figure>}
    {blocks.length>0 && <div className={`case-reading-layout${outline.length?'':' without-index'}`}><CaseIndex headings={outline}/><article className="case-document" aria-label={c.title || 'Contenido del caso'}><CasePortableContent value={blocks} layout="article" /></article></div>}
    {metrics.length>0 && <section className="case-document-metrics" aria-labelledby="document-metrics"><h2 id="document-metrics">Métricas del documento</h2><dl>{metrics.map((m,i)=><div key={m._key || i}><dt>{m.label}</dt><dd>{m.value}</dd></div>)}</dl></section>}
    <nav className="case-pagination" aria-label="Navegación entre casos"><Link className="case-back" href="/casos">← Volver a trabajo</Link>{previous && <Link href={`/casos/${previous.slug}`} rel="prev"><span>Caso anterior</span><span>← {previous.title}</span></Link>}{next && <Link href={`/casos/${next.slug}`} rel="next"><span>Siguiente caso</span><span>{next.title} →</span></Link>}</nav>
  </main>
}
