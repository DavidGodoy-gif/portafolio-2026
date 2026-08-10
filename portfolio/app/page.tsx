import CaseCard from '@/components/CaseCard'
import Image from 'next/image'
import Link from 'next/link'
import { SkillsSection } from '@/components/SkillsSection'
import { client, urlFor } from '@/lib/sanity'
import type { SkillCategory } from '@/types/skill'


export const dynamic = "force-dynamic";

async function getFeaturedCases() {
  return client.fetch(`
    *[_type == "case"] | order(_updatedAt desc)[0...3] {
      title,
      "slug": slug.current,
      excerpt,
      thumbnail
    }
  `)
}

const SKILLS_QUERY = `
  *[_type == "skillCategory" && active == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    order,
    icon,
    skills,
    tools,
    experienceLevel
  }
`

const HOME_ABOUT_QUERY = `
  *[_type == "sobreMi"][0] {
    title,
    "image": content[_type == "image"][0] {
      asset,
      alt
    }
  }
`

type HomeAbout = {
  title?: string
  image?: {
    asset?: unknown
    alt?: string
  }
}

type FeaturedCase = {
  title: string
  slug: string
  excerpt?: string
  thumbnail?: {
    alt?: string
    asset?: unknown
  }
}

async function getSkillCategories(): Promise<SkillCategory[]> {
  return client.fetch(SKILLS_QUERY)
}

async function getHomeAbout(): Promise<HomeAbout | null> {
  return client.fetch(HOME_ABOUT_QUERY)
}

export default async function Home() {
  const [casos, skillCategories, about] = await Promise.all([
    getFeaturedCases(),
    getSkillCategories(),
    getHomeAbout(),
  ])
  const aboutImageUrl = about?.image?.asset
    ? urlFor(about.image).width(180).height(180).fit('crop').url()
    : null

  return (
    <main className="px-8 py-8 md:px-24 md:py-32 max-w-[1200px] mx-auto">
      <h1 className="text-8xl font-bold text-center text-gradient-magenta-cyan fade-in-up">
        David Godoy
      </h1>
      
      <p className="mt-6 text-center">
        UX Engineer — Research ► Design ► Frontend
      </p>

      <section className="mt-24">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold titlecase">Productos destacados</h2>

        <Link
          href="/casos"
          className="text-center"
        >
          Ver todos <span className="hidden md:inline">→</span>
        </Link>
      </div>

        <div className="grid gap-8 md:grid-cols-3 xl:grid-cols-3">
          {casos.map((caso: FeaturedCase) => (
            <CaseCard
              key={caso.slug}
              title={caso.title}
              slug={caso.slug}
              excerpt={caso.excerpt}
              thumbnail={caso.thumbnail}
            />
          ))}
        </div>
      </section>

      <SkillsSection categories={skillCategories} />

      <section className="home-about mt-6" aria-labelledby="home-about-title">
        {aboutImageUrl ? (
          <Image
            src={aboutImageUrl}
            alt={about?.image?.alt || ''}
            width={88}
            height={88}
            className="home-about-image"
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <h2 id="home-about-title" className="home-about-title">
            Sobre mí
          </h2>
          <p className="home-about-copy">
            Diseñador de productos digitales con mentalidad analítica. Combino
            investigación, diseño y código para crear soluciones que generan
            impacto real en las personas y en el negocio.
          </p>
        </div>

        <Link href="/sobre-mi" className="home-about-link">
          Conoce más sobre mí <span aria-hidden>→</span>
        </Link>
      </section>
    </main>
  )
}
