"use client";
import {useEffect,useId,useRef,useState} from 'react';
import mermaid from 'mermaid';
import styles from './StaticCaseDiagram.module.css';

// One configuration is used both during measurement and in the final SVG.
let initialized=false;
const typography='font-family:Arial,sans-serif!important;font-size:16px!important;line-height:1.4!important;margin:0!important;padding:0!important;white-space:normal!important;overflow-wrap:normal!important;word-break:normal!important;max-height:none!important;-webkit-line-clamp:unset!important;text-overflow:clip!important;';
function initialize(){
 if(initialized)return;
 mermaid.initialize({startOnLoad:false,securityLevel:'strict',suppressErrorRendering:true,theme:'base',htmlLabels:false,
  themeVariables:{background:'#071B26',primaryColor:'#12394A',primaryTextColor:'#F5F8FC',primaryBorderColor:'#59D8F5',lineColor:'#59D8F5',secondaryColor:'#12394A',tertiaryColor:'#12394A',edgeLabelBackground:'#071B26',fontFamily:'Arial, sans-serif',fontSize:'16px'},
  themeCSS:`text,tspan,.label,.nodeLabel,.edgeLabel,foreignObject div,foreignObject span,foreignObject p{${typography}} .node rect,.node polygon,.node circle{fill:#12394A;stroke:#59D8F5;} .label text,text,tspan{fill:#F5F8FC!important;} .edgeLabel rect{fill:#071B26!important;opacity:1!important;} .flowchart-link{stroke:#59D8F5;} marker path{fill:#59D8F5!important;stroke:#59D8F5!important;}`,
  flowchart:{htmlLabels:false,nodeSpacing:12,rankSpacing:36,padding:10,useMaxWidth:true},
 });initialized=true;
}
function layout(code:string,compact:boolean){
 let source=code.replace(/%%\{init:[\s\S]*?\}%%/g,'');
 if(!compact)return source;
 source=source.replace(/\["([^"]+)"\]/g,(_,label:string)=>{
  const lines:string[]=[];let line='';
  for(const word of label.split(/\s+/)){if(line&&`${line} ${word}`.length>14){lines.push(line);line=word;}else line=line?`${line} ${word}`:word;}
  if(line)lines.push(line);return `["${lines.join('<br/>')}"]`;
 });
 // Invisible constraints change placement while retaining every semantic connection.
 if(source.includes('Explorar una'))source+='\n A ~~~ B';
 if(source.includes('Ingresar'))source+='\n C ~~~ D';
 if(source.includes('Criterios'))source+='\n B ~~~ C\n C ~~~ D';
 if(code.includes('Variable ajustable'))source+='\n B ~~~ C';
 return source;
}
export default function StaticCaseDiagram({value}:{value:{code?:string;title?:string;description?:string}}){
 const host=useRef<HTMLDivElement>(null);const id=useId().replace(/[^a-zA-Z0-9]/g,'');const [failed,setFailed]=useState(false);
 useEffect(()=>{
  let cancelled=false,generation=0;const media=window.matchMedia('(max-width:600px)');
  async function render(){
   const run=++generation;await document.fonts.load('16px Arial');await document.fonts.ready;if(cancelled)return;initialize();
   const {svg}=await mermaid.render(`case-${id}-${run}`,layout(value.code||'',media.matches));
   if(cancelled||run!==generation||!host.current)return;host.current.innerHTML=svg;
   const node=host.current.querySelector('svg');if(node){node.removeAttribute('height');node.removeAttribute('width');node.style.width='100%';node.style.maxWidth='100%';node.style.height='auto';node.setAttribute('aria-hidden','true');}setFailed(false);
  }
  const update=()=>{render().catch(()=>{if(!cancelled)setFailed(true);});};update();media.addEventListener('change',update);
  return()=>{cancelled=true;media.removeEventListener('change',update);};
 },[value.code,id]);
 return <figure data-mermaid-diagram className={styles.diagram} aria-label={value.title||'Esquema conceptual'}>{value.title&&<div className={styles.title}>{value.title}</div>}<div ref={host} className={styles.host} aria-hidden="true"/>{failed&&<p role="alert">Consulta la descripción del esquema.</p>}{value.description&&<figcaption>{value.description}</figcaption>}</figure>;
}
