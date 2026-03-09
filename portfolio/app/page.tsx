import CaseCard from '@/components/CaseCard'
import { client } from '@/lib/sanity'

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

export default async function Home() {
  const casos = await getFeaturedCases()

  return (
    <main className="px-24 py-32 max-w-[1200px] mx-auto">
      <h1 className="text-8xl font-bold text-center text-gradient-magenta-cyan">
        David Godoy
      </h1>

      <p className="mt-6 text-neutral-500 text-center">
        UX Engineer — Research ► Design ► Frontend
      </p>

      <section className="mt-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Casos destacados</h2>

        <a
          href="/casos"
          className="text-neutral-400 hover:text-white transition"
        >
          Ver todos →
        </a>
      </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {casos.map((caso: any) => (
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
    </main>
  )
}