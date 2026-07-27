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
      "process": process[]{
        ...,
        _type == "image" => {
          ...,
          asset->{
            ...,
            metadata { dimensions }
          }
        },
        _type == "pdfBlock" => {
          ...,
          file {
            ...,
            asset->{
              url,
              originalFilename,
              mimeType,
              size
            }
          }
        }
      }
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
      <main className="mx-auto w-full max-w-[1200px] px-6 py-12 md:px-8 md:py-32">
        <div className="w-full text-left">
          <h1 className="text-3xl font-bold">Caso no encontrado</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 py-12 md:px-8 md:py-32">
      <div className="w-full text-left">
        <section className={`case-detail-hero${imageUrl ? "" : " case-detail-hero-without-media"}`}>
          <div className="case-detail-hero-copy">
            <h1 className="text-gradient-magenta-cyan">{caso.title}</h1>
            <p>{caso.problem}</p>
          </div>

          {imageUrl && (
            <div className="case-detail-hero-media fade-in-up">
              <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 100vw, 50vw"
                priority
              />
            </div>
          )}
        </section>

        {caso.process && (
          <section className="mt-16">
            <h2 className="text-2xl mb-4 font-bold">Proceso</h2>
            <div className="case-title"></div>

            <div>
              <CasePortableContent value={caso.process} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
