"use client";
import React, { Fragment, useMemo, JSX } from "react";
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

// --- Main Card Component ---

// FIX: Use a Union type (|) instead of Intersection (&) so incompatible fields don't break TS.
type CardDoc = Project | CaseStudy | Post;

export const Card: React.FC<{
  className?: string;
  doc?: CardDoc;
  relationTo?: "blog" | "projects" | "case-studies";
  showCategories?: boolean;
  imageSize?: "card" | "xlarge" | "square";
}> = (props) => {
  const {
    className,
    doc,
    relationTo,
    showCategories,
    imageSize = "card",
  } = props;

  const locale = useLocale();
  const tStatus = useTranslations("BlogFilters.Status");
  const { card, link } = useClickableCard({});
  const breakpoint = useBreakpoint();

  // --- Safe Data Extraction ---
  // We cast to 'any' briefly to access potential shared fields safely,
  // or checks for specific properties.
  const genericDoc = doc as any;

  const slug = genericDoc?.slug;
  const title = genericDoc?.title;
  const meta = genericDoc?.meta;
  const publishedAt = genericDoc?.publishedAt;
  const projectStatus = genericDoc?.projectStatus;

  // 1. Handle Images
  // Post uses 'heroImage', Project/CaseStudy use 'featuredImage'
  const displayImage = genericDoc?.heroImage || genericDoc?.featuredImage;
  const hasImage = displayImage && typeof displayImage === "object";

  // 2. Handle Categories/Types (The source of your error)
  // Post uses 'categories' (Array)
  // Project uses 'projectType' (Array)
  // CaseStudy might use 'projectType' (Single or Array depending on Payload config)
  const rawCategories = genericDoc?.categories || genericDoc?.projectType;

  // Normalize to Array: If it's a single object/ID, wrap it. If Array, use it.
  const categories = Array.isArray(rawCategories)
    ? rawCategories
    : rawCategories
      ? [rawCategories]
      : [];

  const hasCategories = categories.length > 0;

  const description = meta?.description;
  const sanitizedDescription = description?.replace(/\s/g, " ");

  // 3. Construct URL
  // Map 'projects' -> 'work', others keep their relation slug
  const urlRelation = relationTo === "case-studies" ? "projects" : relationTo;
  const href = `/${locale}/${urlRelation}/${slug}`;

  // --- Aspect Ratio Logic ---
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
        className, // Rounding classes passed from parent apply here
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
          </>
        )}

        {/* --- Content Overlay --- */}
        <div
          className={clsx(
            "absolute inset-0 flex flex-col justify-end gap-1 p-6 text-white xl:p-8",
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
                // Ensure cat is an object (populated)
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
              <Link
                className="not-prose focus:outline-none"
                href={href}
                ref={link.ref}
              >
                <span className="absolute inset-0" aria-hidden="true" />
                {title}
              </Link>
            </h3>
          )}

          {/* Description (Hidden on mobile) */}
          {/* {sanitizedDescription && (
            <div className="mt-2 line-clamp-2 hidden text-sm text-gray-300 xl:block">
              {sanitizedDescription}
            </div>
          )} */}

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
