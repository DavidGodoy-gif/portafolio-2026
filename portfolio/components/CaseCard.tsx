import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

type CaseCardProps = {
  title: string;
  slug: string;
  excerpt?: string;
  thumbnail?: any;
};

export default function CaseCard({
  title,
  slug,
  excerpt,
  thumbnail,
}: CaseCardProps) {
  const imageUrl = thumbnail ? urlFor(thumbnail).width(800).height(500).fit("crop").url() : null;
  const alt = thumbnail?.alt || title;

  return (
    <Link
      href={`/casos/${slug}`}
      className="case-card group alink"
    >
      <div className="case-card-media">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : (
          <Image
            src="/figma-case-card.png"
            alt=""
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="case-card-summary">
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
