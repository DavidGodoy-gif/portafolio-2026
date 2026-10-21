import assert from 'node:assert/strict'
import {readFile,writeFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {createClient} from '@sanity/client'
import {editorialToken} from './editorial-session.mjs'
import {homePatch,aboutPatch} from './editorial-patch.mjs'
const token=editorialToken()
const folder=process.argv.find(a=>a.startsWith('--backup='))?.slice(9)
async function main(){
 if(!token||!folder)throw Error('Requiere credencial autorizada y --backup=<carpeta>')
 const before=JSON.parse(await readFile(`${folder}/before.json`,'utf8'))
 const c=createClient({projectId:before.projectId,dataset:before.dataset,apiVersion:'2025-02-19',useCdn:false,perspective:'raw',token})
 const all=await c.fetch('*[_type in ["home","sobreMi","footer","case"]]')
 const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v
 const hash=v=>createHash('sha256').update(JSON.stringify(canonical(v))).digest('hex')
 const excluded=new Set(before.targets)
 for(const doc of before.documents)if(!excluded.has(doc._id))assert.equal(hash(all.find(d=>d._id===doc._id)),hash(doc),doc._id)
 const homeSeed=JSON.parse(await readFile(new URL('../content/home.json',import.meta.url),'utf8'))
 const aboutSeed=JSON.parse(await readFile(new URL('../content/about.json',import.meta.url),'utf8'))
 const home=all.find(d=>d._id==='drafts.home'),about=all.find(d=>d._id===`drafts.${aboutSeed.aboutRef}`)
 for(const [field,value]of Object.entries(homePatch(before.previousDrafts[0]||before.published[0],homeSeed)))assert.deepEqual(home[field],value,field)
 assert.deepEqual(about.presentation,aboutPatch(before.previousDrafts[1]||before.published[1],aboutSeed).presentation)
 assert.deepEqual(about.content,(before.previousDrafts[1]||before.published[1]).content)
 const reader=c.withConfig({perspective:'drafts'})
 const resolved=await reader.fetch(`{
  "home":*[_type=="home" && _id=="home"][0]{headline,"cases":projects[].case->slug.current,"photo":about->content[_type=="image"][0].asset._ref,"cv":about->content[_type=="pdfBlock"][0].file.asset->url,"email":contact->email},
  "about":*[_id==$about][0]{"headline":presentation.headline,"cases":presentation.projects[].case->slug.current,"photo":content[_type=="image"][0].asset._ref,"cv":content[_type=="pdfBlock"][0].file.asset->url,"email":presentation.contact->email}
 }`,{about:aboutSeed.aboutRef})
 assert.equal(resolved.home.headline,home.headline);assert.equal(resolved.about.headline,about.presentation.headline)
 for(const resource of ['photo','cv','email']){assert.ok(resolved.home[resource]);assert.equal(resolved.home[resource],resolved.about[resource])}
 const pages=[]
 for(const [path,headline]of [['/',home.headline],['/sobre-mi',about.presentation.headline]]){
  const res=await fetch(`http://127.0.0.1:3000${path}`),html=await res.text()
  assert.equal(res.status,200);assert.ok(html.includes(headline));assert.ok(html.includes('Vista previa · contenido de Sanity'));assert.ok(!html.includes('propuesta editorial sin guardar'))
  assert.ok(!html.includes(token),'No credential may appear in HTML')
  pages.push({path,status:res.status,contentMatchesSanity:true})
 }
 for(const path of ['/?preview=published','/sobre-mi?preview=published']){
  const res=await fetch(`http://127.0.0.1:3000${path}`),html=await res.text()
  assert.equal(res.status,200);assert.ok(!html.includes('Vista previa · contenido de Sanity'))
 }
 const report={projectId:before.projectId,dataset:before.dataset,drafts:before.targets,pages,resourcesPreserved:true,publishedAndCasesUnchanged:true,credentialAbsentFromHTML:true,verifiedAt:new Date().toISOString()}
 await writeFile(`${folder}/frontend-verification.json`,JSON.stringify(report,null,2),{mode:0o600})
 console.log(JSON.stringify(report,null,2))
}
main().catch(e=>{console.error(JSON.stringify({message:e.message,status:e.statusCode||null}));process.exitCode=1})
