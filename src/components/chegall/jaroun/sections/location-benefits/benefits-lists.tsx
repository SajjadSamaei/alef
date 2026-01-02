"use client";
import { useState, Suspense } from "react";
import LocationBenefitsMap from "@/components/chegall/jaroun/maps/location-benefits/jaroun-map-big";
import clsx from "clsx";
// 1. Import the FUNCTION, not the static array
import { getLocationBenefits } from "@/components/chegall/jaroun/jaroun-data";
// 2. Import i18n hooks
import { useTranslations } from "next-intl";

export function LocationBenefitsListMap() {
  const t = useTranslations("Project.Jaroun.Location"); // 3. Get translations
  const tJaroun = useTranslations("Project.Jaroun"); // 3. Get translations
  const tData = useTranslations("Project.Jaroun.Data");
  // 4. Get localized data by calling the function
  // We pass 't.raw' which returns the 'Data.location' object
  const locationBenefits = getLocationBenefits(tData);

  const [visibleCount, setVisibleCount] = useState(3);

  // Function to toggle visibility
  const toggleVisibleCount = () => {
    setVisibleCount((prevCount) =>
      prevCount === 3 ? locationBenefits.length : 3,
    );
  };

  return (
    <div
      className={clsx(
        "bg-jarounGray1 shadow-jarounGray7/30 grid items-center justify-center overflow-hidden rounded-3xl shadow-xs xl:flex xl:bg-transparent",
      )}
    >
      <div
        id="map-2"
        className={clsx(
          "bg-jarounTitleDark relative mx-auto overflow-hidden",
          "iphone-pro:h-[21rem] iphone-pro:w-[21rem] google-pixel:w-[22rem] google-pixel:h-[22rem] iphone-promax:h-[23rem] iphone-promax:w-[23rem] iphone-16-promax:w-[24rem] aspect-4/5 h-80 w-80",
          "sm:w-[42rem] md:aspect-5/4 md:w-4xl lg:mx-0",
          "xl:aspect-square xl:h-full xl:max-w-none xl:rounded-3xl xl:shadow-2xs xl:ring-1 xl:ring-black/5",
        )}
      >
        <div className="absolute inset-0">
          <Suspense fallback={<div>{t("loadingMap")}</div>}>
            {" "}
            {/* 5. Localized text */}
            <LocationBenefitsMap />
          </Suspense>
        </div>
      </div>
      <div className="section-style xl:hidden">
        <dl
          className={clsx(
            "text-jarounGray6 subsection-padding max-w-xl space-y-6 text-base leading-7 lg:grid lg:max-w-none lg:grid-cols-3",
          )}
        >
          {locationBenefits.slice(0, visibleCount).map((benefit) => (
            // 6. Use logical padding 'ps-9'
            <div key={benefit.name} className="relative ps-9">
              <dt className="text-jarounVeryDark inline align-top">
                <benefit.icon
                  color={benefit.iconBG}
                  // 7. Use logical position 'start-1'
                  className={`absolute start-1 top-1.5 h-5 w-5`}
                  aria-hidden="true"
                />
                <p className="sub-paragraph-style">
                  {benefit.name} {/* 8. Render localized name directly */}
                </p>
              </dt>
            </div>
          ))}
        </dl>
        {/* Load More / Show Less Button */}
        {locationBenefits.length > 3 && (
          <div className="mb-4 flex items-center justify-start">
            <button
              onClick={toggleVisibleCount}
              className="bg-jarounBurgundy hover:bg-jarounBurgundyHover mt-4 rounded-full px-4 py-2 text-sm font-medium text-white"
            >
              {/* 9. Localized button text */}
              {visibleCount === 3 ? t("showMore") : t("showLess")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
