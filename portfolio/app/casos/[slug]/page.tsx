import { client } from "@/lib/sanity";
import PortableImage from "@/components/PortableImage";
import PortableChart from "@/components/PortableChart";
import CasePortableContent from "@/components/CasePortableContent";

export const dynamic = "force-dynamic";

async function getCaso(slug: string) {
  return client.fetch(
    `*[_type == "case" && slug.current == $slug][0]{
      title,
      problem,
      process
    }`,
    { slug }
  );
}

export default async function Caso({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caso = await getCaso(slug);

  if (!caso) {
    return (
      <main className="px-16 py-24">
        <h1 className="text-3xl font-bold">Caso no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="px-16 py-24">
      <h1 className="text-4xl font-bold">{caso.title}</h1>

      <p className="mt-6 text-neutral-500 max-w-3xl">{caso.problem}</p>

      {caso.process && (
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4">Proceso</h2>

          <div className="text-neutral-500">
            <CasePortableContent value={caso.process} />
          </div>
        </section>
      )}
    </main>
  );
}