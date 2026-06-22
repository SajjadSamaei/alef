"use client";
import { useBreakpoint } from "@/utils/hooks/useBreakpoint";
import useClickableCard from "@/payload/utilities/useClickableCard";
import clsx from "clsx";
import Link from "next/link";
import React, { Fragment, useMemo } from "react";
import { JSX } from "react";
import { ThumbnailMedia } from "@/components/Blog/Media/ThumbnailMedia";
import type { Project } from "@/src/payload-types";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

type BadgeType = {
  className: string;
  variant: string;
};

function Badge({
  className,
  variant,
  children,
  ...props
}: BadgeType &
  React.HTMLAttributes<HTMLSpanElement> & {
    children?: React.ReactNode;
  }): JSX.Element {
  return (
    <span
      className={clsx(
        "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap shadow-sm ring-1 ring-white/10 backdrop-blur-md transition-colors",
        {
          "bg-lime-600/20 text-lime-400 ring-lime-500/30":
            variant === "completed",
          "bg-amber-600/20 text-amber-500 ring-amber-500/30":
            variant === "in_progress",
          "bg-blue-600/20 text-blue-500 ring-blue-500/30":
            variant === "concept",
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
  className?: string;
  doc?: Project;
  relationTo?: "projects";
  showCategories?: boolean;
  imageSize?: "card" | "xlarge" | "square";
}> = (props) => {
  const locale = useLocale();
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    showCategories,
    imageSize = "card", // Default
  } = props;

  const breakpoint = useBreakpoint();
  const t = useTranslations("BlogFilters.Status");

  const { slug, projectType, projectStatus, title, featuredImage } = doc || {};

  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const hasCategories =
    projectType && Array.isArray(projectType) && projectType.length > 0;
  const href = `/${locale}/work/${slug}`;
  const hasImage = featuredImage && typeof featuredImage === "object";

  // Aspect Ratio Logic
  // Mobile: Always Square
  // Desktop: Video if 'xlarge', Square if 'card'
  const aspectRatioClass = isMobile
    ? "aspect-square"
    : imageSize === "xlarge"
      ? "aspect-video"
      : "aspect-square";

  return (
    <article
      className={clsx(
        "border-border bg-card overflow-hidden border hover:cursor-pointer",
        "relative",
        // All rounding logic is now handled by the parent 'className' prop
        className,
      )}
      ref={card.ref}
    >
      <div className={clsx("relative h-full w-full", aspectRatioClass)}>
        {hasImage && (
          <>
            <div className="absolute inset-0">
              <ThumbnailMedia
                resource={featuredImage}
                size={imageSize}
                fill
                imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-90" />
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
          {showCategories && hasCategories && (
            <div className="text-sm tracking-wider uppercase opacity-90">
              {projectType?.map((category, i) => {
                if (typeof category === "object") {
                  const { title: catTitle } = category;
                  const isLast = i === projectType.length - 1;
                  return (
                    <Fragment key={i}>
                      {catTitle || "Untitled"}
                      {!isLast && <span className="mx-1">•</span>}
                    </Fragment>
                  );
                }
                return null;
              })}
            </div>
          )}

          {title && (
            <div className="font-medium md:text-lg xl:text-2xl">
              <h3>
                <Link
                  className="not-prose focus:outline-none"
                  href={href}
                  ref={link.ref}
                >
                  {title}
                  <span className="absolute inset-0" />
                </Link>
              </h3>
            </div>
          )}

          {projectStatus && (
            <div className="mt-2">
              <Badge variant={projectStatus} className="">
                {t(projectStatus)}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
