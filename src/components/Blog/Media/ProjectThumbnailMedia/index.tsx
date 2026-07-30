import type { ProjectMedia as MediaType } from "@/src/payload-types"; // Update to ProjectMedia if that's your type, or keep generic
import { cn } from "@/utils/cn";
import { cssVariables } from "@/payload/cssVariables";
import { getMediaUrl } from "@/payload/utilities/getMediaUrl";
import clsx from "clsx";
import type { StaticImageData } from "next/image";
import NextImage from "next/image";
import React from "react";
import type { Props as MediaProps } from "../BlogMedia/types";

const { breakpoints } = cssVariables;

export const ThumbnailMedia: React.FC<MediaProps> = (props) => {
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
  let sources: Array<{ media: string; srcSet?: string | null }> = [];

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

    width = fullWidth!;
    height = fullHeight!;
    alt = altFromResource || "";
    cacheTag = updatedAt;

    // --- 1. SPECIAL LOGIC FOR PROJECT CARDS ---
    if (sizeFromProps === "project-card") {
      // Default (Mobile/Tablet): Use 'large' or 'medium' (Landscape aspect)
      // We use 'large' to ensure it looks crisp on high-res tablets
      src = getMediaUrl(resourceSizes?.large?.url || url, cacheTag);

      sources = [
        {
          // Desktop (XL and up): Use 'card' (Portrait 768x1024)
          // This matches your XL layout where image becomes vertical
          media: `(min-width: ${breakpoints.xl}px)`,
          srcSet: resourceSizes?.card?.url,
        },
      ];
    }
    // --- 2. STANDARD LOGIC (For blog posts, etc.) ---
    else {
      src = getMediaUrl(resourceSizes?.square?.url || url, cacheTag);
      sources = [
        {
          media: `(max-width: ${breakpoints.md}px)`,
          srcSet: resourceSizes?.thumbnail?.url,
        },
      ];
    }
  }

  // Define sizes string for lazy loading logic
  const sizes =
    sizeFromProps === "project-card"
      ? `(min-width: ${breakpoints.xl}px) 30vw, 100vw` // Desktop: 1/3 screen, Mobile: Full width
      : sizeFromProps
        ? sizeFromProps
        : Object.entries(breakpoints)
            .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
            .join(", ");

  const placeholder = blurDataURL ? "blur" : "empty";

  return (
    <picture className={cn(pictureClassName)}>
      {sources.map(
        (source, i) =>
          source.srcSet && (
            <source
              key={i}
              media={source.media}
              srcSet={getMediaUrl(source.srcSet, cacheTag)}
            />
          ),
      )}
      <NextImage
        alt={alt || ""}
        className={clsx("overflow-hidden object-cover", cn(imgClassName))}
        src={src}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
    </picture>
  );
};
