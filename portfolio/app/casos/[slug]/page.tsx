import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import CasePortableContent from "@/components/CasePortableContent";

export const dynamic = "force-dynamic";

async function getCaso(slug: string) {
  return client.fetch(
    `*[_type == "case" && slug.current == $slug][0]{
      title,
      thumbnail,
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
  const imageUrl = caso?.thumbnail
    ? urlFor(caso.thumbnail).fit("crop").url()
    : null;
  const alt = caso?.thumbnail?.alt || caso?.title || "Imagen del caso";

  if (!caso) {
    return (
      <main className="px-8 py-8 md:px-24 md:py-32">
        <div className="max-w-[800px] mx-auto text-left">
          <h1 className="text-3xl font-bold">Caso no encontrado</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="px-8 py-8 md:px-24 md:py-32">
      <div className="max-w-[800px] mx-auto text-left">
        <h1 className="text-4xl font-bold text-gradient-magenta-cyan">
          {caso.title}
        </h1>

        <div className="mt-6 mb-6 flex flex-col md:flex-row md:items-start md:gap-8">
          <p className="text-neutral-500 md:w-1/2">{caso.problem}</p>

          {imageUrl && (
            <div className="md:h-[250px] md:w-[250px] h-[150px] w-[150px] relative overflow-hidden rounded-full md:mt-0 mt-16 mx-auto fade-in-up">
              <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {caso.process && (
          <section className="mt-16">
            <h2 className="text-2xl mb-4 font-bold case-title">Proceso</h2>

            <div className="text-neutral-500">
              <CasePortableContent value={caso.process} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}