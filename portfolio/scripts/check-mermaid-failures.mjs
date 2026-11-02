import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import ts from 'typescript'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

const require=createRequire(import.meta.url)
const compiled=ts.transpileModule(readFileSync(new URL('../components/PortableCode.tsx',import.meta.url),'utf8'),{
  compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022},
}).outputText+'\nexports.TestDiagram = MermaidDiagram;'

async function check({fontFails=false,renderFails=false}={}) {
  const states=[],effects=[]
  let cursor=0,renderCalls=0,config
  const hooks={
    useState(value){const i=cursor++;if(!(i in states))states[i]=i===0?true:value;return[states[i],v=>states[i]=v]},
    useRef:()=>({current:{}}),useMemo:fn=>fn(),useId:()=>':test:',useEffect:fn=>effects.push(fn),
  }
  globalThis.document={body:{},fonts:{load:async()=>{if(fontFails)throw Error('Font unavailable')},ready:Promise.resolve()}}
  globalThis.requestAnimationFrame=()=>0
  globalThis.ResizeObserver=class {observe(){} disconnect(){}}
  globalThis.getComputedStyle=()=>({getPropertyValue:()=> 'Inter, sans-serif'})
  const mermaid={initialize:c=>config=c,render:async()=>{renderCalls++;if(renderFails)throw Error('Mobile render failure');return {svg:'<svg />'}}}
  const module={exports:{}}
  new Function('require','module','exports',compiled)(name=>{
    if(name==='react')return hooks
    if(name==='mermaid')return{__esModule:true,default:mermaid}
    if(name==='react-zoom-pan-pinch')return{
      TransformWrapper:({children})=>children({zoomIn(){},zoomOut(){}}),
      TransformComponent:({children})=>React.createElement('div',{'data-zoom':'true'},children),
    }
    return require(name)
  },module,module.exports)
  module.exports.TestDiagram({code:'flowchart TD\n A --> B'})
  effects[1]()
  await new Promise(resolve=>setTimeout(resolve,0))
  assert.equal(renderCalls,1,'A failed webfont must still allow Mermaid rendering')
  assert.equal(config.suppressErrorRendering,true)
  cursor=0
  const html=renderToStaticMarkup(module.exports.TestDiagram({code:'flowchart TD\n A --> B'}))
  assert.equal(html.includes('role="alert"'),renderFails)
  if(renderFails){
    assert.ok(html.includes('Mobile render failure'))
    assert.match(html,/<\/div><div role="alert" class="absolute inset-0 overflow-auto p-4">/,
      'The error must sit outside zoom content, in the full-width viewport')
  }
}
const oldWarn=console.warn,oldError=console.error
console.warn=()=>{};console.error=()=>{}
try{await check();await check({fontFails:true});await check({renderFails:true});await check({fontFails:true,renderFails:true})}
finally{console.warn=oldWarn;console.error=oldError}
console.log('Passed: failed font does not block rendering; Mermaid failures remain readable outside zoom; normal rendering and combined failures.')
