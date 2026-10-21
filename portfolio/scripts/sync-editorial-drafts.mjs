import {createClient} from '@sanity/client'
import {readFile,mkdir,writeFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import assert from 'node:assert/strict'
import {homePatch,aboutPatch} from './editorial-patch.mjs'
import {editorialToken} from './editorial-session.mjs'
async function main(){
const token=editorialToken()
if(!token)throw new Error('Falta SANITY_API_WRITE_TOKEN o SANITY_AUTH_TOKEN en el entorno. No se ha consultado ni modificado ningún borrador.')
const projectId='lia9s4dq',dataset='production'
const c=createClient({projectId,dataset,apiVersion:'2025-02-19',perspective:'raw',useCdn:false,token})
const seed=JSON.parse(await readFile(new URL('../content/home.json',import.meta.url),'utf8'))
const aboutSeed=JSON.parse(await readFile(new URL('../content/about.json',import.meta.url),'utf8'))
assert.equal(seed.about._ref,aboutSeed.aboutRef,'Las referencias de Sobre mí no coinciden')
assert.equal(seed.contact._ref,aboutSeed.contactRef,'Las referencias de contacto no coinciden')
const publishedIds=['home',aboutSeed.aboutRef]
const draftIds=publishedIds.map(id=>`drafts.${id}`)
const [project,datasets,documents]=await Promise.all([c.projects.getById(projectId),c.datasets.list(),c.fetch('*[_type in ["home","sobreMi","footer","case"]]')])
assert.equal(project.id,projectId)
assert.ok(datasets.some(d=>d.name===dataset))
const homes=documents.filter(d=>d._type==='home')
assert.ok(homes.every(d=>['home','drafts.home'].includes(d._id)),'Hay otro documento home: resolver el destino antes de escribir, sin duplicarlo.')
const find=id=>documents.find(d=>d._id===id)
const previous=draftIds.map((id,i)=>find(id)||find(publishedIds[i]))
assert.equal(previous[1]?._type,'sobreMi','No existe el documento Sobre mí esperado')
assert.ok(!previous[0]||previous[0]._type==='home')
if(previous[0]?.about)assert.equal(previous[0].about._ref,aboutSeed.aboutRef,'La referencia existente de Sobre mí difiere; requiere revisión')
const patches=[homePatch(previous[0],seed),aboutPatch(previous[1],aboutSeed)]
const referenceIds=[patches[0].about._ref,patches[0].contact._ref,patches[1].presentation.contact._ref,...patches[0].projects.map(p=>p.case?._ref),...patches[1].presentation.projects.map(p=>p.case?._ref)].filter(Boolean)
for(const id of referenceIds)assert.ok(find(id),`Referencia publicada ausente: ${id}`)
assert.equal(find(patches[0].contact._ref)?._type,'footer')
assert.equal(find(patches[1].presentation.contact._ref)?._type,'footer')
for(const row of [...patches[0].projects,...patches[1].presentation.projects])assert.equal(find(row.case._ref)?._type,'case')
const newImages=patches[0].projects.map(p=>p.image?.asset?._ref).filter(Boolean)
const assets=await c.getDocuments([...new Set(newImages)])
assert.ok(assets.every(Boolean),'Falta un asset referenciado')
const plan={projectId,dataset,projectName:project.displayName,targets:draftIds,priorDrafts:draftIds.map(id=>({id,exists:!!find(id),revision:find(id)?._rev})),fields:[Object.keys(patches[0]),Object.keys(patches[1].presentation)]}
if(!process.argv.includes('--apply')){console.log(JSON.stringify({...plan,mode:'dry-run',writes:0},null,2));process.exit(0)}
const stamp=new Date().toISOString().replace(/[:.]/g,'-')
const backupDir=new URL(`../backups/sanity/${stamp}/`,import.meta.url)
await mkdir(backupDir,{recursive:true})
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value
const hash=value=>createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex')
const before={...plan,createdAt:new Date().toISOString(),documents,assets,previousDrafts:draftIds.map(id=>find(id)||null),published:publishedIds.map(id=>find(id)||null)}
await writeFile(new URL('before.json',backupDir),JSON.stringify(before,null,2),{flag:'wx',mode:0o600})
const mutations=[]
for(let i=0;i<draftIds.length;i++){
 const current=find(draftIds[i])
 if(!current){
  const base=previous[i]?Object.fromEntries(Object.entries(previous[i]).filter(([key])=>key==='_type'||!key.startsWith('_'))):{_type:'home'}
  mutations.push({create:{...base,_id:draftIds[i]}})
 }
 mutations.push({patch:{id:draftIds[i],...(current?{ifRevisionID:current._rev}:{}),set:patches[i]}})
}
// One transaction, only the two draft IDs; revision guards protect edits made after the backup.
let result
try{result=await c.mutate(mutations,{visibility:'sync',returnDocuments:false})}
catch(e){console.error(JSON.stringify({message:'La escritura falló; copia anterior conservada.',backup:new URL('before.json',backupDir).pathname,status:e.statusCode}));throw e}
const after=await c.fetch('*[_type in ["home","sobreMi","footer","case"]]')
const untouched=documents.filter(d=>!draftIds.includes(d._id))
for(const old of untouched)assert.equal(hash(after.find(d=>d._id===old._id)),hash(old),`Documento ajeno cambiado durante la operación: ${old._id}`)
for(let i=0;i<draftIds.length;i++){
 const actual=after.find(d=>d._id===draftIds[i])
 for(const [field,value]of Object.entries(patches[i]))assert.deepEqual(actual[field],value,`No coincide ${draftIds[i]}.${field}`)
 for(const [field,value]of Object.entries(previous[i]||{}))if(!field.startsWith('_')&&!Object.hasOwn(patches[i],field))assert.deepEqual(actual[field],value,`Campo ajeno perdido: ${field}`)
}
await writeFile(new URL('after.json',backupDir),JSON.stringify({transactionId:result.transactionId,documents:after.filter(d=>draftIds.includes(d._id))},null,2),{flag:'wx',mode:0o600})
await writeFile(new URL('verification.json',backupDir),JSON.stringify({...plan,transactionId:result.transactionId,untouchedDocuments:untouched.map(d=>({_id:d._id,sha256:hash(d)})),verifiedAt:new Date().toISOString()},null,2),{flag:'wx',mode:0o600})
console.log(JSON.stringify({...plan,mode:'applied',backup:new URL('before.json',backupDir).pathname,publishedUnchanged:true,unrelatedDocumentsUnchanged:true},null,2))
}
main().catch(error=>{console.error(JSON.stringify({message:error.message,status:error.statusCode||null}));process.exitCode=1})
