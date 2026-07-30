"use client";

import {
  StatList,
  StatListItem,
  StatListItemWithSub,
} from "@/components/chegall/studio/StatList";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { useTranslations, useFormatter } from "next-intl"; // 1. Import hooks

export default function JarounAbout() {
  const t = useTranslations("Project.Jaroun.About"); // 2. Get translation function
  const format = useFormatter(); // 3. Get number formatter

  return (
    <FadeIn>
      <div className="section-style section-padding">
        <div className="text-center">
          <h2 className="text-jarounGray7 iphone-promax:text-4xl text-3xl font-bold tracking-tight lg:text-5xl">
            {t("title")} {/* 4. Use translated text */}
          </h2>
          <p className="text-jarounGray6 paragraph-style subsection-padding mx-auto max-w-xl text-center md:max-w-5xl">
            {t("description")} {/* 4. Use translated text */}
          </p>
          {/* <span className="sr-only"> ... </span> */}
        </div>
        <FadeIn>
          <StatList
            bgColor="bg-jarounGray7"
            className="section-padding max-w-none!"
          >
            {/* 5. Use formatter and translation keys for stats */}
            <StatListItem
              textColor="text-white"
              textAccentColor="text-jarounLight"
              value={t("stats.floors.value", {
                count: 7,
                formattedCount: format.number(7),
              })}
              label={t("stats.floors.label")}
            />
            <StatListItem
              textColor="text-white"
              textAccentColor="text-jarounLight"
              value={t("stats.units.value", {
                count: 77,
                formattedCount: format.number(77),
              })}
              label={t("stats.units.label")}
            />
            <StatListItemWithSub
              textColor="text-white"
              textAccentColor="text-jarounLight"
              value={format.number(10800)}
              sub={t("stats.area.sub")}
              label={t("stats.area.label")}
            />
            <StatListItem
              textColor="text-white"
              textAccentColor="text-jarounLight"
              value={t("stats.types.value", {
                count: 6,
                formattedCount: format.number(6),
              })}
              label={t("stats.types.label")}
            />
            <StatListItem
              textColor="text-white"
              textAccentColor="text-jarounLight"
              value={t("stats.timeline.value")}
              label={t("stats.timeline.label")}
            />
          </StatList>
        </FadeIn>
      </div>
    </FadeIn>
  );
}
