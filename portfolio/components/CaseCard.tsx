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
      className="group block overflow-hidden rounded-md transition hover:border-neutral-700 shadow-md"
    >
      {imageUrl && (
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-2xl font-semibold">{title}</h3>
        {excerpt && (
          <p className="mt-3 text-neutral-500 line-clamp-3">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}