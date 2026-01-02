import type { BlogMedia as MediaType } from "@/src/payload-types";
import { cn } from "@/utils/cn";
import { cssVariables } from "@/payload/cssVariables";
import { getMediaUrl } from "@/payload/utilities/getMediaUrl";
import clsx from "clsx";
import type { StaticImageData } from "next/image";
import NextImage from "next/image";
import React from "react";
import type { Props as MediaProps } from "../BlogMedia/types";
import { PhotoIcon } from "@heroicons/react/24/outline";

const { breakpoints } = cssVariables;

type ExtendedMediaProps = MediaProps & {
  mobileImageSize?: "card" | "square" | "large" | "thumbnail";
  // ✅ NEW PROP: Explicitly request a specific Payload image size
  imgSize?: "card" | "square" | "large" | "thumbnail" | "og" | "twitter";
};

export const ImageMedia: React.FC<ExtendedMediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    resource,
    // This is the HTML 'sizes' attribute (e.g. "100vw")
    size: sizeFromProps,
    src: srcFromProps,
    mobileImageSize = "card",
    // ✅ Destructure the new prop
    imgSize,
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

    alt = altFromResource || "";
    cacheTag = updatedAt;

    // ✅ LOGIC UPDATE: Check if 'imgSize' prop is passed
    if (imgSize && resourceSizes?.[imgSize]?.url) {
      // 1. Force the specific requested size
      const selectedSize = resourceSizes[imgSize];
      width = selectedSize.width!;
      height = selectedSize.height!;
      src = getMediaUrl(selectedSize.url, cacheTag);

      // 2. Clear sources so the <picture> tag doesn't swap it out
      // (We want to force this specific image everywhere)
      sources = [];
    } else {
      // 3. Fallback to default responsive logic
      width = fullWidth!;
      height = fullHeight!;
      src = getMediaUrl(url, cacheTag);

      sources = [
        {
          media: `(max-width: ${breakpoints.sm}px)`,
          srcSet:
            resourceSizes?.[mobileImageSize]?.url || resourceSizes?.card?.url,
        },
        {
          media: `(max-width: ${breakpoints.md}px)`,
          srcSet: resourceSizes?.square?.url,
        },
        {
          media: `(min-width: ${breakpoints.lg}px)`,
          srcSet: resourceSizes?.large?.url || resourceSizes?.og?.url,
        },
      ];
    }
  }

  // 2. FALLBACK WITH ICON
  if (!src) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800",
          pictureClassName,
          imgClassName,
        )}
        aria-label={alt || "Placeholder image"}
      >
        <PhotoIcon className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
      </div>
    );
  }

  const defaultSizes = `
    (max-width: ${breakpoints.sm}px) 100vw,
    (max-width: ${breakpoints.md}px) 100vw,
    (max-width: ${breakpoints.lg}px) 50vw,
    33vw
  `;
  const sizes = sizeFromProps || defaultSizes;
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
