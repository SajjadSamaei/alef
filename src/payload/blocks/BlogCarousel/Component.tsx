import React from "react";
import { SlidesCarousel } from "./SlidesCarousel";
import type { ProjectCarouselBlock as CarouselBlockType } from "@/src/payload-types"; // Updated to match your config interface name
import { TypedLocale } from "payload";
import { useLocale } from "next-intl";
import { CaseStudyMedia as MediaType } from "@/src/payload-types"; // Updated to match 'case-study-media' relation

type LocalizedCaption = { en?: string | null; fa?: string | null };

export const CarouselBlockComponent: React.FC<CarouselBlockType> = ({
  images,
  title,
}) => {
  const locale = useLocale() as TypedLocale;

  const slideImages = images
    ?.map((img) => {
      // FIX 1: 'slideImages' is a single object/ID, not an array.
      // We check if it exists directly.
      const imageOrId = img.slideImages;

      if (!imageOrId) {
        return null;
      }

      // FIX 2: Check if it's populated (object) vs unpopulated (string ID)
      if (typeof imageOrId === "string") {
        return null;
      }

      const captionObj = img.caption as LocalizedCaption | undefined;
      const localizedCaption = captionObj?.[locale];

      return {
        image: imageOrId as MediaType,
        caption: localizedCaption || "", // Ensure string is returned
      };
    })
    .filter(
      (item): item is { image: MediaType; caption: string } => item !== null,
    );

  if (!slideImages || slideImages.length === 0) {
    return null;
  }

  return (
    <div>
      {title && <h2>{title}</h2>}
      <SlidesCarousel images={slideImages} />
    </div>
  );
};
