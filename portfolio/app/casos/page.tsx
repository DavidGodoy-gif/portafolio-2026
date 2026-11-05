import {client} from "@/lib/sanity";
import {getContentContext} from "@/lib/cms";
export const metadata={title:"Trabajos — David Godoy · Senior Product Designer",openGraph:{title:"Trabajos — David Godoy · Senior Product Designer"},twitter:{title:"Trabajos — David Godoy · Senior Product Designer"}};
import CaseCard from "@/components/CaseCard";

export const dynamic = "force-dynamic";

type CaseSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  thumbnail?: {alt?: string; asset?: unknown};
};

async function getCasos() {
  const {reader}=await getContentContext();
  return (reader || client).fetch<CaseSummary[]>(`
    *[_type == "case" && defined(slug.current)]
    | order(coalesce(order, 2147483647) asc, slug.current asc, _id asc) {
      _id,
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
    <main className="portfolio-home work-catalog">
      <h1 className="sr-only">Todos los trabajos</h1>

      <div className="home-projects">
        {casos.map((caso) => (
          <CaseCard
            presentation="home"
            key={caso._id}
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
