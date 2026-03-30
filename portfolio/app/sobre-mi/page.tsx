import CasePortableContent from "@/components/CasePortableContent";
import { client } from "@/lib/sanity";

export const dynamic = "force-dynamic";

const SOBRE_MI_QUERY = `
  *[_type == "sobreMi"][0]{
    title,
    "content": content[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          ...,
          metadata { dimensions }
        }
      }
    }
  }
`;

const FALLBACK_TITLE = "Sobre mí";

const FALLBACK_PARAGRAPH =
  "UX Developer con experiencia end-to-end: investigación, diseño de experiencia, UI y desarrollo frontend. He liderado procesos completos desde discovery hasta implementación productiva.";

async function getSobreMi() {
  return client.fetch<{
    title?: string | null;
    content?: unknown[] | null;
  }>(SOBRE_MI_QUERY, {}, { next: { revalidate: 60, tags: ["sobreMi"] } });
}

export default async function SobreMi() {
  const data = await getSobreMi();
  const title = data?.title?.trim() || FALLBACK_TITLE;
  const content = data?.content;
  const hasBlocks = Array.isArray(content) && content.length > 0;

  return (
    <main className="px-8 py-8 md:px-24 md:py-32">
      <div className="max-w-[800px] mx-auto text-left">
        <h1 className="text-4xl font-bold text-gradient-magenta-cyan">{title}</h1>

        {hasBlocks ? (
          <section className="mt-16">
            <div className="case-title"></div>
            <div>
              <CasePortableContent value={content} />
            </div>
          </section>
        ) : (
          <p className="mt-6 pt-6 text-neutral-400 leading-relaxed">{FALLBACK_PARAGRAPH}</p>
        )}
      </div>
    </main>
  );
}
