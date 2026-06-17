"use client";

import { SectionIntroduction } from "@/components/chegall/studio/SectionIntro";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia"; 
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/src/i18n/routing";
import { getDirection } from "@/utils/hooks/useDirection";
import type { LandingPage } from "@/src/payload-types";

export function AboutUs({ data }: { data?: LandingPage["about"] }) {
  const t = useTranslations("AboutUs");
  const locale = useLocale();
  const direction = getDirection(locale);

  return (
    <div className="section-style">
      <FadeIn className="grid grid-cols-1 gap-x-32 gap-y-16 xl:grid-cols-5">
        <SectionIntroduction
          className="sm:col-span-2"
            eyebrow={data?.eyebrow || t("eyebrow")}
            title={data?.title || t("title")}
        >
          <p className="paragraph-style-pretty text-justify">
            {data?.description || t("description")}
          </p>
          <div className="mt-6 flex justify-start text-base/7 font-semibold">
            <Link
              href="/about"
              className="text-nirvanaDarkBlue hover:text-nirvanaLightBlue rounded-full transition-colors"
            >
              {data?.learnMoreLink || t("learnMoreLink")}
              <span className="top-px ms-1" aria-hidden="true">
                {direction === "rtl" ? "›" : "›"}
              </span>
            </Link>
          </div>
        </SectionIntroduction>

        {/* ✅ Image Container */}
        <div className="relative min-h-[300px] w-full overflow-hidden rounded-[40px] bg-neutral-950 sm:col-span-2 xl:col-span-3">
          <ImageMedia
            resource={data?.image}
            fill
            // Use 'large' size if available for crispness, or 'card' for speed
            size="large" 
            imgClassName="object-cover opacity-90 transition-opacity duration-500 hover:opacity-100"
          />
          
          {/* Optional: Dark Overlay to ensure image sits nicely on black bg if transparent */}
          <div className="absolute inset-0 -z-10 bg-neutral-950" />
        </div>
      </FadeIn>
    </div>
  );
}
