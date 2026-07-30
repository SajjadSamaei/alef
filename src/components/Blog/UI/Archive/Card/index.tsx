"use client";
import React, { Fragment } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { useBreakpoint } from "@/utils/hooks/useBreakpoint";
import useClickableCard from "@/payload/utilities/useClickableCard";
import {
  formatGregorianRelativeDate,
  formatPersianRelativeDate,
} from "@/payload/utilities/formatDateTime";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import type { Post } from "@/src/payload-types";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { ClockIcon } from "@heroicons/react/24/outline";

// Helper type to avoid full Post requirement
export type CardPostData = Pick<
  Post,
  "id" | "slug" | "title" | "heroImage" | "categories" | "publishedAt" | "meta"
>;

export const Card: React.FC<{
  className?: string;
  doc?: CardPostData;
  relationTo?: "blog";
  showCategories?: boolean;
  imageSize?: "card" | "xlarge";
  isHero?: boolean;
}> = (props) => {
  const locale = useLocale();
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    relationTo = "blog",
    showCategories,
    imageSize = "card",
    isHero,
  } = props;

  const breakpoint = useBreakpoint();
  const { slug, categories, title, heroImage, publishedAt, meta } = doc || {};
  const description = meta?.description;
  const localizedTitle = title && locale === "fa" ? digitsEnToFa(title) : title;
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const href = `/${locale}/${relationTo}/${slug}`;
  const hasImage = heroImage && typeof heroImage === "object";

  return (
    <article
      ref={card.ref}
      className={clsx(
        "group relative h-full w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900",
        "border border-white/50 dark:border-white/10",
        // Enhanced hover: lift + stronger shadow
        "transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-neutral-900/20 dark:hover:shadow-black/50",
        // Default rounding is handled by parent, but we add a fallback just in case
        !className?.includes("rounded") && "rounded-[32px]",
        className,
      )}
    >
      <Link
        href={href}
        ref={link.ref}
        className="absolute inset-0 z-30 focus:outline-none"
      >
        <span className="sr-only">{title}</span>
      </Link>

      {/* --- Image Layer --- */}
      <div className="absolute inset-0 h-full w-full">
        {hasImage && (
          <div className="h-full w-full transition-transform duration-700 ease-in-out group-hover:scale-105">
            <ImageMedia
              resource={heroImage}
              // size={imageSize}
              fill
              imgClassName="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Refined Cinematic Gradient:
            - Lighter at top (for depth/highlight)
            - Smooth transition to dark at bottom for text readability
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

        {/* Extra text protection gradient at the very bottom */}
        <div className="absolute right-0 bottom-0 left-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80" />
      </div>

      {/* --- Content Layer --- */}
      <div
        className={clsx(
          "relative z-20 flex h-full flex-col justify-end p-6",
          isHero ? "sm:p-10" : "sm:p-8",
        )}
      >
        {/* Categories (Glass Pills) */}
        {showCategories && categories && categories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {categories.map((category, i) => {
              if (typeof category === "object" && category.title) {
                return (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-wide text-white uppercase backdrop-blur-md transition-colors hover:bg-white/20"
                  >
                    {category.title}
                  </span>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Title */}
        {title && (
          <h3
            className={clsx(
              "font-display leading-[1.1] font-medium tracking-tight text-white transition-colors group-hover:text-neutral-100",
              // Refined Typography Scale
              isHero
                ? "max-w-4xl text-3xl drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl"
                : "line-clamp-3 text-2xl drop-shadow-sm sm:text-3xl",
            )}
          >
            {localizedTitle}
          </h3>
        )}

        {/* Description (Desktop Only, mostly for Hero) */}
        {description && isHero && !isMobile && (
          <p className="mt-4 line-clamp-2 hidden max-w-2xl text-lg text-white/90 drop-shadow-sm md:block">
            {description}
          </p>
        )}

        {/* Date (Glass Pill) */}
        {publishedAt && (
          <div className="mt-4 flex items-center justify-start gap-1">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
              <ClockIcon className="h-3.5 w-3.5" />
              <time dateTime={publishedAt}>
                {locale === "fa"
                  ? formatPersianRelativeDate(publishedAt)
                  : formatGregorianRelativeDate(publishedAt)}
              </time>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
