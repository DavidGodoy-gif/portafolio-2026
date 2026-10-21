import 'server-only'
import {getContentContext} from './cms'
import type {HomeImage} from './home'
export type AboutContent={
 label?:string;identity?:string;headline:string;headlineAccent?:string;description?:string;workLabel?:string;cvLabel?:string
 experienceLabel?:string;experienceTitle?:string;experienceText?:string;contributionTitle?:string;contributions:string[]
 projectsLabel?:string;projectsTitle?:string;caseAction?:string;projects:{_key:string;caseRef?:string;context?:string;title?:string;description?:string;linkLabel?:string;slug?:string}[]
 criteriaLabel?:string;criteriaTitle?:string;criteria:{_key:string;title?:string;description?:string}[]
 differentiatorLabel?:string;differentiatorTitle?:string;differentiatorText?:string
 contactLabel?:string;contactTitle?:string;contactText?:string;emailLabel?:string;linkedinLabel?:string;seoTitle?:string
 portrait?:HomeImage;cv?:string;email?:string;linkedinUrl?:string
}
export async function getAbout(published=false):Promise<AboutContent|null>{
 const {reader}=await getContentContext(published)
 if(!reader)return null
 return reader.fetch(`*[_type=="sobreMi" && _id=="88f18267-98ff-476c-88bb-1be7e3250ca9" && defined(presentation.headline)][0]{
  ...presentation,
  "projects":coalesce(presentation.projects[]{...,"caseRef":case._ref,"slug":case->slug.current},[]),
  "contributions":coalesce(presentation.contributions,[]),"criteria":coalesce(presentation.criteria,[]),
  "portrait":content[_type=="image"][0],"cv":content[_type=="pdfBlock"][0].file.asset->url,
  "email":presentation.contact->email,"linkedinUrl":presentation.contact->linkedinUrl
 }`,{},{cache:'no-store'})
}
