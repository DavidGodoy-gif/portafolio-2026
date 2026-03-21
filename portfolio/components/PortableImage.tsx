"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { urlFor } from "@/lib/sanity";

type PortableImageProps = {
  value: any;
  index?: number;
};

export default function PortableImage({ value, index = 0 }: PortableImageProps) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0.1 1", "0.1 0"],
  });

  const opacity = useTransform(scrollYProgress, [0, 9], [0, 9]);
  const y = useTransform(scrollYProgress, [0, 1], [20, 0]);

  const imageUrl = urlFor(value).width(1600).fit("max").url();

  const dims = value?.asset?.metadata?.dimensions;
  const intrinsicW = dims?.width ?? 1200;
  const intrinsicH = dims?.height ?? Math.round((intrinsicW * 2) / 3);

  const bgVariants = ["bgsoft", "bgsoft-two", "bgsoft-three"];
  const bgClass = bgVariants[index % bgVariants.length];

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={`${bgClass} w-screen relative left-1/2 right-1/2 mt-4 -translate-x-1/2 overflow-hidden bgmargin`}
    >
      <figure className="my-8 flex flex-col items-center">
        <Image
          src={imageUrl}
          alt={value.alt || ""}
          width={intrinsicW}
          height={intrinsicH}
          sizes="(max-width: 800px) 100vw, 800px"
          className="h-auto w-full max-w-[800px] object-contain"
        />
        {value.caption && (
          <figcaption className="mt-4 mb-6 px-5 text-sm italic max-w-[1200px] w-full text-center">
            {value.caption}
          </figcaption>
        )}
      </figure>
    </motion.div>
  );
}