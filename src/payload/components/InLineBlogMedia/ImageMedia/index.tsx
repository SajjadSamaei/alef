"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import type { StaticImageData } from "next/image";
import { getPlaceholderImage } from "@/utils/sharp/placeholderImages"; // Adjust path
import clsx from "clsx";
import { cn } from "@/utils/cn";
import NextImage from "next/image";
import React from "react";

import type { Props as MediaProps } from "../types";

import { cssVariables } from "@/payload/cssVariables";
import { getMediaUrl } from "@/payload/utilities/getMediaUrl";

const { breakpoints } = cssVariables;

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    blurDataURL,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
  } = props;

  let width: number | undefined;
  let height: number | undefined;
  let alt = altFromProps;
  let src: StaticImageData | string = srcFromProps || "";

  if (!src && resource && typeof resource === "object") {
    const {
      alt: altFromResource,
      height: fullHeight,
      url,
      width: fullWidth,
    } = resource;

    width = fullWidth!;
    height = fullHeight!;
    alt = altFromResource || "";

    const cacheTag = resource.updatedAt;

    src = getMediaUrl(url, cacheTag);
  }

  const loading = loadingFromProps || (!priority ? "lazy" : undefined);

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(", ");

  const placeholder = blurDataURL ? "blur" : "empty";

  return (
    <div className={cn(pictureClassName)}>
      <NextImage
        alt={alt || ""}
        className={clsx(
          "overflow-hidden rounded-[40px] object-cover",
          cn(imgClassName),
        )}
        fill={fill}
        height={!fill ? height : undefined}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        priority={priority}
        quality={100}
        loading={loading}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
      />
    </div>
  );
};
