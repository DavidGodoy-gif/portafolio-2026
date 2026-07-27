"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { urlFor } from "@/lib/sanity";

type PortableImageProps = {
  value: any;
  index?: number;
};

export default function PortableImage({ value }: PortableImageProps) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isInView = useInView(imageRef, { amount: 0.1 });

  const dims = value?.asset?.metadata?.dimensions;
  const intrinsicW = dims?.width ?? 1200;
  const intrinsicH = dims?.height ?? Math.round((intrinsicW * 2) / 3);

  const maxDesktopW = 900;
  const maxDesktopH = 500;
  const desktopScale = Math.min(1, maxDesktopW / intrinsicW, maxDesktopH / intrinsicH);
  const desktopW = Math.round(intrinsicW * desktopScale);
  const desktopH = Math.round(intrinsicH * desktopScale);

  const sanityW = Math.min(2400, Math.max(320, intrinsicW * 2));
  const imageUrl = urlFor(value).width(sanityW).fit("max").url();

  const hiddenScale = isMobile ? 0.5 : 0.1;

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;

    const scroller = scrollRef.current;
    const centerImage = () => {
      scroller.scrollLeft = Math.max(0, (scroller.scrollWidth - scroller.clientWidth) / 2);
    };

    centerImage();
    window.addEventListener("resize", centerImage);

    return () => {
      window.removeEventListener("resize", centerImage);
    };
  }, [isMobile, intrinsicW, intrinsicH]);

  return (
    <div
      ref={containerRef}
      className="portable-image-card relative mt-0 w-full overflow-hidden rounded-[14px] bg-[#18181b] bgmargin"
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
      <figure className="my-0 flex h-full w-full flex-col items-stretch">
        <div ref={scrollRef} className="w-full min-w-0 overflow-hidden bg-white">
          <div className="mx-auto flex min-h-0 w-full items-center justify-center">
            <motion.div
              ref={imageRef}
              className="w-full"
              initial={{ scale: hiddenScale }}
              animate={{ scale: isInView ? 1 : hiddenScale }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ transformOrigin: "center center" }}
            >
              <Image
                src={imageUrl}
                alt={value.alt || ""}
                width={intrinsicW}
                height={intrinsicH}
                sizes={`(max-width: 767px) ${intrinsicW}px, ${desktopW}px`}
                className="h-auto w-full max-w-full object-contain"
              />
            </motion.div>
          </div>
        </div>
        {value.caption && (
          <figcaption className="m-0 flex min-h-12 w-full items-center justify-center bg-[#18181b] px-5 py-3 text-center text-xs font-normal not-italic text-white">
            {value.caption}
          </figcaption>
        )}
      </figure>
      </div>
    </div>
  );
}
