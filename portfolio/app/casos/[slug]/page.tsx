import Image from "next/image";
import { client, urlFor } from "@/lib/sanity";
import PortableImage from "@/components/PortableImage";
import PortableChart from "@/components/PortableChart";
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
    ? urlFor(caso.thumbnail).width(1200).height(750).fit("crop").url()
    : null;
  const alt = caso?.thumbnail?.alt || caso?.title || "Imagen del caso";

  if (!caso) {
    return (
      <main className="px-16 py-24">
        <h1 className="text-3xl font-bold">Caso no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="px-16 py-24">

      <h1 className="text-4xl font-bold text-gradient-magenta-cyan">{caso.title}</h1>

      <p className="mt-6 mb-6 text-neutral-500 max-w-3xl">{caso.problem}</p>
      {imageUrl && (
        <div className="relative aspect-16/10 overflow-hidden mb-6 rounded-md">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover"
          />
        </div>
      )}

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