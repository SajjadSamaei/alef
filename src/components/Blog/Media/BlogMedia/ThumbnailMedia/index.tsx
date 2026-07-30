import type { BlogMedia as MediaType } from "@/src/payload-types";
import { cn } from "@/utils/cn";
import { cssVariables } from "@/payload/cssVariables";
import { getMediaUrl } from "@/payload/utilities/getMediaUrl";
import clsx from "clsx";
import type { StaticImageData } from "next/image";
import NextImage from "next/image";
import React from "react";
import type { Props as MediaProps } from "../types";

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
    } = resource as MediaType & {
      sizes?: {
        thumbnail?: { url?: string | null } | null;
        square?: { url?: string | null } | null;
        // You can add other sizes here if needed
      } | null;
    };

    width = fullWidth!;
    height = fullHeight!;
    alt = altFromResource || "";
    cacheTag = updatedAt; // Assign cacheTag here
    src = getMediaUrl(resourceSizes?.square?.url || url, cacheTag);

    // Define sources INSIDE this narrowed block
    sources = [
      {
        media: `(max-width: ${breakpoints.md}px)`,
        srcSet: resourceSizes?.thumbnail?.url,
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
    </picture>
  );
};
