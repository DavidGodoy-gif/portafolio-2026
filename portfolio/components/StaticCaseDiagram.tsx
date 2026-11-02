"use client";
import {useEffect,useId,useRef,useState} from 'react';
import mermaid from 'mermaid';
import styles from './StaticCaseDiagram.module.css';
export default function StaticCaseDiagram({value}:{value:{code?:string;title?:string;description?:string}}){
 const host=useRef<HTMLDivElement>(null);const id=useId().replace(/[^a-zA-Z0-9]/g,'');const [failed,setFailed]=useState(false);
 useEffect(()=>{let cancelled=false;
 async function render(){await document.fonts.ready;await mermaid.parse(value.code||'');const {svg}=await mermaid.render('static-'+id,value.code||'');if(cancelled||!host.current)return;host.current.innerHTML=svg;const node=host.current.querySelector('svg');if(node){node.removeAttribute('height');node.style.width='100%';node.style.maxWidth='100%';node.style.height='auto';node.setAttribute('aria-hidden','true');}}
 render().catch(()=>{if(!cancelled)setFailed(true);});return()=>{cancelled=true;};
 },[value.code,id]);
 return <figure className={styles.diagram} aria-label={value.title||'Esquema conceptual'}>{value.title&&<div className={styles.title}>{value.title}</div>}<div ref={host} className={styles.host} aria-hidden="true"/>{failed&&<p>Consulta la descripción del esquema.</p>}{value.description&&<figcaption>{value.description}</figcaption>}</figure>;
}
