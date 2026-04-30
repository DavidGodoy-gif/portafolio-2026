"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { urlFor } from "@/lib/sanity";

type PortableImageProps = {
  value: any;
  index?: number;
};

export default function PortableImage({ value, index = 0 }: PortableImageProps) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const isInView = useInView(imageRef, { amount: 0.1 });

  const dims = value?.asset?.metadata?.dimensions;
  const intrinsicW = dims?.width ?? 1200;
  const intrinsicH = dims?.height ?? Math.round((intrinsicW * 2) / 3);

  const maxDesktopW = 1200;
  const maxDesktopH = 800;
  const desktopScale = Math.min(1, maxDesktopW / intrinsicW, maxDesktopH / intrinsicH);
  const desktopW = Math.round(intrinsicW * desktopScale);
  const desktopH = Math.round(intrinsicH * desktopScale);

  const sanityW = Math.min(2400, Math.max(320, intrinsicW * 2));
  const imageUrl = urlFor(value).width(sanityW).fit("max").url();

  const bgVariants = ["bgsoft", "bgsoft-two", "bgsoft-three"];
  const bgClass = bgVariants[index % bgVariants.length];

  return (
    <div
      ref={containerRef}
      className={`${bgClass} w-screen relative left-1/2 right-1/2 mt-4 -translate-x-1/2 overflow-x-visible overflow-y-hidden md:overflow-hidden bgmargin`}
    >
      <div
        className="w-full"
        style={
          {
            ["--desktop-img-w" as string]: `${desktopW}px`,
            ["--desktop-img-h" as string]: `${desktopH}px`,
            ["--intrinsic-w" as string]: `${intrinsicW}px`,
            ["--intrinsic-h" as string]: `${intrinsicH}px`,
          } as CSSProperties
        }
      >
      <figure className="my-8 flex w-full flex-col items-center">
        <div className="w-full min-w-0 overflow-x-auto [-webkit-overflow-scrolling:touch] md:overflow-x-visible">
          <div className="mx-auto flex w-max min-h-0 shrink-0 items-center justify-start md:w-full md:max-w-[1200px] md:justify-center">
            <motion.div
              ref={imageRef}
              initial={{ scale: 0.1 }}
              animate={{ scale: isInView ? 1 : 0.1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ transformOrigin: "center center" }}
            >
              <Image
                src={imageUrl}
                alt={value.alt || ""}
                width={intrinsicW}
                height={intrinsicH}
                sizes={`(max-width: 767px) ${intrinsicW}px, ${desktopW}px`}
                className="h-auto max-w-none shrink-0 object-contain md:max-h-(--desktop-img-h) md:max-w-(--desktop-img-w) max-md:w-(--intrinsic-w)! max-md:min-w-(--intrinsic-w)! max-md:max-w-none!"
              />
            </motion.div>
          </div>
        </div>
        {value.caption && (
          <figcaption className="mt-4 mb-6 px-5 text-sm italic max-w-[1200px] w-full text-center">
            {value.caption}
          </figcaption>
        )}
      </figure>
      </div>
    </div>
  );
}