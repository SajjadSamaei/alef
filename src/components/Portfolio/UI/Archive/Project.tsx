"use client";
import { useBreakpoint } from "@/utils/hooks/useBreakpoint";
import useClickableCard from "@/payload/utilities/useClickableCard";
import { CalendarIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import React, { Fragment, useMemo } from "react";
import { JSX } from "react";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import type { CaseStudy } from "@/src/payload-types";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

// --- Internal Badge Component ---
type BadgeType = {
  className?: string;
  variant: string;
  children?: React.ReactNode;
};

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",

        // Green / Success
        success:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_-4px_rgba(52,211,153,0.3)] backdrop-blur-sm",

        // Amber / Warning
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-[0_0_10px_-4px_rgba(251,191,36,0.3)] backdrop-blur-sm",

        // Blue / Info
        info: "border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-[0_0_10px_-4px_rgba(96,165,250,0.3)] backdrop-blur-sm",

        // Neutral / Year
        neutral: "border-white/10 bg-white/5 text-neutral-300 backdrop-blur-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/* -------------------------------------------------------------------------- */
/* 2. THE COMPONENT                                                           */
/* -------------------------------------------------------------------------- */

// Maintain your existing prop types if needed, or define new ones
export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof badgeVariants>, "variant"> {
  variant?:
    | "completed"
    | "built"
    | "in_progress"
    | "construction"
    | "concept"
    | "schematic"
    | "year"
    | "default" // Optional: allow 'default' if you still want it
    | null;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  // Map legacy variants to new CVA styles
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
        // Fallback for null/undefined or unmatched strings
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

export const Project: React.FC<{
  alignItems?: "center";
  className?: string;
  doc?: CaseStudy;
  relationTo?: "case-studies";
  showCategories?: boolean;
  title?: string;
  imageSize?: "card" | "xlarge" | "square";
}> = (props) => {
  const locale = useLocale();
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
    imageSize = "card",
  } = props;

  const breakpoint = useBreakpoint();
  const t = useTranslations("BlogFilters.Status");

  const {
    slug,
    projectType,
    projectStatus,
    meta,
    title,
    featuredImage,
    yearCompleted,
  } = doc || {};

  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  // Normalize Categories
  const categories = useMemo(() => {
    if (!projectType) return [];
    if (Array.isArray(projectType)) return projectType;
    return [projectType];
  }, [projectType]);

  const hasCategories = categories.length > 0;
  const titleToUse = titleFromProps || title;
  const href = `/${locale}/projects/${slug}`;
  const hasImage = featuredImage && typeof featuredImage === "object";

  const aspectRatioClass = useMemo(() => {
    if (isMobile) return "aspect-square";
    if (imageSize === "xlarge") return "aspect-video";
    return "aspect-square";
  }, [isMobile, imageSize]);

  return (
    <article
      className={clsx(
        "group border-border bg-card relative overflow-hidden border", // Removed manual hover:cursor-pointer, the Link handles it now
        className,
      )}
      ref={card.ref}
    >
      <div className={clsx("relative h-full w-full", aspectRatioClass)}>
        {/* Image Background */}
        {hasImage && (
          <>
            <div className="absolute inset-0">
              <ImageMedia
                resource={featuredImage}
                size={imageSize}
                fill
                imgClassName="transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
            <div className="from-100 absolute inset-0 bg-linear-to-t from-black/80 to-50%" />
          </>
        )}

        {/* Content Overlay */}
        <div
          className={clsx(
            "absolute inset-0 z-10 flex flex-col justify-end gap-1 p-6 text-white xl:p-8", // Added z-10 to ensure clicks hit the link, not the image
            {
              "pt-16": !showCategories,
              "pt-10": showCategories,
            },
          )}
        >
          {/* Categories */}
          {showCategories && hasCategories && (
            <div className="relative z-20 text-sm tracking-wider uppercase opacity-80">
              {" "}
              {/* z-20 allows text selection if needed, though link usually covers all */}
              {categories.map((category, i) => {
                if (typeof category === "object" && category !== null) {
                  const categoryData = category as any;
                  const categoryTitle = categoryData.title || "Untitled";
                  const isLast = i === categories.length - 1;

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

          {/* Title & Main Link */}
          {titleToUse && (
            <div className="font-medium md:text-lg xl:text-2xl">
              <h3>
                <Link
                  className="not-prose after:absolute after:inset-0 focus:outline-none"
                  href={href}
                  ref={link.ref}
                >
                  {/* --- FIX START: Stretched Link Span --- */}
                  <span className="absolute inset-0 z-10" aria-hidden="true" />
                  {/* --- FIX END --- */}
                  <span className="relative z-20">{titleToUse}</span>
                </Link>
              </h3>
            </div>
          )}

          {/* Badges */}
          <div className="pointer-events-none relative z-20 mt-2 flex flex-wrap items-center gap-2">
            {" "}
            {/* pointer-events-none lets clicks pass through to the stretched link underneath */}
            {projectStatus && (
              <Badge variant={projectStatus} className="">
                <p>{t(projectStatus)}</p>
              </Badge>
            )}
            {yearCompleted && (
              <Badge variant="year" className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>{yearCompleted}</span>
              </Badge>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
