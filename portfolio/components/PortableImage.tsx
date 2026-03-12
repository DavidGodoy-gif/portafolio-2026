"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity";

type PortableImageProps = {
  value: any;
  index?: number;
};

export default function PortableImage({ value, index = 0 }: PortableImageProps) {
  const imageUrl = urlFor(value).width(1200).fit("max").url();

  const bgVariants = ["bgsoft", "bgsoft-two", "bgsoft-three"];
  const bgClass = bgVariants[index % bgVariants.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${bgClass} w-screen relative left-1/2 right-1/2 mt-4 -translate-x-1/2 overflow-hidden`}
    >
      <figure className="my-8 min-h-[300px] flex flex-col items-center">
        <Image
          src={imageUrl}
          alt={value.alt || ""}
          width={1200}
          height={800}
          className="min-h-[300px] max-h-[500px] max-w-[900px]"
        />
        {value.caption && (
          <figcaption className="mt-4 mb-6 px-5 text-sm italic text-neutral-500 max-w-[1200px] w-full text-center">
            {value.caption}
          </figcaption>
        )}
      </figure>
    </motion.div>
  );
}