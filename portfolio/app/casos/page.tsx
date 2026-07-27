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
    <main className="mx-auto w-full max-w-[1200px] px-6 py-24 md:px-8">
      <h1 className="text-6xl font-bold mb-12 text-gradient-magenta-cyan">Productos</h1>
      <div className="case-title mb-8"></div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
