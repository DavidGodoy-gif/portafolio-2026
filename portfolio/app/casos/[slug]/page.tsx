import MetricsChart from '@/components/MetricsChart'
import { client } from "@/lib/sanity";

async function getCaso(slug: string) {
  return client.fetch(
    `*[_type == "case" && slug.current == $slug][0]{
      title,
      problem,
      process,
      metrics
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

  return (
    <main className="px-16 py-24">
      <h1 className="text-4xl font-bold">
        {caso?.title}
      </h1>

      <p className="mt-6 text-neutral-400">
        {caso?.problem}
      </p>
      {caso?.process && (
      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4">Proceso</h2>

        {caso.process.map((block: any, i: number) => (
          <p key={i} className="mb-4 text-neutral-400">
            {block.children?.[0]?.text}
          </p>
        ))}
      </section>
    )}
    {caso?.metrics && (
      <MetricsChart data={caso.metrics} />
    )}
    </main>
  );
}
