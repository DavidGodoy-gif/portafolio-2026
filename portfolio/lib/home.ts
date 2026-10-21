import 'server-only'
import {getContentContext} from './cms'
export type HomeImage={asset:{_ref?:string;_id?:string};alt?:string;crop?:unknown;hotspot?:unknown}
export type HomeProject={_key:string;case?:{_ref:string};title:string;context?:string;summary?:string;description?:string;contribution?:string;linkLabel:string;slug:string;thumbnail?:HomeImage;image?:HomeImage}
export type HomeContent={
  identity?:string;headline:string;headlineAccent?:string;description?:string;differentiator?:string;primaryLabel?:string;aboutLabel?:string
  workLabel?:string;workTitle?:string;workIntro?:string;projects:HomeProject[]
  processLabel?:string;processTitle?:string;steps:{_key:string;title?:string;description?:string}[]
  aboutTitle?:string;aboutText?:string;aboutLinkLabel?:string;cvLabel?:string;portrait?:HomeImage;cv?:string
  contactLabel?:string;contactTitle?:string;contactText?:string;emailLabel?:string;linkedinLabel?:string;email?:string;linkedinUrl?:string;seoTitle?:string;seoDescription?:string
}
export async function getHome(published=false):Promise<HomeContent|null>{
 const {reader}=await getContentContext(published)
 if(!reader)return null
 return reader.fetch(`*[_type == "home" && _id == "home"][0]{...,
  "projects":coalesce(projects[]{...,"slug":case->slug.current,"thumbnail":case->thumbnail},[]),
  "steps":coalesce(steps,[]),
  "portrait":about->content[_type=="image"][0],
  "cv":about->content[_type=="pdfBlock"][0].file.asset->url,
  "email":contact->email,"linkedinUrl":contact->linkedinUrl
 }`,{},{cache:'no-store'})
}
