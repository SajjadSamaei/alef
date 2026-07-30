"use client";

import clsx from "clsx";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { GridPattern } from "@/components/chegall/studio/GridPattern";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import { useLocale, useTranslations } from "next-intl";
import type { LandingPage } from "@/src/payload-types";

export function Testimonial({ data }: { data: LandingPage["testimonial"] }) {
  const t = useTranslations("Testimonial");
  const locale = useLocale();

  return (
    <div className="relative isolate bg-neutral-50 py-16 sm:py-24 lg:py-28">
      <GridPattern className="absolute inset-0 -z-10 h-full w-full [mask-image:linear-gradient(to_bottom_left,white_50%,transparent_60%)] fill-neutral-100 stroke-neutral-950/5" />
      <Container>
        <FadeIn>
          <figure className="mx-auto max-w-4xl">
            <blockquote className="font-display relative text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl">
              <p
                className={clsx(
                  "text-center text-neutral-950 xl:line-clamp-3",
                  locale === "fa"
                    ? "before:content-['«'] after:content-['»']"
                    : "before:content-['“'] after:content-['”']",
                )}
              >
                {data?.quote || t("quote")}
              </p>
            </blockquote>
            <figcaption className="mx-auto mt-10 flex max-w-72 items-center justify-center gap-x-4">
              <div className="relative h-14 w-14 flex-none overflow-hidden rounded-md bg-neutral-100 ring-1 ring-neutral-200/50 sm:h-16 sm:w-16">
                <ImageMedia
                  resource={data?.authorImage}
                  imgSize="square"
                  fill
                  imgClassName="object-cover"
                />
              </div>

              <div className="text-start">
                <h3 className="text-base/7 font-semibold tracking-tight text-neutral-950">
                  {data?.authorName || t("author.name")}
                </h3>
                <p className="text-appletextgray text-sm/6 font-semibold text-nowrap">
                  {data?.authorRole || t("author.role")}
                </p>
              </div>
            </figcaption>
          </figure>
        </FadeIn>
      </Container>
    </div>
  );
}
