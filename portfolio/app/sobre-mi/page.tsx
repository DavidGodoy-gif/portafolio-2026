import './about-preview.css'
import PublishedAbout from '@/components/PublishedAbout'
import AboutPreview from '@/components/AboutPreview'
import {getAbout} from '@/lib/about'
import {getContentContext} from '@/lib/cms'
export const dynamic='force-dynamic'
type Props={searchParams:Promise<{preview?:string}>}
export async function generateMetadata({searchParams}:Props){
 const published=(await searchParams).preview==='published'
 const [c,context]=await Promise.all([getAbout(published),getContentContext(published)])
 return {...(c?{title:c.seoTitle,description:c.description}:{}),...(context.drafts?{robots:{index:false,follow:false}}:{})}
}
export default async function SobreMi({searchParams}:Props){
 const published=(await searchParams).preview==='published'
 const [c,context]=await Promise.all([getAbout(published),getContentContext(published)])
 if(!c)return <>{context.notice&&<aside className="home-preview mx-auto max-w-[1200px]" role="status">{context.notice}</aside>}<PublishedAbout/></>
 return <AboutPreview content={c} preview={context.notice}/>
}
