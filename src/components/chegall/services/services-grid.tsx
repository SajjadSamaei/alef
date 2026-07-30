"use client";

import clsx from "clsx";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia"; // ✅ Use ImageMedia
import { ScrollToSection } from "@/components/chegall/scroll-to";
import { useTranslations } from "next-intl";
import type { ServicesPage, Media } from "@/src/payload-types";

// ✅ Helper type for the media prop
type ServiceImage = number | Media | null | undefined;

function GridItem({
  className,
  media,
  title,
  linkTo,
}: {
  className?: string;
  media: ServiceImage;
  title: string;
  linkTo: string;
}) {
  return (
    <div
      className={clsx(
        "group relative w-full overflow-hidden rounded-[32px] border border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-neutral-900",
        className,
      )}
    >
      <div className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105">
        {/* ✅ ImageMedia handles blur/placeholder automatically */}
        <ImageMedia
          resource={media}
          fill
          imgClassName="object-cover"
          size="large" // Request a good quality size
        />
      </div>

      <ScrollToSection to={linkTo} className="absolute inset-0 z-10 block">
        <span className="sr-only">View {title}</span>
      </ScrollToSection>

      <div className="absolute bottom-6 left-6 z-20">
        <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md transition-colors group-hover:bg-white/20 dark:bg-black/30">
          <span className="font-display text-sm font-semibold text-white sm:text-base">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ServicesGrid({ data }: { data: ServicesPage }) {
  const t = useTranslations("ServicesPage.Grid");

  if (!data) return null;

  return (
    <FadeIn className="grid h-[800px] grid-cols-1 gap-4 pb-20 sm:h-[600px] sm:grid-cols-4 sm:grid-rows-2 lg:h-[700px]">
      {/* 1. Architecture */}
      <GridItem
        className="col-span-1 row-span-1 sm:col-span-2 sm:row-span-2"
        media={data.architecture?.image}
        title={data.architecture?.title || t("architecture.title")}
        linkTo="architecture"
      />

      {/* 2. Interior */}
      <GridItem
        className="col-span-1 row-span-1"
        media={data.interior?.image}
        title={data.interior?.title || t("interior.title")}
        linkTo="interior-design"
      />

      {/* 3. Urban Design */}
      <GridItem
        className="col-span-1 row-span-1"
        media={data.urban?.image}
        title={data.urban?.title || t("urban.title")}
        linkTo="urban-design"
      />

      {/* 4. Supervision */}
      <GridItem
        className="col-span-1 row-span-1"
        media={data.supervision?.image}
        title={data.supervision?.title || t("supervision.title")}
        linkTo="supervision"
      />

      {/* 5. Restoration */}
      <GridItem
        className="col-span-1 row-span-1"
        media={data.restoration?.image}
        title={data.restoration?.title || t("restoration.title")}
        linkTo="restoration"
      />
    </FadeIn>
  );
}
