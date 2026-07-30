"use client";
import Image from "next/image";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { Timeline } from "@/components/chegall/jaroun/sections/progress/progress-timeline";
// 1. Import the FUNCTION, not the static array
import { getJarounTimeline } from "@/components/chegall/jaroun/jaroun-data";
// 2. Import i18n hooks
import { useTranslations, useFormatter } from "next-intl";

export default function JarounProgress() {
  const t = useTranslations("Project.Jaroun.Progress"); // 3. Get translations
  const tData = useTranslations("Project.Jaroun.Data"); // Get translations for data
  const format = useFormatter(); // 4. Get formatter

  // 5. Get localized timeline data
  const timeline = getJarounTimeline(tData);

  return (
    <FadeIn>
      <div className="section-style section-padding">
        <div>
          <h2 className="text-jarounTitleDark eyebrow-style text-center xl:mb-2">
            {t("eyebrow")} {/* 6. Use translated text */}
          </h2>
          <p className="text-jarounGray7 title-style text-center">
            {t("title")} {/* 6. Use translated text */}
          </p>
          <p className="text-jarounGray6 section-padding paragraph-style mx-auto text-center">
            {t("description", {
              percent: format.number(75), // 7. Use formatted number
            })}
          </p>
        </div>
        <div className="bg-jarounGray1/50 mx-auto flex max-w-4xl items-center justify-center rounded-3xl px-5 py-10 ring-1 ring-gray-900/5 ring-inset">
          <Image
            width="1544"
            height="1080"
            alt={t("imageAlt")} // 6. Use translated text
            placeholder="blur"
            className="md:max-w-lg"
            src="https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/building-concept.png"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAYAAAAxrNxjAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA3klEQVR4nAGWAGn/AI/O56vX7M7s9Z/C1IavxLjf72K53QCRygDY7fT4/v7U4egpS10xUGHE1dvV7fZxvd8A////1uHlPl1tAA8bAAQVRF5pzdvfz+v1AObp7UhebA4XHC03OwokMgAPGEJZZM7d4QBYZ3MfIic+Q0NBTFARM0IbLzsABxM9T1oAFyQsPUFDSVBQQk5RBTNFFC06IDA6AAcWsWZCW2yZ1Q4AAAAASUVORK5CYII="
          />
        </div>

        <div className="section-padding" />
        <Timeline events={timeline} />
      </div>
    </FadeIn>
  );
}
