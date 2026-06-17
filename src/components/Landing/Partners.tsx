"use client";

import { WordRotate } from "@/components/ui/magicui/word-rotate";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import { GradientComponent } from "@/components/chegall/radient/gradient"; // ✅ Import Gradient
import { GridPattern } from "@/components/chegall/studio/GridPattern"; // ✅ Optional: Adds texture
import { useTranslations } from "next-intl";
import type { LandingPage } from "@/src/payload-types";
import clsx from "clsx";

/* -------------------------------------------------------------------------- */
/* MANTRAS                                                                    */
/* -------------------------------------------------------------------------- */

export function Mantras() {
  const t = useTranslations("Partners.Mantras");

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <p className="font-display text-center text-lg font-medium text-neutral-400">
        {t("title")}
      </p>
      <div className="rounded-full border border-white/10 bg-white/5 px-6 py-2 backdrop-blur-md">
        <WordRotate
          className="font-display text-center text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl dark:text-white"
          words={t.raw("texts") as string[]}
          duration={4000}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PARTNERS SECTION                                                           */
/* -------------------------------------------------------------------------- */

export function Partners({
  data,
  title,
}: {
  data: LandingPage["partners"];
  title?: string | null;
}) {
  const t = useTranslations("Partners");

  if (!data || data.length === 0) return null;

  return (
    <div className="relative mt-20 overflow-hidden py-24 sm:mb-20 sm:rounded-[40px] sm:py-32">
      {/* 1. Background Layer (Matches Hero) */}
      <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-950" />

      {/* 2. Gradient Glow */}
      <GradientComponent
        variant="earth" // or 'cool' depending on your pref
        className="absolute inset-2 rounded-[32px] opacity-40 mix-blend-normal dark:opacity-20"
      />

      {/* 3. Grid Pattern (Optional Texture) */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]">
        <GridPattern
          className="absolute inset-0 h-full w-full fill-neutral-950 stroke-neutral-950 dark:fill-white dark:stroke-white"
          interactive
        />
      </div>

      <Container className="relative z-10">
        {/* Header / Divider */}
        <FadeIn className="mb-12 flex flex-col items-center gap-6 sm:flex-row">
          {/* <Mantras /> */}

          <h2 className="font-display text-sm font-bold tracking-widest text-nowrap text-neutral-500 uppercase sm:text-start dark:text-neutral-400">
            {title || t("title")}
          </h2>
        </FadeIn>

        {/* Logo Grid */}
        <FadeInStagger faster>
          <ul
            role="list"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {data.map((client) => (
              <li key={client.id}>
                <FadeIn className="h-full">
                  <a
                    href={client.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                      "group relative flex aspect-[3/2] h-full w-full items-center justify-center overflow-hidden",
                      // Glass Card Style
                      "rounded-3xl border border-neutral-200 bg-white/40 shadow-sm backdrop-blur-sm",
                      "transition-all duration-300 ease-out",
                      "hover:-translate-y-1 hover:border-neutral-300 hover:bg-white/60 hover:shadow-lg hover:shadow-neutral-900/5",
                      // Dark Mode Overrides
                      "dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10 dark:hover:bg-white/[0.05] dark:hover:shadow-white/5",
                    )}
                  >
                    {/* Logo Container */}
                    <div className="relative p-8 transition-transform duration-500 ease-out group-hover:scale-110">
                      <ImageMedia
                        resource={client.logo}
                        imgSize="thumbnail"
                        imgClassName={clsx(
                          "h-full w-full object-cover transition-opacity duration-300",
                        )}
                      />
                    </div>

                    <span className="sr-only">{client.title}</span>
                  </a>
                </FadeIn>
              </li>
            ))}
          </ul>
        </FadeInStagger>
      </Container>
    </div>
  );
}
