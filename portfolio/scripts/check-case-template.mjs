// Read-only checks against published documents and the existing local server.
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import ts from 'typescript'
import assert from 'node:assert/strict'
const compiled = ts.transpileModule(readFileSync(new URL('../lib/case-content.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
const shared = {exports:{}}
new Function('exports','module',compiled)(shared.exports,shared)
const {caseBlocks,caseOutline}=shared.exports
const fixture=caseBlocks([{_type:'block',style:'h2',children:[{text:'Repetido'}]},{_type:'block',style:'h2',children:[{text:'Repetido'}]},{_type:'block',style:'h1',children:[{text:'Título interno'}]},{_type:'block',children:[{text:''}]},{_type:'image',asset:{_ref:'existing'}},null])
assert.equal(fixture.length,4)
assert.equal(new Set(caseOutline(fixture).map(h=>h.id)).size,3)
assert.equal(caseOutline(fixture)[2].level,2)
assert.deepEqual(caseOutline([]),[])
const client=createClient({projectId:'lia9s4dq',dataset:'production',apiVersion:'2024-01-01',useCdn:false})
const cases=await client.fetch('*[_type=="case" && defined(slug.current)] | order(coalesce(order,2147483647) asc,slug.current asc,_id asc){_id,title,"slug":slug.current,process}')
const results=[]
for(let i=0;i<cases.length;i++){
  const c=cases[i], response=await fetch(`http://127.0.0.1:3000/casos/${c.slug}`)
  assert.equal(response.status,200,c.slug)
  const html=await response.text()
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,c.slug)
  assert.ok(html.includes('class="case-article"'),c.slug)
  const outline=caseOutline(caseBlocks(c.process))
  for(const h of outline) assert.ok(html.includes(`id="${h.id}"`),`${c.slug}: ${h.text}`)
  assert.equal((html.match(/id="seccion-/g)||[]).length,outline.length,c.slug)
  const anchors=html.match(/<a\b[^>]*>/g)||[]
  if(i>0)assert.ok(anchors.some(a=>a.includes(`href="/casos/${cases[i-1].slug}"`)&&a.includes('rel="prev"')),`${c.slug}: previous`)
  if(i<cases.length-1)assert.ok(anchors.some(a=>a.includes(`href="/casos/${cases[i+1].slug}"`)&&a.includes('rel="next"')),`${c.slug}: next`)
  results.push({route:`/casos/${c.slug}`,status:response.status,headings:outline.length,types:[...new Set(c.process?.map(b=>b._type)||[])]})
}
for(const route of ['/','/casos','/sobre-mi']){
  const res=await fetch(`http://127.0.0.1:3000${route}`),html=await res.text()
  assert.equal(res.status,200,route)
  assert.ok(!html.includes('class="case-article"'),`${route}: must retain its own structure`)
}
console.log(JSON.stringify({fixtures:'passed',routes:results,otherPages:'passed'},null,2))
