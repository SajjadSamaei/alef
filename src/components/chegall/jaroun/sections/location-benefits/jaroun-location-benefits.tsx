"use client";
import { LocationBenefitsListMap } from "@/components/chegall/jaroun/sections/location-benefits/benefits-lists";
import JarounLouvre from "@/components/chegall/jaroun/ui/jaroun-louvre";
import clsx from "clsx";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
// 1. Import the FUNCTION, not the static array
import { getLocationBenefits } from "@/components/chegall/jaroun/jaroun-data";
// 2. Import i18n hooks
import { useTranslations, useLocale, useFormatter } from "next-intl";

export default function JarounLocationBenefits() {
  const t = useTranslations("Project.Jaroun.Location"); // 3. Get translations for this component
  const tData = useTranslations("Project.Jaroun.Data"); // 4. Get translations for the data

  // 5. Call the function to get localized data
  const locationBenefits = getLocationBenefits(tData);

  return (
    <>
      <FadeIn className="section-padding section-style">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 xl:grid-cols-2 xl:items-start xl:gap-y-0">
          <div className="xl:row-span-1">
            <h2 className="eyebrow-style text-jarounTitleDark xl:mb-2">
              {t("eyebrow")} {/* 6. Use translated text */}
            </h2>
            <p className="title-style text-jarounGray7">
              {t("title")} {/* 6. Use translated text */}
            </p>
            <p className="paragraph-style-pretty subsection-padding text-jarounGray6">
              {t("description")} {/* 6. Use translated text */}
            </p>
            <dl
              className={clsx(
                "text-jarounGray6 subsection-padding hidden max-w-xl space-y-6 text-base leading-7 lg:max-w-none xl:block",
              )}
            >
              {locationBenefits.map((benefit) => (
                // 7. Use logical padding 'ps-9' (padding-start)
                <div key={benefit.name} className="relative ps-9">
                  <dt className="text-jarounVeryDark inline align-top">
                    <benefit.icon
                      color={benefit.iconBG}
                      // 8. Use logical position 'start-1'
                      className={`absolute start-1 top-1.5 h-5 w-5`}
                      aria-hidden="true"
                    />
                    <p className="sub-paragraph-style">
                      {benefit.name} {/* 9. Render localized name directly */}
                    </p>
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          <LocationBenefitsListMap />
        </div>
      </FadeIn>
      <div className="subsection-padding xl:hidden" />
      <JarounLouvre src="https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/louvre-2.png" />
    </>
  );
}
