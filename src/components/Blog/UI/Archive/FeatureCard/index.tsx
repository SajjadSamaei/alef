import React from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  ArrowLongRightIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
import {
  formatGregorianRelativeDate,
  formatPersianRelativeDate,
} from "@/payload/utilities/formatDateTime";
import { ThumbnailMedia } from "@/components/Blog/Media/ThumbnailMedia";
import type { Post } from "@/src/payload-types";
import { digitsEnToFa } from "@persian-tools/persian-tools";

type Props = {
  doc: Post;
  index: number;
  locale: string;
  readMoreLabel?: string;
};

export const FeatureCard: React.FC<Props> = ({
  doc,
  index,
  locale,
  readMoreLabel,
}) => {
  const { title, slug, publishedAt, heroImage } = doc;
  const href = `/${locale}/blog/${slug}`;
  const isRtl = locale === "fa";

  // --- LOCALIZATION LOGIC ---

  // 1. Get the Label ("Report" vs "گزارش")
  const reportLabel = isRtl ? "گزارش" : "Report";
  const localizedTitle = title && locale === "fa" ? digitsEnToFa(title) : title;

  // 2. Get the Number ("01" vs "۰۱")
  // formatting it to ensure at least 2 digits
  const reportNumber = (index + 1).toLocaleString(isRtl ? "fa-IR" : "en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  const label = readMoreLabel || (isRtl ? "ادامه مطلب" : "Read Story");

  return (
    <Link
      href={href}
      className={clsx(
        "group block h-full transition-all duration-300",
        // Desktop Encapsulation Styles:
        "lg:rounded-[32px] lg:border lg:border-neutral-200 lg:bg-white lg:p-2 lg:hover:border-neutral-300 lg:hover:shadow-sm",
        "lg:dark:border-white/10 lg:dark:bg-white/5 lg:dark:hover:border-white/20",
      )}
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-200 lg:rounded-[24px] dark:bg-neutral-800">
        {heroImage && typeof heroImage === "object" && (
          <ThumbnailMedia
            resource={heroImage}
            size="card"
            fill
            imgClassName="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 ring-inset lg:rounded-[24px] dark:ring-white/10" />
      </div>

      {/* 2. Text Content */}
      <div className="mt-6 flex flex-col gap-3 lg:px-4 lg:pb-4">
        {/* Meta Data */}
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {publishedAt && (
            <time dateTime={publishedAt}>
              {locale === "fa"
                ? formatPersianRelativeDate(publishedAt)
                : formatGregorianRelativeDate(publishedAt)}
            </time>
          )}
          <span className="h-0.5 w-0.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />

          {/* 👇 Localized Report Number */}
          <span className="tracking-wider text-neutral-400 uppercase">
            {reportLabel} {reportNumber}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl leading-snug font-semibold text-neutral-900 transition-colors group-hover:text-neutral-600 dark:text-white dark:group-hover:text-neutral-300">
          {localizedTitle}
        </h3>

        {/* "Read" Link */}
        <div className="mt-auto flex items-center pt-2 text-sm font-medium text-neutral-950 dark:text-white">
          <span className="relative">
            {label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
          </span>
          {isRtl ? (
            <ArrowLongLeftIcon className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          ) : (
            <ArrowLongRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </div>
      </div>
    </Link>
  );
};
