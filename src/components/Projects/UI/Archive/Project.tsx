"use client";
import React, { JSX } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useLocale, useTranslations, useFormatter } from "next-intl";

import type { Project as ProjectType } from "@/src/payload-types";
import { Border } from "@/components/chegall/studio/Border";
import { Share } from "@/components/ui/share/ShareButton";
import { ThumbnailMedia } from "@/components/Blog/Media/ProjectThumbnailMedia";

const getMediaUrl = (media: any) => {
  if (!media) return null;
  if (typeof media === "string") return media;
  return media.url;
};

type BadgeType = {
  className?: string;
  variant: string;
  children?: React.ReactNode;
};

function Badge({
  className,
  variant,
  children,
  ...props
}: BadgeType & React.HTMLAttributes<HTMLSpanElement>): JSX.Element {
  return (
    <span
      className={clsx(
        "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap shadow-sm ring-1 ring-white/10 backdrop-blur-md transition-colors",
        {
          "bg-lime-500/90 text-lime-50": variant === "completed",
          "bg-amber-500/90 text-amber-50": variant === "in_progress",
          "bg-blue-500/90 text-blue-50": variant === "concept",
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export const Project: React.FC<{
  doc: ProjectType;
  className?: string;
}> = (props) => {
  const { doc, className } = props;
  const locale = useLocale();
  const format = useFormatter();
  const tStatus = useTranslations("BlogFilters.Status");

  const {
    slug,
    title,
    subtitle,
    summary,
    year,
    services,
    featuredImage,
    projectStatus,
    clientLogo,
  } = doc;

  const href = `/work/${slug}`;
  const formattedServices = services?.map((s) => s.service).join(" / ");
  const logoUrl = getMediaUrl(clientLogo);

  return (
    <article className={clsx("w-full", className)}>
      <Border className="grid grid-cols-1 gap-y-8 pt-12 xl:flex xl:flex-row xl:items-center xl:justify-start xl:gap-x-12">
        <div className="w-full max-w-full xl:w-80 xl:shrink-0">
          <div className="group relative aspect-square w-full max-w-full overflow-hidden rounded-[32px] md:aspect-video md:h-80 lg:h-96 xl:aspect-[9/16] xl:h-96 xl:w-full">
            {featuredImage && (
              <ThumbnailMedia
                resource={featuredImage}
                fill
                size="project-card"
                imgClassName="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            )}

            <Link href={href} className="absolute inset-0 z-20">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity duration-500 hover:opacity-90"
              />
            </Link>

            {projectStatus && (
              <div className="pointer-events-none absolute top-6 left-6 z-30 sm:left-5">
                <Badge variant={projectStatus}>{tStatus(projectStatus)}</Badge>
              </div>
            )}

            {logoUrl && (
              <div className="pointer-events-none absolute top-6 right-6 z-30 sm:right-5">
                <Image
                  src={logoUrl}
                  alt="Client Logo"
                  width={40}
                  height={40}
                  className="h-8 w-auto object-contain opacity-90 drop-shadow-md grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0 sm:h-10"
                />
              </div>
            )}

            <div className="pointer-events-none absolute start-6 bottom-6 left-6 z-30 sm:start-5">
              <h3 className="text-3xl font-semibold text-neutral-100 lg:mt-8">
                {title}
              </h3>
              <div className="text-md mt-2 flex gap-x-2 text-neutral-200">
                {formattedServices && (
                  <p className="tracking-tight text-neutral-100">
                    {formattedServices}
                  </p>
                )}
                {formattedServices && year && (
                  <span className="text-neutral-300">/</span>
                )}
                {year && (
                  <p className="text-neutral-100">
                    <time dateTime={year.toString()}>
                      {format.number(year, { useGrouping: false })}
                    </time>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: CONTENT --- */}
        {/* flex-1 lets it fill the remaining space naturally */}
        <div className="flex w-full flex-col justify-center xl:max-w-2xl xl:flex-1">
          <h4 className="hidden text-2xl font-semibold tracking-tight text-neutral-950 sm:block sm:text-4xl dark:text-neutral-50">
            <Link href={href}>{title}</Link>
          </h4>

          <div className="mt-6 space-y-6 text-base text-neutral-600 dark:text-neutral-400">
            {summary && summary.length > 0 ? (
              summary.map((item, i) => (
                <p className="paragraph-style-pretty" key={i}>
                  {item.paragraph}
                </p>
              ))
            ) : (
              <p className="paragraph-style-pretty">{subtitle}</p>
            )}
          </div>

          <div className="mt-8 inline-flex gap-2">
            <Share
              title={title}
              text={subtitle || ""}
              url={`${process.env.NEXT_PUBLIC_URL}${href}`}
            />
          </div>
        </div>
      </Border>
    </article>
  );
};
