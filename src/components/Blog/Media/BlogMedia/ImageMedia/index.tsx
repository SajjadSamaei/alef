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
    src = getMediaUrl(url, cacheTag);

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

  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(", ");

  const placeholder = blurDataURL ? "blur" : "empty";

  return (
    <picture className={cn("block h-full w-full", pictureClassName)}>
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
        className={clsx(
          "h-full w-full overflow-hidden object-cover",
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
