"use client";
import { useBreakpoint } from "@/utils/hooks/useBreakpoint";
import useClickableCard from "@/payload/utilities/useClickableCard";
import { CalendarIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import React, { Fragment, useMemo } from "react";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import type { CaseStudy } from "@/src/payload-types";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

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

export const Project: React.FC<{
  alignItems?: "center";
  className?: string;
  doc?: CaseStudy;
  relationTo?: "case-studies";
  showCategories?: boolean;
  title?: string;
  imageSize?: "card" | "xlarge" | "square";
  showOverlay?: boolean;
}> = (props) => {
  const locale = useLocale();
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    showCategories = true,
    title: titleFromProps,
    imageSize = "card",
  } = props;

  const breakpoint = useBreakpoint();
  const t = useTranslations("BlogFilters.Status");

  const {
    slug,
    projectType,
    projectStatus,
    title,
    featuredImage,
    yearCompleted,
  } = doc || {};

  const isMobile = breakpoint === "xs" || breakpoint === "sm";

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
        "group border-border bg-card relative overflow-hidden border",
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
                imgClassName="object-cover grayscale transition duration-700 ease-in-out group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            {/* Gradient background fades in on hover */}
            <div className="from-100 absolute inset-0 bg-linear-to-t from-black/80 to-50% transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
          </>
        )}

        {/* Full-card Stretched Link */}
        <Link
          className="absolute inset-0 z-10 focus:outline-none"
          href={href}
          ref={link.ref}
          aria-label={titleToUse || "Project"}
        />

        {/* Content Overlay (Fades in on hover) */}
        <div
          className={clsx(
            "absolute inset-0 z-20 flex flex-col justify-end gap-1 p-6 text-white xl:p-8 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto",
            {
              "pt-16": !showCategories,
              "pt-10": showCategories,
            },
          )}
        >
          {/* Categories / Tags */}
          {showCategories && hasCategories && (
            <div className="relative z-20 text-sm tracking-wider uppercase opacity-80">
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

          {/* Title / Name */}
          {titleToUse && (
            <div className="font-medium md:text-lg xl:text-2xl">
              <h3>
                <span className="not-prose">{titleToUse}</span>
              </h3>
            </div>
          )}

          {/* Badges */}
          <div className="pointer-events-none relative z-20 mt-2 flex flex-wrap items-center gap-2">
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
