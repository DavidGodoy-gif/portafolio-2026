import assert from 'node:assert/strict'
import {readFileSync, existsSync} from 'node:fs'
import {createRequire} from 'node:module'
import {resolve, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import ts from 'typescript'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

// Render the real components with isolated CMS fixtures; never mutate Sanity.
const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL('../', import.meta.url))
const cache = new Map()
let calls = 0, currentImage
const nativeImage = ({fill, priority, ...props}) => React.createElement('img', props)
function load(file) {
  if (cache.has(file)) return cache.get(file).exports
  const module = {exports:{}}
  cache.set(file,module)
  const source = ts.transpileModule(readFileSync(file,'utf8'), {compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText
  new Function('require','module','exports',source)(name => {
    if (name === 'server-only' || name.endsWith('.css') || name.includes('trust-system-ca')) return {}
    if (name === 'next/image') return nativeImage
    if (name === 'next/link') return ({children,...props}) => React.createElement('a',props,children)
    if (name === 'next/navigation') return {notFound(){throw Error('Unexpected notFound')}}
    if (/SkillsSection|Portable(?:Chart|Code|Pdf|Embed|Table)$/.test(name)) return {default:()=>null,SkillsSection:()=>null}
    if (name === '@/lib/sanity') {
      const real = load(resolve(root,'lib/sanity.ts'))
      return {...real,urlFor(image){calls++; return real.urlFor(image)},client:{fetch:async query => {
        if (query.includes('skillCategory')) return []
        if (query.includes('sobreMi')) return {title:'Biography',image:currentImage,content:[{_type:'image',_key:'photo',...currentImage}]}
        const doc = {_id:'case',title:'Case title',slug:'fixture',thumbnail:currentImage,process:[{_type:'image',_key:'photo',...currentImage},{_type:'block',_key:'copy',style:'normal',children:[{_type:'span',_key:'text',text:'Editorial content',marks:[]}]}]}
        return query.includes('slug.current == $slug') ? doc : [doc]
      }}}
    }
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base = name.startsWith('@/') ? resolve(root,name.slice(2)) : resolve(dirname(file),name)
      const path = [base,base+'.tsx',base+'.ts'].find(p=>existsSync(p))
      if (path) return load(path)
    }
    return require(name)
  },module,module.exports)
  return module.exports
}
const component = name => load(resolve(root,`components/${name}.tsx`)).default
const render = (Component,props) => renderToStaticMarkup(React.createElement(Component,props))
const valid = {alt:'Image',asset:{_ref:'image-abc123-1200x800-png'}}
const expanded = {alt:'Image',asset:{_id:'image-def456-1200x800-jpg',metadata:{dimensions:{width:1200,height:800}}}}
const fixtures = [undefined,{alt:'Only text'},{asset:null},{asset:{}},{asset:{_ref:'broken'}},valid,expanded]
const {hasImageAsset} = load(resolve(root,'lib/sanity-image.ts'))
for (const image of fixtures) {
  currentImage=image
  const expected = image === valid || image === expanded
  assert.equal(hasImageAsset(image),expected)
  for (const [name,props] of [
    ['HomeView',{content:{headline:'Home title',projects:[{_key:'p',title:'Case title',slug:'fixture',image,thumbnail:image}],steps:[],aboutTitle:'Biography',portrait:image}}],
    ['CaseCard',{title:'Case title',slug:'fixture',thumbnail:image}],
    ['AboutPreview',{content:{headline:'Biography',portrait:image,projects:[],criteria:[],contributions:[]}}],
    ['PortableImage',{value:image}],
    ['CasePortableContent',{layout:'article',value:[{_key:'photo',_type:'image',...image}]}],
    ['CasePortableContent',{value:[{_key:'photo',_type:'image',...image}]}],
  ]) {
    calls=0
    const html=render(component(name),props)
    assert.equal(calls>0,expected,`${name}: URL generation`)
    assert.equal(html.includes('<img'),expected,`${name}: optional image`)
    assert.ok(!html.includes('figma-case-card.png'))
    if (name==='CaseCard' || name==='HomeView') assert.ok(html.includes('Case title') && html.includes('/casos/fixture'))
  }
  for (const file of ['components/LegacyHome.tsx','components/PublishedAbout.tsx','app/casos/[slug]/page.tsx']) {
    calls=0
    const element=await load(resolve(root,file)).default({params:Promise.resolve({slug:'fixture'})})
    const html=renderToStaticMarkup(element)
    assert.equal(calls>0,expected,`${file}: URL generation`)
    assert.equal(html.includes('<img'),expected,`${file}: optional image`)
    assert.ok(html.includes(file.includes('PublishedAbout')?'Biography':'Case title'))
  }
}
// Invalid custom images must not mask a valid case thumbnail; valid custom image wins.
for(const image of fixtures) {
  const html=render(component('HomeView'),{content:{headline:'Home',projects:[{_key:'p',title:'Case title',slug:'fixture',image,thumbnail:valid}],steps:[]}})
  assert.ok(html.includes(hasImageAsset(image) && image===expanded?'def456-1200x800':'abc123-1200x800'))
}
console.log('Passed: 7 image states across Home, cards, portraits, legacy views, case cover and both Portable Text layouts; valid thumbnail fallback, preserved copy/links, no old asset fallback.')
