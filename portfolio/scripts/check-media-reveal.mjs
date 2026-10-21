import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import ts from 'typescript'
const require=createRequire(import.meta.url)
const compiled=ts.transpileModule(readFileSync(new URL('../components/MediaReveal.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText
function setup({reduced=false,kind='chart',fail=false,loaded=true,observer=true}={}){
 let effect,intersection,load,change,attempts=0,cancelled=0
 const calls=[]
 const bars={style:{},animate:(frames,options)=>{calls.push({target:'bars',frames,options});return{cancel:()=>cancelled++}}}
 const element={querySelector:s=>s==='img'?(kind==='image'?{complete:loaded,naturalWidth:loaded?900:0}:null):bars,animate:(frames,options)=>{attempts++;if(fail)throw Error('failed');calls.push({target:'wrapper',frames,options});return{cancel:()=>cancelled++}},addEventListener:(_,cb)=>load=cb,removeEventListener:()=>{}}
 const preference={matches:reduced,addEventListener:(_,cb)=>change=cb,removeEventListener:()=>{}}
 globalThis.window={matchMedia:()=>preference,...(observer?{IntersectionObserver:true}:{})}
 globalThis.IntersectionObserver=class{constructor(cb){intersection=cb}observe(){}disconnect(){}}
 globalThis.MutationObserver=class{observe(){}disconnect(){}}
 const module={exports:{}}
 new Function('require','module','exports',compiled)(name=>name==='react'?{useRef:()=>({current:element}),useEffect:cb=>effect=cb}:require(name),module,module.exports)
 const html=module.exports.default({children:'content',kind})
 assert.equal(html.props.style,undefined,'base must remain visible')
 const cleanup=effect()
 return {enter:()=>intersection?.([{isIntersecting:true}]),leave:()=>intersection?.([{isIntersecting:false}]),load:()=>{loaded=true;load?.()},reduce:()=>{preference.matches=true;change?.()},calls,get attempts(){return attempts},get cancelled(){return cancelled},cleanup}
}
const chart=setup();chart.enter();assert.equal(chart.calls.length,2);chart.leave();chart.enter();assert.equal(chart.calls.length,2);chart.reduce();assert.equal(chart.cancelled,2);chart.cleanup()
const reduced=setup({reduced:true});reduced.enter();assert.equal(reduced.attempts,0);reduced.cleanup()
const failure=setup({fail:true});assert.doesNotThrow(()=>failure.enter());assert.equal(failure.attempts,1);failure.cleanup()
const image=setup({kind:'image',loaded:false});image.enter();assert.equal(image.calls.length,0);image.load();assert.equal(image.calls.length,1);image.cleanup()
const unsupported=setup({observer:false});assert.equal(unsupported.attempts,0)
console.log('Passed: image/chart entry, once-only playback, late image load, reduced motion, preference changes, animation failure and missing observer fallback.')
