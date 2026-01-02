"use client";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { IntroVideo } from "@/components/chegall/jaroun/ui/jaroun-interactive-video";
import { ApartTiers } from "@/components/chegall/jaroun/sections/units-level-map/jaroun-units";
import { LevelMap } from "@/components/chegall/jaroun/sections/units-level-map/level-map";
import { useTranslations } from "next-intl"; // 1. Import the hook

export default function JarounLevel() {
  const t = useTranslations("Project.Jaroun.Level"); // 2. Get translations

  return (
    <FadeIn className="bg-jarounBlack">
      <IntroVideo />
      <div className="section-padding">
        <div className="section-style text-center">
          <h2 className="text-jarounTitleDark eyebrow-style">
            {t("eyebrow")} {/* 3. Use translated text */}
          </h2>
          <p className="text-jarounTitleLight title-style">
            {t("title")} {/* 3. Use translated text */}
          </p>
        </div>
        <p className="text-jarounGray2 section-style section-padding paragraph-style text-center xl:line-clamp-3">
          {t("description")} {/* 3. Use translated text */}
        </p>
        <div className="subsection-padding">
          <h3 className="text-jarounTitleLight subtitle-style subsection-padding section-style">
            {t("subtitle")} {/* 3. Use translated text */}
          </h3>
          {/* These components are already localized from previous steps */}
          <ApartTiers />
        </div>
      </div>
      <div>
        {/* This component is already localized from previous steps */}
        <LevelMap />
      </div>
    </FadeIn>
  );
}
