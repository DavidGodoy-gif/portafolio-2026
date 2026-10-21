import Image from 'next/image'
import Link from 'next/link'
import {Search, Pencil, Code2} from 'lucide-react'
import {urlFor} from '@/lib/sanity'
import type {AboutContent} from '@/lib/about'
import MediaReveal from './MediaReveal'

export default function AboutPreview({content:c,preview}: {content:AboutContent;preview?:string}) {
  const icons=[Search,Pencil,Code2]
  return <main className="about-preview">
    {preview && <aside className="about-preview-notice" role="status">{preview}</aside>}
    <section className="about-editorial-hero" aria-labelledby="about-hero-title">
      <div className="about-hero-copy">{c.label && <p className="about-label">{c.label}</p>}{c.identity && <p className="about-identity">{c.identity}</p>}
        <h1 id="about-hero-title">{c.headline} <span>{c.headlineAccent}</span></h1>{c.description && <p className="about-lead">{c.description}</p>}
        <div className="about-actions"><Link className="about-button" href="/#trabajo">{c.workLabel} <span aria-hidden>↗</span></Link>{c.cv && c.cvLabel && <a href={c.cv} target="_blank" rel="noreferrer">{c.cvLabel} <span aria-hidden>↗</span></a>}</div>
      </div>
      {c.portrait?.asset && <div className="about-editorial-portrait"><MediaReveal className="h-full w-full"><Image src={urlFor(c.portrait).width(768).height(920).fit('crop').auto('format').url()} alt={c.portrait.alt || ''} width={768} height={920} sizes="(min-width: 1200px) 440px, (min-width: 768px) 40vw, 100vw" priority /></MediaReveal></div>}
    </section>
    {(c.experienceTitle || c.experienceText || c.contributions.length>0) && <section className="about-editorial-section" aria-labelledby="about-experience-title">{c.experienceLabel && <p className="about-label about-margin-label">{c.experienceLabel}</p>}<div className="about-experience-content"><div>{c.experienceTitle && <h2 id="about-experience-title">{c.experienceTitle}</h2>}{c.experienceText && <p>{c.experienceText}</p>}</div>{c.contributions.length>0 && <aside className="about-contributions" aria-label={c.contributionTitle}>{c.contributionTitle && <p className="about-label">{c.contributionTitle}</p>}<ul>{c.contributions.map((text,i)=>{const Icon=icons[i % icons.length];return <li key={text}><Icon aria-hidden size={28} strokeWidth={1.5}/><span>{text}</span></li>})}</ul></aside>}</div></section>}
    {c.projects.length>0 && <section className="about-editorial-section" aria-labelledby="about-projects-title">{c.projectsLabel && <p className="about-label about-margin-label">{c.projectsLabel}</p>}<div>{c.projectsTitle && <h2 id="about-projects-title">{c.projectsTitle}</h2>}<ol className="about-project-rows">{c.projects.map((p,i)=><li key={p._key}><span className="about-project-number" aria-hidden>{String(i+1).padStart(2,'0')}</span><div><p className="about-label">{p.context}</p><h3>{p.title}</h3><p>{p.description}</p></div>{p.slug && <Link href={`/casos/${p.slug}`} aria-label={p.linkLabel}>{c.caseAction} <span aria-hidden>→</span></Link>}</li>)}</ol></div></section>}
    {(c.criteria.length>0) && <section className="about-editorial-section about-criteria-section" aria-labelledby="about-criteria-title">{c.criteriaLabel && <p className="about-label about-margin-label">{c.criteriaLabel}</p>}<div>{c.criteriaTitle && <h2 id="about-criteria-title">{c.criteriaTitle}</h2>}<div className="about-criteria-grid">{c.criteria.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div></section>}
    {(c.differentiatorTitle || c.differentiatorText) && <section className="about-differentiator" aria-labelledby="about-differentiator-title">{c.differentiatorLabel && <p className="about-label">{c.differentiatorLabel}</p>}{c.differentiatorTitle && <h2 id="about-differentiator-title">{c.differentiatorTitle}</h2>}{c.differentiatorText && <p>{c.differentiatorText}</p>}</section>}
    {(c.contactTitle || c.contactText) && <section className="about-editorial-section about-contact-section" aria-labelledby="about-contact-title">{c.contactLabel && <p className="about-label about-margin-label">{c.contactLabel}</p>}<div>{c.contactTitle && <h2 id="about-contact-title">{c.contactTitle}</h2>}{c.contactText && <p>{c.contactText}</p>}<div className="about-actions">{c.email && c.emailLabel && <a className="about-button" href={`mailto:${c.email}`}>{c.emailLabel} <span aria-hidden>↗</span></a>}{c.cv && c.cvLabel && <a className="about-outline" href={c.cv} target="_blank" rel="noreferrer">{c.cvLabel} <span aria-hidden>↗</span></a>}{c.linkedinUrl && c.linkedinLabel && <a className="about-linkedin" href={c.linkedinUrl} target="_blank" rel="noreferrer">{c.linkedinLabel} <span aria-hidden>↗</span></a>}</div></div></section>}
  </main>
}
