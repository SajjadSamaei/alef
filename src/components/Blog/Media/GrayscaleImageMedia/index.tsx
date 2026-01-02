"use client";

import type { BlogMedia as MediaType } from "@/src/payload-types";
import { cn } from "@/utils/cn";
import { cssVariables } from "@/payload/cssVariables";
import { getMediaUrl } from "@/payload/utilities/getMediaUrl";
import clsx from "clsx";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import type { StaticImageData } from "next/image";
import NextImage from "next/image";
import React, { useRef } from "react";
import type { Props as MediaProps } from "../BlogMedia/types";

const { breakpoints } = cssVariables;
const MotionImage = motion(NextImage);

export const Image: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 35%"],
  });
  const grayscale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0, 1]);
  const filter = useMotionTemplate`grayscale(${grayscale})`;

  // --- REVISED LOGIC ---

  let width: number | undefined;
  let height: number | undefined;
  let alt = altFromProps;
  let src: StaticImageData | string = srcFromProps || "";
  let cacheTag: string | undefined;
  let sources: Array<{ media: string; srcSet?: string | null }> = [];

  // 1. Your original blurDataURL logic is correct.
  // It safely checks for 'placeholder' without relying on the MediaType type.
  const blurDataURL =
    resource && typeof resource === "object" && "placeholder" in resource
      ? (resource.placeholder as string | undefined)
      : undefined;

  // 2. We still need to narrow 'resource' to populate src, sources, etc.
  if (!src && resource && typeof resource === "object") {
    // Inside this block, resource is narrowed to 'MediaType'
    const {
      alt: altFromResource,
      height: fullHeight,
      url,
      width: fullWidth,
      updatedAt, // This is now safe
      sizes: resourceSizes, // This is now safe
    } = resource as MediaType; // Cast to be explicit

    width = fullWidth!;
    height = fullHeight!;
    alt = altFromResource || "";
    cacheTag = updatedAt; // Assign cacheTag here
    src = getMediaUrl(url, cacheTag);

    // Define sources INSIDE this narrowed block
    sources = [
      {
        media: `(max-width: ${breakpoints.sm}px)`,
        srcSet: resourceSizes?.card?.url,
      },
      {
        media: `(max-width: ${breakpoints.md}px)`,
        srcSet: resourceSizes?.square?.url,
      },
      {
        media: `(min-width: ${breakpoints.lg}px)`,
        srcSet: resourceSizes?.og?.url,
      },
    ];
  }

  // 3. These are safe to be outside
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(", ");

  const placeholder = blurDataURL ? "blur" : "empty";

  // --- END REVISED LOGIC ---

  return (
    <picture className={cn(pictureClassName)}>
      {sources.map(
        (source, i) =>
          source.srcSet && (
            <source
              key={i}
              media={source.media}
              // 'cacheTag' is now correctly scoped and available here
              srcSet={getMediaUrl(source.srcSet, cacheTag)}
            />
          ),
      )}
      <div ref={ref} className="group relative">
        <MotionImage
          alt={alt || ""}
          className={clsx(
            "overflow-hidden rounded-[40px] object-cover",
            cn(imgClassName),
          )}
          style={{ filter }}
          src={src}
          width={width}
          height={height}
          fill={fill}
          sizes={sizes}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
        />
        <div
          className="pointer-events-none absolute top-0 left-0 w-full opacity-0 transition duration-300 group-hover:opacity-100"
          aria-hidden="true"
        >
          <NextImage
            alt={alt || ""}
            className={clsx(
              "overflow-hidden rounded-[40px] object-cover",
              cn(imgClassName),
            )}
            src={src}
            width={width}
            height={height}
            fill={fill}
            sizes={sizes}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
          />
        </div>
      </div>
    </picture>
  );
};
