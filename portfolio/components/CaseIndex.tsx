'use client'
import {useEffect,useMemo,useState,type MouseEvent} from 'react'
import type {CaseHeading} from '@/lib/case-content'
export default function CaseIndex({headings}: {headings:CaseHeading[]}) {
  const [active,setActive] = useState('')
  const primaryHeadings = useMemo(() => {
    const mainLevel = Math.min(...headings.map(h => h.level))
    return headings.filter(h => h.level === mainLevel)
  }, [headings])
  useEffect(()=>{
    const elements = primaryHeadings.map(h=>document.getElementById(h.id)).filter((e):e is HTMLElement=>!!e)
    const observer = new IntersectionObserver(entries=>{
      const entry = entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0]
      if(entry)setActive(entry.target.id)
    },{rootMargin:'-100px 0px -55% 0px'})
    elements.forEach(e=>observer.observe(e))
    return ()=>observer.disconnect()
  },[primaryHeadings])
  function navigateToHeading(event: MouseEvent<HTMLAnchorElement>, heading: CaseHeading) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const target = document.getElementById(heading.id)
    if (!target) return
    event.preventDefault()
    const details = event.currentTarget.closest('details')
    if (details) details.open = false
    setActive(heading.id)
    // Update the URL without triggering the browser's immediate anchor jump.
    const hash = `#${heading.id}`
    if (window.location.hash !== hash) window.history.pushState(null, '', hash)
    const offset = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 110
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset)
    target.setAttribute('tabindex', '-1')
    target.focus({preventScroll: true})
    window.scrollTo({top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})
  }
  if(!headings.length)return null
  const list = (items: CaseHeading[]) => <ol>{items.map(h=><li key={h.id} className={h.level>2?'case-index-child':undefined}><a href={`#${h.id}`} aria-current={active===h.id?'location':undefined} onClick={e=>navigateToHeading(e,h)}>{h.text}</a></li>)}</ol>
  return <aside className="case-index"><nav className="case-index-desktop" aria-label="Índice del caso"><p>En este caso</p>{list(primaryHeadings)}</nav><details className="case-index-mobile"><summary>En este caso</summary><nav aria-label="Índice del caso">{list(headings)}</nav></details></aside>
}
