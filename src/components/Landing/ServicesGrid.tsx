"use client";

import clsx from "clsx";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import { useTranslations } from "next-intl";
import type { LandingPage } from "@/src/payload-types";
import type { Media } from "@/src/payload-types";

type ScrollLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export function ScrollToSection({ to, children, className }: ScrollLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const section = document.getElementById(to);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a href={`services#${to}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

type ServicesData = LandingPage["services"];

function GridItem({
  className,
  media,
  title,
  linkTo,
  // ✅ NEW PROP: Accept custom rounding classes
  // Default to rounded-2xl for mobile/tablet stacked view, and less rounded inner corners on desktop
  roundingClassName = "rounded-2xl lg:rounded-md",
}: {
  className?: string;
  media: number | Media | null | undefined;
  title: string;
  linkTo: string;
  roundingClassName?: string;
}) {
  return (
    <div
      className={clsx(
        // Removed fixed rounded-[32px] here
        "group relative w-full overflow-hidden border border-neutral-200 bg-neutral-100 dark:border-white/10 dark:bg-neutral-900",
        // ✅ Apply dynamic rounding classes
        roundingClassName,
        className,
      )}
    >
      <div className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105">
        <ImageMedia
          resource={media}
          // Use 'large' or 'card' depending on how big these get on your screen.
          // 'large' is safer for the wide architectural shot.
          size="large"
          fill
          imgClassName="object-cover"
        />
      </div>

      <ScrollToSection to={linkTo} className="absolute inset-0 z-10 block">
        <span className="sr-only">View {title}</span>
      </ScrollToSection>

      <div className="absolute bottom-6 left-6 z-20">
        <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md transition-colors group-hover:bg-white/20 dark:bg-black/30">
          <span className="font-display text-sm font-semibold text-white sm:text-base">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ServicesGrid({ data }: { data: ServicesData }) {
  const t = useTranslations("ServicesPage.Grid");
  const tIntro = useTranslations("Services.Intro");

  if (!data) return null;

  const baseRounding = "rounded-2xl lg:rounded-none";

  // ✅ FIX: Use Logical Properties (Start/End) instead of Left/Right
  const startStart = "lg:rounded-ss-[40px]"; // Top-Start (Outer Corner 1)
  const startEnd = "lg:rounded-se-[40px]"; // Top-End (Outer Corner 2)
  const endStart = "lg:rounded-es-[40px]"; // Bottom-Start (Outer Corner 3)
  const endEnd = "lg:rounded-ee-[40px]"; // Bottom-End (Outer Corner 4)

  return (
    <>
      <FadeIn className="col-span-2">
        <div className="section-padding section-style mx-auto text-center">
          <h2 className="text-jarounGray7 eyebrow-style mb-2 lg:mb-3">
            {tIntro("eyebrow")}
          </h2>
          <p className="text-jarounGray7 title-style text-4xl font-medium sm:text-5xl">
            {tIntro("title")}
          </p>
          <p className="text-jarounGray6 paragraph-style mx-auto mt-6 max-w-3xl text-center text-xl">
            {tIntro("description")}
          </p>
        </div>
      </FadeIn>
      <FadeIn
        className={clsx(
          "grid h-[800px] grid-cols-1 gap-4 pb-20 sm:h-[600px] sm:grid-cols-2 lg:h-[700px] lg:grid-cols-3",
        )}
      >
        {/* 1. Architecture (Start Item) */}
        <GridItem
          className="col-span-1 row-span-1 sm:col-span-2 lg:col-span-2"
          media={data?.architecture}
          title={t("architecture.title")}
          linkTo="architecture"
          // Uses Start-Start (Top Right in Farsi / Top Left in English)
          roundingClassName={clsx(baseRounding, startStart)}
        />

        {/* 2. Interior (End Item) */}
        <GridItem
          className="col-span-1 row-span-1 lg:col-span-1"
          media={data?.interior}
          title={t("interior.title")}
          linkTo="interior-design"
          // Uses Start-End
          roundingClassName={clsx(baseRounding, startEnd)}
        />

        {/* 3. Urban (Start Item Bottom) */}
        <GridItem
          className="col-span-1 row-span-1 lg:col-span-1"
          media={data?.urban}
          title={t("urban.title")}
          linkTo="urban-design"
          // Uses End-Start
          roundingClassName={clsx(baseRounding, endStart)}
        />

        {/* 4. Supervision (Middle) */}
        <GridItem
          className="col-span-1 row-span-1 lg:col-span-1"
          media={data?.supervision}
          title={t("supervision.title")}
          linkTo="supervision"
          // Middle items don't need outer rounding
          roundingClassName={baseRounding}
        />

        {/* 5. Restoration (End Item Bottom) */}
        <GridItem
          className="col-span-1 row-span-1 sm:col-span-2 lg:col-span-1"
          media={data?.restoration}
          title={t("restoration.title")}
          linkTo="restoration"
          // Uses End-End
          roundingClassName={clsx(baseRounding, endEnd)}
        />
      </FadeIn>
    </>
  );
}
