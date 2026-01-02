"use client";
import React, { Fragment } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import useClickableCard from "@/payload/utilities/useClickableCard";
import {
  formatGregorianRelativeDate,
  formatPersianRelativeDate,
} from "@/payload/utilities/formatDateTime";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import type { Post } from "@/src/payload-types";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { ClockIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";

export const ArchivePost: React.FC<{
  className?: string;
  doc?: Post;
  relationTo?: "blog";
  showCategories?: boolean;
}> = ({ className, doc, relationTo = "blog", showCategories }) => {
  const { card, link } = useClickableCard({});
  const locale = useLocale();

  const { slug, categories, title, heroImage, publishedAt, meta } = doc || {};
  const description = meta?.description;
  const localizedTitle = title && locale === "fa" ? digitsEnToFa(title) : title;
  const href = `/${locale}/${relationTo}/${slug}`;
  const hasImage = heroImage && typeof heroImage === "object";
  const t = useTranslations("Common");

  return (
    <article
      ref={card.ref}
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-900",
        "rounded-[32px]", // Unified modern rounding
        "border border-white/50 dark:border-white/5",
        "transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-neutral-900/10 dark:hover:shadow-black/60",
        className,
      )}
    >
      {/* --- 1. Image Area (Aspect 4:3) --- */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/10">
        {hasImage && (
          <div className="h-full w-full transition-transform duration-700 ease-in-out group-hover:scale-105">
            <ImageMedia
              resource={heroImage}
              size="card"
              fill
              imgClassName="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Categories (Floating Glass Pills) */}
        {showCategories && categories && categories.length > 0 && (
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
            {categories.map((category, i) => {
              if (typeof category === "object" && category.title) {
                return (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] font-bold tracking-wide text-white uppercase backdrop-blur-md transition-colors hover:bg-black/40"
                  >
                    {category.title}
                  </span>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Link Overlay */}
        <Link
          href={href}
          ref={link.ref}
          className="absolute inset-0 z-20 focus:outline-none"
        >
          <span className="sr-only">{title}</span>
        </Link>
      </div>

      {/* --- 2. Content Area --- */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {/* Date */}
        {publishedAt && (
          <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <ClockIcon className="h-3.5 w-3.5" />
            <time dateTime={publishedAt}>
              {locale === "fa"
                ? formatPersianRelativeDate(publishedAt)
                : formatGregorianRelativeDate(publishedAt)}
            </time>
          </div>
        )}

        {/* Title */}
        {title && (
          <h3 className="font-display mb-3 text-xl leading-tight font-bold text-neutral-900 transition-colors group-hover:text-neutral-600 xl:text-2xl dark:text-white dark:group-hover:text-neutral-300">
            {localizedTitle}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}

        {/* Footer Action (Push to bottom) */}
        <div className="mt-auto flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-white/10">
          <span className="text-xs font-bold tracking-widest text-neutral-900 uppercase dark:text-white">
            {t("readMore")}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-900 transition-all duration-300 group-hover:bg-neutral-900 group-hover:text-white dark:bg-white/10 dark:text-white dark:group-hover:bg-white dark:group-hover:text-black">
            <ArrowUpRightIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </article>
  );
};
