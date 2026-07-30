"use client";
import React from "react";
import { ImageMedia } from "@/components/Blog/Media/BlogMedia/ImageMedia";
import type { Post } from "@/src/payload-types";
import { formatAuthors } from "@/payload/utilities/formatAuthors";
import { AuthorsMenu } from "@/components/Blog/UI/Authors/AuthorsMenu";
import { Share } from "@/components/Blog/UI/Share/share";
import {
  formatEnglishDateLong,
  formatPersianDateLong,
} from "@/payload/utilities/formatDateTime";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Container } from "@/components/chegall/studio/Container";

export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const locale = useLocale();
  const t = useTranslations("Blog");

  const {
    categories,
    heroImage,
    populatedAuthors,
    publishedAt,
    title,
    subtitle,
    readingTime,
    slug, // Needed for share URL
  } = post;

  const localizedTitle = title && locale === "fa" ? digitsEnToFa(title) : title;
  const localizedSubtitle =
    locale === "fa" ? digitsEnToFa(subtitle || "") : subtitle;

  const authors = populatedAuthors as any[];

  // Construct URL for sharing
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/blog/${slug}`
      : `/${locale}/blog/${slug}`;

  return (
    <header className="relative flex flex-col items-center text-center">
      {/* 1. Categories */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories?.map((category, index) => {
          if (typeof category === "object" && category?.title) {
            return (
              <span
                key={index}
                className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
              >
                {category.title}
              </span>
            );
          }
          return null;
        })}
      </div>

      {/* 2. Title & Subtitle */}
      <div className="mt-8 max-w-4xl px-6">
        <h1 className="font-display text-4xl font-medium tracking-tight text-neutral-950 sm:text-5xl md:text-6xl dark:text-white">
          {localizedTitle}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            {localizedSubtitle}
          </p>
        )}
      </div>

      {/* 3. Meta Row (Authors, Share, Date, Reading Time) */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 border-t border-neutral-100 pt-8 dark:border-white/10">
        {/* Authors Group */}
        {authors && authors.length > 0 && (
          <div className="flex -space-x-2">
            <AuthorsMenu authors={authors} />
          </div>
        )}

        {/* ✅ Share Button (Pill Style) */}
        <Share title={title || ""} text={subtitle || ""} url={shareUrl} />

        {/* Divider (Optional visual separation) */}
        <div className="hidden h-4 w-px bg-neutral-200 sm:block dark:bg-white/10" />

        {/* Date & Time Group */}
        <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            <time dateTime={publishedAt || ""}>
              {publishedAt && locale === "fa"
                ? formatPersianDateLong(publishedAt)
                : publishedAt && locale !== "fa"
                  ? formatEnglishDateLong(publishedAt)
                  : null}
            </time>
          </div>

          {readingTime && (
            <div className="flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              <span>
                {locale === "fa"
                  ? `${digitsEnToFa(readingTime)} ${t("minRead")}`
                  : `${readingTime} min read`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Hero Image */}
      <Container className="relative mt-16 w-full max-w-5xl px-0 sm:px-6 lg:px-8">
        <div
          className="group relative w-full overflow-hidden rounded-[40px] bg-neutral-100 shadow-2xl dark:bg-neutral-900"
          style={{ isolation: "isolate" }}
        >
          {heroImage && typeof heroImage !== "string" && (
            <motion.div
              initial={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="relative block w-full"
            >
              <ImageMedia
                priority
                resource={heroImage}
                imgClassName="w-full h-auto block"
              />
            </motion.div>
          )}
          <div className="pointer-events-none absolute inset-0 z-10 rounded-[40px] ring-1 ring-black/10 ring-inset dark:ring-white/10" />
        </div>
      </Container>
    </header>
  );
};
