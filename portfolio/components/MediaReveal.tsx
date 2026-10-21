'use client'

import {useEffect,useRef,type ReactNode} from 'react'

/** Progressive enhancement: visible HTML first, finite entry animations without retained styles. */
export default function MediaReveal({children,kind='image',className}: {children:ReactNode;kind?:'image'|'chart';className?:string}) {
  const ref=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const element=ref.current
    if(!element)return
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)')
    let played=false,visible=false
    const animations:Animation[]=[]
    const cancel=()=>animations.forEach(animation=>animation.cancel())
    const play=()=>{
      if(played||!visible||preference.matches||typeof element.animate!=='function')return
      const bars=kind==='chart'?element.querySelector<SVGElement>('.recharts-bar-rectangles'):null
      if(kind==='chart'&&!bars)return
      const image=element.querySelector('img')
      if(image&&(!image.complete||image.naturalWidth===0))return
      played=true
      try {
        animations.push(element.animate([
          {opacity:0.2,transform:kind==='chart'?'translateY(40px)':'scale(0.94)'},
          {opacity:1,transform:kind==='chart'?'translateY(0)':'scale(1)'},
        ],{duration:kind==='chart'?600:300,easing:'ease-out'}))
        if(bars){
          bars.style.transformBox='fill-box'
          bars.style.transformOrigin='center bottom'
          animations.push(bars.animate([{transform:'scaleY(0.01)'},{transform:'scaleY(1)'}],{duration:1000,easing:'cubic-bezier(0.22,1,0.36,1)'}))
        }
      } catch {
        cancel() // No opacity, transform or zero-value state remains after a failure.
      }
    }
    if(!('IntersectionObserver' in window))return
    const observer=new IntersectionObserver(entries=>{
      visible=entries.some(entry=>entry.isIntersecting)
      play()
    },{threshold:0.1})
    observer.observe(element)
    // Recharts creates its SVG after measuring; images can finish loading after entry.
    const mutation=new MutationObserver(play)
    mutation.observe(element,{childList:true,subtree:true})
    element.addEventListener('load',play,true)
    const updatePreference=()=>{if(preference.matches)cancel();else play()}
    preference.addEventListener('change',updatePreference)
    return ()=>{
      observer.disconnect()
      mutation.disconnect()
      element.removeEventListener('load',play,true)
      preference.removeEventListener('change',updatePreference)
      cancel()
    }
  },[kind])
  return <div ref={ref} className={className} data-media-reveal={kind}>{children}</div>
}
