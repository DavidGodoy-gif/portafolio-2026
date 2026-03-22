import { client } from "@/lib/sanity";
import CaseCard from "@/components/CaseCard";

export const dynamic = "force-dynamic";

async function getCasos() {
  return client.fetch(`
    *[_type == "case"] | order(order asc) | order(_updatedAt desc) {
      title,
      "slug": slug.current,
      excerpt,
      thumbnail
    }
  `);
}

export default async function Casos() {
  const casos = await getCasos();

  return (
    <main className="px-16 py-24 max-w-[1200px] mx-auto">
      <h1 className="text-6xl font-bold mb-12 text-gradient-magenta-cyan">Todos mis casos</h1>
      <div className="case-title mb-8"></div>

      <div className="grid gap-8 md:grid-cols-2">
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
    </main>
  );
}