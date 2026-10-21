"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from 'next/image';
import MediaReveal from './MediaReveal';
import {urlFor} from '@/lib/sanity';
import {caseBlocks, headingId} from '@/lib/case-content';
import PortableImage from "@/components/PortableImage";
import PortableChart from "@/components/PortableChart";
import PortableTable from "@/components/PortableTable";
import PortableEmbed from "@/components/PortableEmbed";
import PortableCode from "@/components/PortableCode";
import PortablePdf from "@/components/PortablePdf";

const styles = {
  h2: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
  },
  h3: {
    fontSize: "0.875rem",
    fontWeight: "bold",
    marginTop: "0.9rem",
    marginBottom: "0.35rem",
  },
  ul: {
    listStyleType: "disc",
    marginLeft: "1.1rem",
    marginBottom: "0",
  },
  li: {
    marginBottom: "0.2rem",
  },
};

const components = {
  block: {
    h2: (props: any) => <h2 style={styles.h2}>{props.children}</h2>,
    h3: (props: any) => <h3 style={styles.h3}>{props.children}</h3>,
  },
  list: {
    bullet: (props: any) => <ul style={styles.ul}>{props.children}</ul>,
    number: (props: any) => <ol style={styles.ul}>{props.children}</ol>,
  },
  listItem: {
    bullet: (props: any) => <li style={styles.li}>{props.children}</li>,
    number: (props: any) => <li style={styles.li}>{props.children}</li>,
  },
  types: {
    image: PortableImage,
    chartBlock: PortableChart,
    tableBlock: PortableTable,
    embedBlock: PortableEmbed,
    codeBlock: PortableCode,
    pdfBlock: PortablePdf,
  },
};

const MEDIA_TYPES = new Set([
  "image",
  "chartBlock",
  "tableBlock",
  "embedBlock",
  "codeBlock",
  "pdfBlock",
]);

type PortableBlock = {
  _key?: string;
  _type: string;
  [key: string]: unknown;
};

type ContentGroup = {
  kind: "text" | "media";
  blocks: PortableBlock[];
};

function groupContent(blocks: PortableBlock[]): ContentGroup[] {
  return blocks.reduce<ContentGroup[]>((groups, block) => {
    const kind: ContentGroup["kind"] = MEDIA_TYPES.has(block?._type || "")
      ? "media"
      : "text";
    const previous = groups.at(-1);

    if (previous?.kind === kind) {
      previous.blocks.push(block);
    } else {
      groups.push({ kind, blocks: [block] });
    }

    return groups;
  }, []);
}

const articleComponents: PortableTextComponents = {
  ...components,
  block: Object.fromEntries(['h1','h2','h3','h4','h5','h6'].map(style => [style, ({value,children}) => {
    const Tag = (style === 'h1' ? 'h2' : style) as 'h2'|'h3'|'h4'|'h5'|'h6';
    return <Tag id={headingId(value)}>{children}</Tag>;
  }])),
  list: {
    bullet: ({children}) => <ul>{children}</ul>,
    number: ({children}) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({children}) => <li>{children}</li>,
    number: ({children}) => <li>{children}</li>,
  },
  marks: {
    link: ({value,children}) => <a href={value?.href}>{children}</a>,
  },
  types: {
    ...components.types,
    image: ({value}) => {
      if(!value.asset)return null;
      const dimensions = value.asset.metadata?.dimensions;
      const url = urlFor(value).width(1800).auto('format').url();
      return <figure className="case-image"><a href={url} target="_blank" rel="noreferrer" aria-label={value.alt ? `Ampliar: ${value.alt}` : 'Ampliar imagen del caso'}><MediaReveal><Image src={url} alt={value.alt || ''} width={dimensions?.width || 1200} height={dimensions?.height || 800} sizes="(min-width: 1200px) 920px, 100vw" /></MediaReveal></a>{value.caption && <figcaption>{value.caption}</figcaption>}</figure>;
    },
  },
};

export default function CasePortableContent({ value, layout = 'cards' }: { value: unknown[]; layout?: 'cards'|'article' }) {
  if (!Array.isArray(value) || value.length === 0) return null;

  if (layout === 'article') return <div className="case-prose"><PortableText value={caseBlocks(value)} components={articleComponents} /></div>;

  const blocks = value.filter(
    (block): block is PortableBlock =>
      typeof block === "object" &&
      block !== null &&
      "_type" in block &&
      typeof block._type === "string",
  );
  const groups = groupContent(blocks);

  return (
    <div className="portable-content-layout">
      {groups.map((group, groupIndex) => {
        const key = group.blocks[0]?._key || `${group.kind}-${groupIndex}`;

        if (group.kind === "text") {
          return (
            <section
              key={key}
              className="portable-text-container border border-slate-800"
            >
              <PortableText value={group.blocks} components={components} />
            </section>
          );
        }

        return (
          <div
            key={key}
            className={`portable-media-grid ${group.blocks.length === 1 ? "portable-media-grid-single" : ""}`}
          >
            {group.blocks.map((block, blockIndex) => (
              <div
                key={block._key || `${key}-${blockIndex}`}
                className="portable-media-item"
              >
                <PortableText value={[block]} components={components} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
