"use client";
import type { Post } from "@/src/payload-types";
import useClickableCard from "@/payload/utilities/useClickableCard";
import { ClockIcon } from "@heroicons/react/24/outline";
import React from "react";
import clsx from "clsx";
import { Link } from "@/src/i18n/routing";
import { ImageMedia } from "@/components/Blog/Media/BlogMedia/ImageMedia";
import { useLocale } from "next-intl";
import {
  formatPersianRelativeDate,
  formatGregorianRelativeDate,
} from "@/payload/utilities/formatDateTime";
import { digitsEnToFa } from "@persian-tools/persian-tools";

export const Card: React.FC<{
  className?: string;
  doc?: Post;
  showCategories?: boolean;
}> = ({ className, doc, showCategories }) => {
  const { card, link } = useClickableCard({});
  const { slug, categories, title, heroImage, publishedAt, readingTime } =
    doc || {};
  const locale = useLocale();
  const hasImage = heroImage && typeof heroImage === "object";
  const href = `/blog/${slug}`;

  // Localize content
  const localizedTitle = locale === "fa" && title ? digitsEnToFa(title) : title;

  return (
    <article
      ref={card.ref}
      className={clsx(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-white transition-all hover:shadow-lg dark:bg-white/5",
        "border border-neutral-200 dark:border-white/10",
        className,
      )}
    >
      {/* 1. Image Container (Zoom Effect) */}
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-white/5">
        {hasImage && (
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <ImageMedia
              resource={heroImage}
              imgClassName="object-cover w-full h-full"
            />
          </div>
        )}
      </div>

      {/* 2. Content Body */}
      <div className="flex flex-1 flex-col p-6">
        {/* Categories */}
        {showCategories && categories && categories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2 text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
            {categories.map((category, i) => {
              if (typeof category === "object" && category.title) {
                return (
                  <span
                    key={i}
                    className="text-neutral-600 dark:text-neutral-300"
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
        <h3 className="mb-2 text-xl font-semibold text-neutral-900 group-hover:text-neutral-600 dark:text-white dark:group-hover:text-neutral-300">
          <Link href={href} ref={link.ref} className="focus:outline-none">
            {localizedTitle}
          </Link>
        </h3>

        {/* Footer Meta (Date & Time) */}
        <div className="mt-auto flex items-center gap-4 border-t border-neutral-100 pt-4 text-sm text-neutral-500 dark:border-white/5 dark:text-neutral-400">
          {publishedAt && (
            <div className="flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              <time dateTime={publishedAt}>
                {locale === "fa"
                  ? formatPersianRelativeDate(publishedAt)
                  : formatGregorianRelativeDate(publishedAt)}
              </time>
            </div>
          )}
          {readingTime && (
            <span>
              {locale === "fa" ? digitsEnToFa(readingTime) : readingTime} min
              read
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
