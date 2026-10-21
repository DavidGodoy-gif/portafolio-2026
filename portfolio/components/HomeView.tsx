import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import type { HomeContent, HomeImage } from '@/lib/home'

function Picture({image, portrait = false, priority = false}: {image: HomeImage; portrait?: boolean; priority?: boolean}) {
  return <Image src={urlFor(image).width(portrait ? 360 : 1400).auto('format').url()} alt={image.alt || ''} fill sizes={portrait ? '160px' : '(min-width: 1200px) 700px, (min-width: 768px) 55vw, 100vw'} className={portrait ? 'portrait-photo' : 'project-photo'} priority={priority} />
}
export default function HomeView({content: c, preview}: {content: HomeContent; preview?: string}) {
  return <main className="portfolio-home">
    {preview && <aside className="home-preview" role="status">{preview}</aside>}
    <section className="home-hero" aria-labelledby="hero-title">
      {c.identity && <p className="hero-identity">{c.identity}</p>}
      <h1 id="hero-title">{c.headline} <span>{c.headlineAccent}</span></h1>
      {c.description && <p className="hero-description">{c.description}</p>}
      {c.differentiator && <p className="hero-differentiator">{c.differentiator}</p>}
      <div className="home-actions"><a className="home-button" href="#trabajo">{c.primaryLabel} <span aria-hidden>↗</span></a><Link href="/sobre-mi">{c.aboutLabel} <span aria-hidden>→</span></Link></div>
    </section>
    {(c.projects.length>0) && <section id="trabajo" className="home-work" aria-labelledby="work-title">
      <div className="section-intro">{c.workLabel && <p className="home-eyebrow">{c.workLabel}</p>}{c.workTitle && <h2 id="work-title">{c.workTitle}</h2>}{c.workIntro && <p>{c.workIntro}</p>}</div>
      <div className="home-projects">{c.projects.map((p, i) => <article key={p._key} className={`home-project ${i === 0 ? 'featured' : ''}`}>
        <div className="project-media">{(p.image || p.thumbnail) && <Picture image={(p.image || p.thumbnail)!} priority={i === 0} />}</div>
        <div className="project-copy"><p className="project-context">{p.context}</p><h3>{p.title}</h3><p className="project-summary">{p.summary}</p><p className="project-description">{p.description}</p><p className="project-contribution">{p.contribution}</p><Link href={`/casos/${p.slug}`}>{p.linkLabel} <span aria-hidden>→</span></Link></div>
      </article>)}</div>
    </section>}
    {(c.steps.length>0) && <section className="home-process" aria-labelledby="process-title">{c.processLabel && <p className="home-eyebrow">{c.processLabel}</p>}{c.processTitle && <h2 id="process-title">{c.processTitle}</h2>}<div className="home-steps">{c.steps.map((s,i) => <article key={s._key}><h3><span aria-hidden>0{i+1} / </span>{s.title}</h3><p>{s.description}</p></article>)}</div></section>}
    {(c.aboutTitle || c.aboutText || c.portrait) && <section className="home-bio" aria-labelledby="about-title"><div>{c.aboutLabel && <p className="home-eyebrow">{c.aboutLabel}</p>}{c.portrait && <div className="home-portrait"><Picture image={c.portrait} portrait /></div>}</div><div>{c.aboutTitle && <h2 id="about-title">{c.aboutTitle}</h2>}{c.aboutText && <p>{c.aboutText}</p>}<div className="home-actions"><Link href="/sobre-mi">{c.aboutLinkLabel} <span aria-hidden>→</span></Link>{c.cv && c.cvLabel && <a href={c.cv} target="_blank" rel="noreferrer">{c.cvLabel} <span aria-hidden>↗</span></a>}</div></div></section>}
    {(c.contactTitle || c.contactText) && <section className="home-contact" id="contacto" aria-labelledby="contact-title"><div>{c.contactLabel && <p className="home-eyebrow">{c.contactLabel}</p>}{c.contactTitle && <h2 id="contact-title">{c.contactTitle}</h2>}{c.contactText && <p>{c.contactText}</p>}</div><div className="home-actions">{c.email && c.emailLabel && <a className="home-button" href={`mailto:${c.email}`}>{c.emailLabel} <span aria-hidden>↗</span></a>}{c.linkedinUrl && c.linkedinLabel && <a className="home-outline" href={c.linkedinUrl} target="_blank" rel="noreferrer">{c.linkedinLabel} <span aria-hidden>↗</span></a>}{c.cv && c.cvLabel && <a href={c.cv} target="_blank" rel="noreferrer">{c.cvLabel} <span aria-hidden>↗</span></a>}</div></section>}
  </main>
}
