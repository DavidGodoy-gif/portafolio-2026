'use client'
import Link from 'next/link'
import {useRef, useState} from 'react'
import {usePathname} from 'next/navigation'
const links = [{href:'/#trabajo',label:'Trabajo'},{href:'/sobre-mi',label:'Sobre mí'},{href:'/#contacto',label:'Contacto'}]
export function HeaderNav() {
  const [open,setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const path = usePathname()
  const href = (value: string) => path === '/' && value.startsWith('/#') ? value.slice(1) : value
  return <div className="header-navigation" onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);button.current?.focus()}}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false)}}>
    <nav className="hidden md:flex items-center gap-8" aria-label="Principal">{links.map(l=><Link key={l.href} href={href(l.href)}>{l.label}</Link>)}</nav>
    <button ref={button} type="button" className="md:hidden inline-flex h-11 w-11 items-center justify-center text-zinc-100" aria-label={open?'Cerrar menú':'Abrir menú'} aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(!open)}><svg width="28" height="28" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" aria-hidden="true"><path d={open?'M5 5l14 14M5 19L19 5':'M3 6h18M3 12h18M3 18h18'} /></svg></button>
    {open && <nav id="mobile-menu" className="mobile-navigation md:hidden" aria-label="Principal móvil">{links.map(l=><Link key={l.href} href={href(l.href)} onClick={()=>setOpen(false)}>{l.label}</Link>)}</nav>}
  </div>
}
