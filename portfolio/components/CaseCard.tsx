import {hasImageAsset} from '@/lib/sanity-image'
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

type CaseCardProps = {
  title: string;
  slug: string;
  excerpt?: string;
  presentation?: 'default' | 'home';
  thumbnail?: {
    alt?: string;
    asset?: unknown;
  };
};

export default function CaseCard({
  title,
  slug,
  excerpt,
  thumbnail,
  presentation = 'default',
}: CaseCardProps) {
  const imageUrl = hasImageAsset(thumbnail) ? urlFor(thumbnail).width(800).height(500).fit("crop").url() : null;
  const alt = thumbnail?.alt || title;

  if (presentation === 'home') return (
    <Link href={`/casos/${slug}`} className="home-project work-project">
      {imageUrl && <div className="project-media"><Image src={imageUrl} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="project-photo" /></div>}
      <div className="project-copy">
        <h2>{title}</h2>
        {excerpt && <p className="project-summary">{excerpt}</p>}
        <span className="work-project-link">Ver caso <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );

  return (
    <Link
      href={`/casos/${slug}`}
      className="case-card group alink"
    >
      <div className="case-card-media">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="case-card-summary" style={{ backgroundColor: "#18181b" }}>
        <h3>{title}</h3>
      </div>

      <div className="case-card-hover" aria-hidden="true">
        <div>
          <h3>{title}</h3>
        {excerpt && (
            <p>
            {excerpt}
          </p>
        )}
        </div>
      </div>
    </Link>
  );
}
