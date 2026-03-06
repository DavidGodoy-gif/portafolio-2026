import Image from "next/image";
import { urlFor } from "@/lib/sanity";

export default function PortableImage({ value }: any) {
  const imageUrl = urlFor(value).width(1200).fit("max").url();

  return (
    <figure className="my-16 -mx-16">
      <Image
        src={imageUrl}
        alt={value.alt || ""}
        width={1200}
        height={800}
        className="w-full rounded-xl border border-neutral-800"
      />
      {value.caption && (
        <figcaption className="mt-3 text-sm text-neutral-500">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}