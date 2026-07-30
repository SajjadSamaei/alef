"use client";
import React, { Fragment, useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { useLocale, useTranslations } from "next-intl";
import { ClockIcon } from "@heroicons/react/24/outline";

// Hooks & Utils
import { useBreakpoint } from "@/utils/hooks/useBreakpoint";
import useClickableCard from "@/payload/utilities/useClickableCard";
import {
  formatGregorianRelativeDate,
  formatPersianRelativeDate,
} from "@/payload/utilities/formatDateTime";

// Components & Types
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import type { CaseStudy, Post, Project } from "@/src/payload-types";

// --- Internal Badge Component ---
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_-4px_rgba(52,211,153,0.3)] backdrop-blur-sm",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-[0_0_10px_-4px_rgba(251,191,36,0.3)] backdrop-blur-sm",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-[0_0_10px_-4px_rgba(96,165,250,0.3)] backdrop-blur-sm",
        neutral: "border-white/10 bg-white/5 text-neutral-300 backdrop-blur-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof badgeVariants>, "variant"> {
  variant?:
    | "completed"
    | "built"
    | "in_progress"
    | "construction"
    | "concept"
    | "schematic"
    | "year"
    | "default"
    | null;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "completed":
      case "built":
        return "success";
      case "in_progress":
      case "construction":
        return "warning";
      case "concept":
      case "schematic":
        return "info";
      case "year":
        return "neutral";
      default:
        return "default";
    }
  };

  return (
    <span
      className={cn(badgeVariants({ variant: getVariantStyle() }), className)}
      {...props}
    />
  );
}

type CardDoc = Project | CaseStudy | Post;

export const Card: React.FC<{
  className?: string;
  doc?: CardDoc;
  relationTo?: "blog" | "projects" | "case-studies";
  showCategories?: boolean;
  imageSize?: "card" | "xlarge" | "square";
  showOverlay?: boolean;
}> = (props) => {
  const {
    className,
    doc,
    relationTo,
    showCategories = true,
    imageSize = "card",
  } = props;

  const locale = useLocale();
  const tStatus = useTranslations("BlogFilters.Status");
  const { card, link } = useClickableCard({});
  const breakpoint = useBreakpoint();

  const genericDoc = doc as any;

  const slug = genericDoc?.slug;
  const title = genericDoc?.title;
  const publishedAt = genericDoc?.publishedAt;
  const projectStatus = genericDoc?.projectStatus;

  const displayImage = genericDoc?.heroImage || genericDoc?.featuredImage;
  const hasImage = displayImage && typeof displayImage === "object";

  const rawCategories = genericDoc?.categories || genericDoc?.projectType;

  const categories = Array.isArray(rawCategories)
    ? rawCategories
    : rawCategories
      ? [rawCategories]
      : [];

  const hasCategories = categories.length > 0;

  const urlRelation = relationTo === "case-studies" ? "projects" : relationTo;
  const href = `/${locale}/${urlRelation}/${slug}`;

  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  const aspectRatioClass = useMemo(() => {
    if (isMobile) return "aspect-square";
    if (imageSize === "xlarge") return "aspect-video";
    return "aspect-square";
  }, [isMobile, imageSize]);

  return (
    <article
      ref={card.ref}
      className={clsx(
        "group border-border bg-card relative overflow-hidden border hover:cursor-pointer",
        className,
      )}
    >
      <div className={clsx("relative h-full w-full", aspectRatioClass)}>
        {/* --- Image Background --- */}
        {hasImage && (
          <>
            <div className="absolute inset-0">
              <ImageMedia
                resource={displayImage}
                size={imageSize}
                fill
                imgClassName="object-cover grayscale transition duration-700 ease-in-out group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            {/* Gradient background fades in on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        )}

        {/* --- Full-card Stretched Link --- */}
        <Link
          className="absolute inset-0 z-10 focus:outline-none"
          href={href}
          ref={link.ref}
          aria-label={title || "Project"}
        />

        {/* --- Content Overlay (Fades in on hover) --- */}
        <div
          className={clsx(
            "absolute inset-0 z-20 flex flex-col justify-end gap-1 p-6 text-white xl:p-8 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto",
            {
              "pt-16": !showCategories,
              "pt-10": showCategories,
            },
          )}
        >
          {/* Categories */}
          {showCategories && hasCategories && (
            <div className="mb-1 flex flex-wrap gap-2 text-xs font-medium tracking-wider uppercase opacity-90">
              {categories.map((cat: any, i: number) => {
                if (typeof cat === "object" && cat !== null) {
                  const catTitle = cat.title || "Untitled";
                  const isLast = i === categories.length - 1;
                  return (
                    <Fragment key={i}>
                      <span>{catTitle}</span>
                      {!isLast && <span className="opacity-50">•</span>}
                    </Fragment>
                  );
                }
                return null;
              })}
            </div>
          )}

          {/* Title */}
          {title && (
            <h3 className="text-lg leading-tight font-medium xl:text-2xl">
              <span className="not-prose">{title}</span>
            </h3>
          )}

          {/* Footer: Date or Status */}
          <div className="mt-3 flex items-center gap-3">
            {projectStatus && (
              <Badge variant={projectStatus}>{tStatus(projectStatus)}</Badge>
            )}

            {publishedAt && !projectStatus && (
              <div className="flex items-center gap-1 text-xs text-gray-300">
                <ClockIcon className="h-3.5 w-3.5" />
                <time dateTime={publishedAt}>
                  {locale === "fa"
                    ? formatPersianRelativeDate(publishedAt)
                    : formatGregorianRelativeDate(publishedAt)}
                </time>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
