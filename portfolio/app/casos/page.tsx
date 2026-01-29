import { client } from "@/lib/sanity";
import Link from "next/link";

async function getCasos() {
  return client.fetch(`
    *[_type == "case"]{
      title,
      "slug": slug.current
    }
  `);
}

export default async function Casos() {
  const casos = await getCasos();

  return (
    <main className="px-16 py-24">
      <h1 className="text-4xl font-bold mb-12">Casos</h1>

      <ul className="space-y-6">
        {casos.map((caso: any) => (
          <li key={caso.slug}>
            <Link
              href={`/casos/${caso.slug}`}
              className="text-xl underline"
            >
              {caso.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}