import {getHome} from '@/lib/home'
import {getContentContext} from '@/lib/cms'
import HomeView from '@/components/HomeView'
import LegacyHome from '@/components/LegacyHome'
export const dynamic='force-dynamic'
type Props={searchParams:Promise<{preview?:string}>}
export async function generateMetadata({searchParams}:Props){
 const published=(await searchParams).preview==='published'
 const [c,context]=await Promise.all([getHome(published),getContentContext(published)])
 return {...(c?{title:c.seoTitle,description:c.seoDescription}:{}),...(context.drafts?{robots:{index:false,follow:false}}:{})}
}
export default async function Home({searchParams}:Props){
 const published=(await searchParams).preview==='published'
 const [c,context]=await Promise.all([getHome(published),getContentContext(published)])
 if(!c)return <>{context.notice&&<aside className="home-preview mx-auto max-w-[1200px]" role="status">{context.notice}</aside>}<LegacyHome/></>
 return <HomeView content={c} preview={context.notice}/>
}
