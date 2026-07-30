import type { BlogMedia as MediaType } from "@/src/payload-types";
import { cn } from "@/utils/cn";
import { cssVariables } from "@/payload/cssVariables";
import { getMediaUrl } from "@/payload/utilities/getMediaUrl";
import clsx from "clsx";
import type { StaticImageData } from "next/image";
import NextImage from "next/image";
import React from "react";
import type { Props as MediaProps } from "../BlogMedia/types";

const { breakpoints } = cssVariables;

export const ImageMedia: React.FC<MediaProps> = (props) => {
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

  let width: number | undefined;
  let height: number | undefined;
  let alt = altFromProps;
  let src: StaticImageData | string = srcFromProps || "";
  let cacheTag: string | undefined;

  // We don't need the 'sources' array anymore because we only want ONE size.
  // let sources: Array<{ media: string; srcSet?: string | null }> = [];

  const blurDataURL =
    resource && typeof resource === "object" && "placeholder" in resource
      ? (resource.placeholder as string | undefined)
      : undefined;

  if (!src && resource && typeof resource === "object") {
    const {
      alt: altFromResource,
      height: fullHeight,
      url,
      width: fullWidth,
      updatedAt,
      sizes: resourceSizes,
    } = resource as MediaType;

    alt = altFromResource || "";
    cacheTag = updatedAt;

    // 👇 CHANGED LOGIC: STRICTLY USE CARD SIZE
    // Check if the 'card' size exists in the resource
    if (resourceSizes?.card?.url) {
      src = getMediaUrl(resourceSizes.card.url, cacheTag);
      width = resourceSizes.card.width || undefined;
      height = resourceSizes.card.height || undefined;
    } else {
      // Fallback: If no card size exists, use the original uploaded image
      src = getMediaUrl(url, cacheTag);
      width = fullWidth!;
      height = fullHeight!;
    }
  }

  // Generate a standard sizes string for 'fill' mode
  const sizes =
    sizeFromProps && !["card", "square"].includes(sizeFromProps)
      ? sizeFromProps
      : Object.entries(breakpoints)
          .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
          .join(", ");

  const placeholder = blurDataURL ? "blur" : "empty";

  return (
    <picture className={cn(pictureClassName)}>
      {/* ❌ Removed the sources map. 
         This stops the browser from switching images based on screen width. 
      */}

      <NextImage
        alt={alt || ""}
        className={clsx(
          "overflow-hidden rounded-[40px] object-cover",
          cn(imgClassName),
        )}
        src={src}
        // Only pass width/height if NOT using fill
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
    </picture>
  );
};
