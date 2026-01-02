"use client";
import { useBreakpoint } from "@/utils/hooks/useBreakpoint";
import {
  formatGregorianRelativeDate,
  formatPersianRelativeDate,
} from "@/payload/utilities/formatDateTime";
import useClickableCard from "@/payload/utilities/useClickableCard";
import { ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import React, { Fragment, useMemo } from "react";
import { JSX } from "react";
import { ThumbnailMedia } from "@/components/Blog/Media/ThumbnailMedia";
import type { CaseStudy } from "@/src/payload-types";
import { useLocale } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import { useTranslations } from "next-intl";

type BadgeType = {
  className: string;
  variant: string;
};

function Badge({
  className,
  variant,
  children, // <-- Add `children` here
  ...props
}: BadgeType &
  React.HTMLAttributes<HTMLSpanElement> & {
    children?: React.ReactNode;
  }): JSX.Element {
  return (
    <span
      className={clsx(
        "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap shadow-2xs ring-1 ring-white/10 transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
        {
          "5 bg-lime-600/10 text-lime-400": variant === "completed",
          "bg-amber-600/10 text-amber-500": variant === "in_progress",
          "bg-blue-600/15 text-blue-500": variant === "concept",
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export const Card: React.FC<{
  alignItems?: "center";
  className?: string;
  doc?: CaseStudy;
  relationTo?: "case-studies";
  showCategories?: boolean;
  title?: string;
  index?: number;
  length?: number;
}> = (props) => {
  const locale = useLocale();
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
    index = 0,
    length = 0,
  } = props;

  const breakpoint = useBreakpoint();
  const direction = useDirection();
  const t = useTranslations("BlogFilters.Status");

  const {
    slug,
    projectType,
    projectStatus,
    meta,
    title,
    featuredImage,
    publishedAt,
  } = doc || {};
  const description = meta?.description;
  // --- Dynamic Corner Logic ---
  const isMobile = useMemo(
    () => breakpoint === "xs" || breakpoint === "sm",
    [breakpoint],
  );

  const isFirstCard = index === 0;
  const isLastCard = index === length - 1;

  const isFirstRow = !isMobile && (index === 0 || index === 1);
  const isLastRow =
    !isMobile &&
    length &&
    index >= length - (index === 0 || index === 3 ? 2 : 1);
  const isFirstCol = !isMobile && (index === 0 || index === 2);
  const isLastCol =
    !isMobile && (index === 1 || index === 3 || index === length - 1);
  // --- End of dynamic corner logic ---

  let imageSizeName = "card";

  if (index === 0 || index === 3) {
    if (isMobile) {
      imageSizeName = "xlarge";
    } else if (breakpoint === "sm" || breakpoint === "md") {
      imageSizeName = "xlarge";
    } else {
      imageSizeName = "xlarge";
    }
  } else {
    if (isMobile) {
      imageSizeName = "card";
    } else if (breakpoint === "sm" || breakpoint === "md") {
      imageSizeName = "xlarge";
    } else {
      imageSizeName = "xlarge";
    }
  }

  const hasCategories =
    projectType && Array.isArray(projectType) && projectType.length > 0;
  const titleToUse = title || titleFromProps;
  const sanitizedDescription = description?.replace(/\s/g, " ");
  const href = `/${locale}/${relationTo}/${slug}`;
  const hasImage = featuredImage && typeof featuredImage === "object";

  // Conditionally set the aspect ratio class
  const aspectRatioClass = useMemo(() => {
    // If it's a mobile device, we always want a square aspect ratio.
    if (isMobile) {
      return "aspect-square";
    }

    // If it's not a mobile device and the card is at index 0 or 3,
    // use a wider aspect ratio for a two-column layout.
    if (index === 0 || index === 3) {
      return "aspect-video";
    }

    // For all other cases on non-mobile devices, use a square aspect ratio.
    return "aspect-square";
  }, [index, isMobile]);

  return (
    <article
      className={clsx(
        "border-border bg-card overflow-hidden border hover:cursor-pointer",
        "relative",
        className,
        {
          // Mobile remains the same (Top/Bottom logic doesn't change with direction)
          "rounded-t-[40px]": isMobile && isFirstCard,
          "rounded-b-[40px]": isMobile && isLastCard,

          // --- Desktop Dynamic Corners ---

          // 1. First Row, Start Column (Top-Start)
          // RTL: Top-Right | LTR: Top-Left
          [direction === "rtl" ? "rounded-tr-[40px]" : "rounded-tl-[40px]"]:
            !isMobile && isFirstRow && isFirstCol,

          // 2. First Row, End Column (Top-End)
          // RTL: Top-Left | LTR: Top-Right
          [direction === "rtl" ? "rounded-tl-[40px]" : "rounded-tr-[40px]"]:
            !isMobile && isFirstRow && isLastCol,

          // 3. Last Row, Start Column (Bottom-Start)
          // RTL: Bottom-Right | LTR: Bottom-Left
          [direction === "rtl" ? "rounded-br-[40px]" : "rounded-bl-[40px]"]:
            !isMobile && isLastRow && isFirstCol,

          // 4. Last Row, End Column (Bottom-End)
          // RTL: Bottom-Left | LTR: Bottom-Right
          [direction === "rtl" ? "rounded-bl-[40px]" : "rounded-br-[40px]"]:
            !isMobile && isLastRow && isLastCol,
        },
      )}
      ref={card.ref}
    >
      <div className={clsx("relative h-full w-full", aspectRatioClass)}>
        {hasImage && (
          <>
            <div className="absolute inset-0">
              <ThumbnailMedia
                resource={featuredImage}
                size={imageSizeName}
                fill
              />
            </div>
            <div className="from-100 absolute inset-0 bg-linear-to-t from-black/80 to-80%" />
          </>
        )}

        <div
          className={clsx(
            "absolute inset-0 flex flex-col justify-end gap-1 p-6 text-white xl:p-8",
            {
              "pt-16": !showCategories,
              "pt-10": showCategories,
            },
          )}
        >
          {hasCategories && (
            <div className="text-sm uppercase">
              {projectType?.map((category, i) => {
                if (typeof category === "object") {
                  const { title: titleFromCategory } = category;
                  const categoryTitle =
                    titleFromCategory || "Untitled category";
                  const isLast = i === projectType.length - 1;

                  return (
                    <Fragment key={i}>
                      {categoryTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  );
                }
                return null;
              })}
            </div>
          )}
          {titleToUse && (
            <div className="font-medium md:text-lg xl:text-2xl">
              <h3>
                <Link className="not-prose" href={href} ref={link.ref}>
                  {titleToUse}
                </Link>
              </h3>
            </div>
          )}
          {projectStatus && (
            <Badge variant={projectStatus} className="">
              {projectStatus && <p>{t(projectStatus)}</p>}
            </Badge>
          )}
          {/* {description && (
            <div className="hidden xl:block">
              {description && <p>{sanitizedDescription}</p>}
            </div>
          )} */}
          {/* {publishedAt && (
            <div className="flex items-center justify-start gap-1 text-sm">
              <ClockIcon className="w-4" />
              <time dateTime={publishedAt}>
                {locale === "fa"
                  ? formatPersianRelativeDate(publishedAt)
                  : formatGregorianRelativeDate(publishedAt)}
              </time>
            </div>
          )} */}
        </div>
      </div>
    </article>
  );
};
