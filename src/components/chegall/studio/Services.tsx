"use client";

import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { CardContent, SharpCard } from "@/components/ui/shadcn/card";
import Image from "next/image";
import { BeforeAfter } from "@/components/chegall/beforeAfter";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl"; // Import i18n hooks
import { Link } from "@/src/i18n/routing"; // Import locale-aware Link
import { getDirection } from "@/utils/hooks/useDirection";

export function Services() {
  const t = useTranslations("Services.Intro"); // Get translations for the 'Intro' section

  return (
    <>
      <FadeIn className="col-span-2">
        <div className="section-padding section-style mx-auto text-center">
          <h2 className="text-jarounGray7 eyebrow-style mb-2 lg:mb-3">
            {t("eyebrow")}
          </h2>
          <p className="text-jarounGray7 title-style text-4xl font-medium sm:text-5xl">
            {t("title")}
          </p>
          <p className="text-jarounGray6 paragraph-style mx-auto mt-6 max-w-3xl text-center text-xl">
            {t("description")}
          </p>
        </div>
      </FadeIn>

      <ServicesGrid />
      <div className="section-padding" />
    </>
  );
}

function ServicesGrid() {
  const t = useTranslations("Services.Grid"); // Get translations for the 'Grid' section
  const locale = useLocale();
  const direction = getDirection(locale);

  return (
    <div className="section-style">
      <FadeIn className="grid gap-16 sm:grid-cols-2 sm:grid-rows-6 sm:gap-1.5 xl:grid-cols-4 xl:grid-rows-3">
        {/* --- Management Card --- */}
        <SharpCard
          className={clsx(
            "sm:col-span-2 sm:col-start-1 sm:row-span-1 xl:col-start-2",
            "w-full overflow-hidden sm:rounded-t-[40px] xl:rounded-none",
          )}
        >
          <CardContent className="relative w-full">
            <Image
              src="https://storage.c2.liara.space/chegall/hero/services/management.jpg"
              alt={t("management.alt")}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVR4nAEaAOX/APD5/56lp6GmprvEzgDU2NhWU0oPCQCNjozaKw5DgP6F5wAAAABJRU5ErkJggg=="
              width="1000"
              height="667"
              className="hidden w-full rounded-[40px] object-contain grayscale-[40%] sm:block sm:rounded-none sm:grayscale-50"
            />
            <Image
              src="https://storage.c2.liara.space/chegall/hero/services/management-2.jpg"
              alt={t("management.alt")}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAI0lEQVR4nGM4e+pEU3VpTmbavz+/GfbtPRQUGMzKzPLiySMAv+EN75Mv4DoAAAAASUVORK5CYII="
              width="1000"
              height="667"
              className="w-full rounded-[40px] object-contain grayscale-[40%] sm:hidden sm:rounded-none sm:grayscale-50"
            />
            <div className="from-100 relative inset-0 flex flex-col items-center justify-center p-4 sm:absolute sm:bg-linear-to-t sm:from-black/80 sm:to-80%">
              <div
                className={clsx(
                  "relative flex items-center justify-center",
                  "sm:absolute sm:bottom-5",
                  direction === "rtl" && "sm:right-8",
                  direction === "ltr" && "sm:left-8",
                )}
              >
                <div className="flex flex-col gap-2 sm:max-w-[8rem]">
                  <p className="sm:text-appleBackgroundWhite text-center text-2xl font-semibold tracking-tight text-nowrap text-black sm:text-start lg:text-3xl">
                    {t("management.title")}
                  </p>
                  <p className="text-appleBackgroundWhite hidden text-base font-light tracking-tight text-nowrap sm:block lg:text-sm">
                    {t("management.subtitle")}
                  </p>
                  <p className="mt-2 text-center text-base font-light tracking-tight text-neutral-800 sm:hidden lg:text-sm">
                    {t("management.description")}
                  </p>
                  <Link
                    href="/services#project-management"
                    className="hover:text-nirvanaLightBlue text-nirvanaDarkBlue mt-4 rounded-full text-center text-base/7 font-medium transition-colors duration-400 sm:mt-0 sm:bg-transparent sm:text-start sm:font-normal sm:text-white"
                  >
                    {t("learnMore")}
                    <span className="top-px ms-1" aria-hidden="true">
                      {direction === "rtl" ? "›" : "›"}
                    
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </SharpCard>

        {/* --- Architecture Card --- */}
        <SharpCard
          className={clsx(
            "sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-3 xl:col-start-4 xl:row-start-1",
            "w-full overflow-hidden sm:bg-black",
            direction === "rtl" && "xl:rounded-tl-[40px]",
            direction !== "rtl" && "xl:rounded-tr-[40px]",
          )}
        >
          <CardContent className="relative w-full">
            <Image
              src="https://storage.c2.liara.space/chegall/hero/services/design.jpg"
              alt={t("architecture.alt")}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVR4nGMIK5vuEl/L8Pr1S24xeYb/Pz8wsIgzvHx8h5VfEgCnEQtbLUdBJAAAAABJRU5ErkJggg=="
              width="1000"
              height="667"
              className="hidden w-full rounded-[40px] object-contain grayscale-[40%] sm:block sm:rounded-none sm:grayscale-50"
            />
            <Image
              src="https://storage.c2.liara.space/chegall/hero/services/design-2.jpg"
              alt={t("architecture.alt")}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVR4nAEaAOX/AHCn0r7L0MXO0r3v/wC03/8SEAMpJh2v2PzVrg7579qSzAAAAABJRU5ErkJggg=="
              width="1000"
              height="667"
              className="w-full rounded-[40px] object-contain grayscale-[40%] sm:hidden sm:rounded-none sm:grayscale-50"
            />
            <div className="from-100 relative inset-0 flex flex-col items-center justify-center p-4 sm:absolute sm:bg-linear-to-t sm:from-black sm:to-80%">
              <div
                className={clsx(
                  "relative flex items-center justify-center",
                  "sm:absolute sm:bottom-5",
                  direction === "rtl" && "sm:right-8",
                  direction === "ltr" && "sm:left-8",
                )}
              >
                <div className="flex flex-col gap-2 sm:max-w-[8rem]">
                  <p className="sm:text-appleBackgroundWhite text-center text-2xl font-semibold tracking-tight text-nowrap text-black sm:text-start lg:text-3xl">
                    {t("architecture.title")}
                  </p>
                  <p className="text-appleBackgroundWhite hidden text-base font-light tracking-tight sm:block lg:text-sm">
                    {t("architecture.subtitle")}
                  </p>
                  <p className="mt-2 text-center text-base font-light tracking-tight text-neutral-800 sm:hidden lg:text-sm">
                    {t("architecture.description")}
                  </p>
                  <Link
                    href="/services#architecture"
                    className="hover:text-nirvanaLightBlue text-nirvanaDarkBlue mt-4 rounded-full text-center text-base/7 font-medium transition-colors duration-400 sm:mt-0 sm:bg-transparent sm:text-start sm:font-normal sm:text-white"
                  >
                    {t("learnMore")}
                    <span className="top-px ms-1" aria-hidden="true">
                      {direction === "rtl" ? "›" : "›"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </SharpCard>

        {/* --- Consultation Card --- */}
        <SharpCard
          className={clsx(
            "sm:col-span-2 sm:col-start-1 sm:row-span-1 sm:row-start-5 xl:col-start-3 xl:row-start-3",
            "w-full overflow-hidden",
            direction === "rtl" && "xl:rounded-bl-[40px]",
            direction !== "rtl" && "xl:rounded-br-[40px]",
          )}
        >
          <CardContent className="relative w-full">
            <Image
              src="https://storage.c2.liara.space/chegall/hero/services/consultation.jpg"
              alt={t("consultation.alt")}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAI0lEQVR4nGN4+eJZZkKCBBvDtPYKhn+/PzZWlEkzMrSXJAMAow8LaeQ9Ab8AAAAASUVORK5CYII="
              width="1000"
              height="667"
              className="hidden w-full rounded-[40px] object-contain grayscale-[40%] sm:block sm:rounded-none sm:grayscale-50"
            />
            <Image
              src="https://storage.c2.liara.space/chegall/hero/services/consultation-2.jpg"
              alt={t("consultation.alt")}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAI0lEQVR4nGMQExNUlJNsa6zauGgKg7iYIC8Tw7l96/5/ewAAWRsJWkwiCIgAAAAASUVORK5CYII="
              width="1000"
              height="667"
              className="w-full rounded-[40px] object-contain grayscale-[40%] sm:hidden sm:rounded-none sm:grayscale-50"
            />
            <div className="from-100 relative inset-0 flex flex-col items-center justify-center p-4 sm:absolute sm:bg-linear-to-t sm:from-black/80 sm:to-80%">
              <div
                className={clsx(
                  "relative flex items-center justify-center",
                  "sm:absolute sm:bottom-5",
                  direction === "rtl" && "sm:right-8",
                  direction === "ltr" && "sm:left-8",
                )}
              >
                <div className="flex flex-col gap-2 sm:max-w-[8rem]">
                  <p className="sm:text-appleBackgroundWhite text-center text-2xl font-semibold tracking-tight text-nowrap text-black sm:text-start lg:text-3xl">
                    {t("consultation.title")}
                  </p>
                  <p className="text-appleBackgroundWhite hidden text-base font-light tracking-tight text-nowrap sm:block lg:text-sm">
                    {t("consultation.subtitle")}
                  </p>
                  <p className="mt-2 text-center text-base font-light tracking-tight text-neutral-800 sm:hidden lg:text-sm">
                    {t("consultation.description")}
                  </p>
                  <Link
                    href="/services#consultation"
                    className="hover:text-nirvanaLightBlue text-nirvanaDarkBlue mt-4 rounded-full text-center text-base/7 font-medium transition-colors duration-400 sm:mt-0 sm:bg-transparent sm:text-start sm:font-normal sm:text-white"
                  >
                    {t("learnMore")}
                    <span className="top-px ms-1" aria-hidden="true">
                      {direction === "rtl" ? "›" : "›"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </SharpCard>

        {/* --- Renovation Card --- */}
        <SharpCard
          className={clsx(
            "sm:col-span-2 sm:col-start-1 sm:row-span-1 sm:row-start-6 xl:row-start-3",
            "w-full overflow-hidden sm:rounded-b-[40px]",
            direction === "rtl" && "xl:rounded-br-[40px] xl:rounded-bl-none",
            direction !== "rtl" && "xl:rounded-br-none xl:rounded-bl-[40px]",
          )}
        >
          <CardContent className="relative w-full">
            <Image
              src="https://storage.c2.liara.space/chegall/hero/services/renovation.jpg"
              alt={t("renovation.alt")}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVR4nAEaAOX/ALKvrRcEAOLi5fv+/wCppqQPAgDT09b5/P+4eA8/iLINYgAAAABJRU5ErkJggg=="
              width="1000"
              height="667"
              className="hidden w-full rounded-[40px] object-contain grayscale-[40%] sm:block sm:rounded-none sm:grayscale-50"
            />
            <BeforeAfter
              className="sm:hidden"
              aspect="aspect-[7/4]"
              beforeImage="https://storage.c2.liara.space/chegall/projects/gereh/before-after/2-1/before.png"
              afterImage="https://storage.c2.liara.space/chegall/projects/gereh/before-after/2-1/after.png"
              afterImageBlurData="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAACXBIWXMAADXUAAA11AFeZeUIAAAALUlEQVR4nAEiAN3/APL7+/8lHRT/LyQa/+Hh5P8A6O7u/wYBAP8UDgX/3Nzc/1QME9BX8lKIAAAAAElFTkSuQmCC"
              beforeImageBlurData="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAACXBIWXMAADXUAAA11AFeZeUIAAAALUlEQVR4nAEiAN3/APTiuf82LRf/LSUQ///xx/8A9OG2/xADAP8XDgD///bN/0vuE6Bk140PAAAAAElFTkSuQmCC"
              beforeAlt={t("renovation.beforeAlt")}
              afterAlt={t("renovation.afterAlt")}
            />
            <div className="from-100 relative inset-0 flex flex-col items-center justify-center p-4 sm:absolute sm:bg-linear-to-t sm:from-black/80 sm:to-80%">
              <div
                className={clsx(
                  "relative flex items-center justify-center",
                  "sm:absolute sm:bottom-5",
                  direction === "rtl" && "sm:right-8",
                  direction === "ltr" && "sm:left-8",
                )}
              >
                <div className="flex flex-col gap-2 sm:max-w-[8rem]">
                  <p className="sm:text-appleBackgroundWhite text-center text-2xl font-semibold tracking-tight text-nowrap text-black sm:text-start lg:text-3xl">
                    {t("renovation.title")}
                  </p>
                  <p className="text-appleBackgroundWhite hidden text-base font-light tracking-tight text-nowrap sm:block lg:text-sm">
                    {t("renovation.subtitle")}
                  </p>
                  <p className="mt-2 text-center text-base font-light tracking-tight text-neutral-800 sm:hidden lg:text-sm">
                    {t("renovation.description")}
                  </p>
                  <Link
                    href="/services#renovation"
                    className="hover:text-nirvanaLightBlue text-nirvanaDarkBlue mt-4 rounded-full text-center text-base/7 font-medium transition-colors duration-400 sm:mt-0 sm:bg-transparent sm:text-start sm:font-normal sm:text-white"
                  >
                    {t("learnMore")}
                    <span className="top-px ms-1" aria-hidden="true">
                      {direction === "rtl" ? "›" : "›"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </SharpCard>

        {/* --- Branding Card --- */}
        <SharpCard
          className={clsx(
            "sm:col-span-1 sm:col-start-1 sm:row-span-2 sm:row-start-3 xl:col-start-1 xl:row-start-1",
            "w-full overflow-hidden sm:bg-black",
            direction === "rtl" && "xl:rounded-tr-[40px]",
            direction !== "rtl" && "xl:rounded-tl-[40px]",
          )}
        >
          <CardContent className="relative w-full">
            <Image
              src="https://storage.c2.liara.space/chegall/hero/services/branding.jpg"
              alt={t("branding.alt")}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVR4nGNYMX9OQ3UdQ0dzR0l2LsP/f5+e3zjJIMUrKMzICQDBUwwIKTlfCwAAAABJRU5ErkJggg=="
              width="1000"
              height="667"
              className="hidden w-full rounded-[40px] object-contain grayscale-[40%] sm:block sm:rounded-none sm:grayscale-50"
            />
            <Image
              src="https://storage.c2.liara.space/chegall/hero/services/branding-2.jpg"
              alt={t("branding.alt")}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAI0lEQVR4nGN4/eJZZkKCBBvDtPYKhn+/PzZWlEkzMrSXJAMAow8LaeQ9Ab8AAAAASUVORK5CYII="
              width="1000"
              height="667"
              className="w-full rounded-[40px] object-contain grayscale-[40%] sm:hidden sm:rounded-none sm:grayscale-50"
            />
            <div className="from-100 relative inset-0 flex flex-col items-center justify-center p-4 sm:absolute sm:bg-linear-to-t sm:from-black sm:to-80%">
              <div
                className={clsx(
                  "relative flex items-center justify-center",
                  "sm:absolute sm:bottom-5",
                  direction === "rtl" && "sm:right-8",
                  direction === "ltr" && "sm:left-8",
                )}
              >
                <div className="flex flex-col gap-2 sm:max-w-[8rem]">
                  <p className="sm:text-appleBackgroundWhite text-center text-2xl font-semibold tracking-tight text-nowrap text-black sm:text-start lg:text-3xl">
                    {t("branding.title")}
                  </p>
                  <p className="text-appleBackgroundWhite hidden text-base font-light tracking-tight text-nowrap sm:block lg:text-sm">
                    {t("branding.subtitle")}
                  </p>
                  <p className="mt-2 text-center text-base font-light tracking-tight text-neutral-800 sm:hidden lg:text-sm">
                    {t("branding.description")}
                  </p>
                  <Link
                    href="/services#branding"
                    className="hover:text-nirvanaLightBlue text-nirvanaDarkBlue mt-4 rounded-full text-center text-base/7 font-medium transition-colors duration-400 sm:mt-0 sm:bg-transparent sm:text-start sm:font-normal sm:text-white"
                  >
                    {t("learnMore")}
                    <span className="top-px ms-1" aria-hidden="true">
                      {direction === "rtl" ? "›" : "›"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </SharpCard>

        {/* --- Investment Card --- */}
        <SharpCard
          className={clsx(
            "sm:col-span-2 sm:col-start-1 sm:row-span-1 sm:row-start-2 xl:col-start-2",
            "w-full overflow-hidden",
          )}
        >
          <CardContent className="relative w-full">
            <Image
              src="https://storage.c2.liara.space/chegall/hero/services/investment.jpg"
              alt={t("investment.alt")}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJUlEQVR4nAEaAOX/AOfn5jw8POzq6vz7+wDFxcUKCxDp6Ofv7u7bKBESTtrbxQAAAABJRU5ErkJggg=="
              width="1000"
              height="667"
              className="hidden w-full rounded-[40px] object-contain grayscale-[40%] sm:block sm:rounded-none sm:grayscale-50"
            />
            <Image
              src="https://storage.c2.liara.space/chegall/hero/services/investment-2.jpg"
              alt={t("investment.alt")}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAI0lEQVR4nGM4e+pEU3VpTmbavz+/GfbtPRQUGMzKzPLiySMAv+EN75Mv4DoAAAAASUVORK5CYII="
              width="1000"
              height="667"
              className="w-full rounded-[40px] object-contain grayscale-[40%] sm:hidden sm:rounded-none sm:grayscale-50"
            />
            <div className="from-100 relative inset-0 flex flex-col items-center justify-center p-4 sm:absolute sm:bg-linear-to-t sm:from-black/80 sm:to-80%">
              <div
                className={clsx(
                  "relative flex items-center justify-center",
                  "sm:absolute sm:bottom-5",
                  direction === "rtl" && "sm:right-8",
                  direction === "ltr" && "sm:left-8",
                )}
              >
                <div className="flex flex-col gap-2 sm:max-w-[8rem]">
                  <p className="sm:text-appleBackgroundWhite text-center text-2xl font-semibold tracking-tight text-nowrap text-black sm:text-start lg:text-3xl">
                    {t("investment.title")}
                  </p>
                  <p className="text-appleBackgroundWhite hidden text-base font-light tracking-tight text-nowrap sm:block lg:text-sm">
                    {t("investment.subtitle")}
                  </p>
                  <p className="mt-2 text-center text-base font-light tracking-tight text-neutral-800 sm:hidden lg:text-sm">
                    {t("investment.description")}
                  </p>
                  <Link
                    href="/services#investment"
                    className="hover:text-nirvanaLightBlue text-nirvanaDarkBlue mt-4 rounded-full text-center text-base/7 font-medium transition-colors duration-400 sm:mt-0 sm:bg-transparent sm:text-start sm:font-normal sm:text-white"
                  >
                    {t("learnMore")}
                    <span className="top-px ms-1" aria-hidden="true">
                      {direction === "rtl" ? "›" : "›"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </SharpCard>
      </FadeIn>
    </div>
  );
}
