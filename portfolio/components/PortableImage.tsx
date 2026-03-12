import Image from "next/image";
import { urlFor } from "@/lib/sanity";

export default function PortableImage({ value }: any) {
  const imageUrl = urlFor(value).width(1200).fit("max").url();

  return (
    <figure className="my-16 w-screen relative left-1/2 right-1/2 -translate-x-1/2 max-h-[300px]">
      <Image
        src={imageUrl}
        alt={value.alt || ""}
        width={1200}
        height={800}
        className="w-full border-neutral-800"
      />
      {value.caption && (
        <figcaption className="m-5 text-sm text-neutral-500">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}