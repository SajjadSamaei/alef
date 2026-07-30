"use client";

import * as React from "react";
import { Suspense } from "react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { Button, ButtonCustomColor } from "@/components/chegall/studio/Button";
import Image from "next/image";
import { Card, CardContent, BorderlessCard } from "@/components/ui/shadcn/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselControlButtons,
} from "@/components/ui/shadcn/carousel";
import { type CarouselApi } from "@/components/ui/shadcn/carousel";
import { HeroSkeleton } from "./skeletons";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale } from "@/src/i18n/i18n.config";
import { getDirection } from "@/utils/hooks/useDirection";

export function HeroCarousel() {
  const t = useTranslations("Homepage.HeroCarousel"); // 3. Get translation function
  const locale = useLocale();
  const direction = getDirection(locale);

  // 5. Create localized links
  const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
  const aboutHref = `${localePrefix}/about`;
  const kaHref = `${localePrefix}/work/ka`;
  const jarounHref = `${localePrefix}/work/jaroun`;
  const workHref = `${localePrefix}/work`;

  const autoplay = React.useRef(
    Autoplay({ delay: 8000, stopOnInteraction: true }),
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Interaction handler logic
  const handleInteraction = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      autoplay.current?.play();
    }, 7000);
  }, []);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    api.on("pointerDown", handleInteraction);
    const onSelect = () => {
      if (autoplay.current && !autoplay.current.isPlaying()) {
        handleInteraction();
      }
    };
    api.on("select", onSelect);
    return () => {
      api.off("pointerDown", handleInteraction);
      api.off("select", onSelect);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [api, handleInteraction]);

  return (
    <Suspense fallback={HeroSkeleton()}>
      <Carousel
        setApi={setApi}
        dir={direction} // 6. Use dynamic direction
        opts={{
          direction: direction, // 7. Use dynamic direction
          loop: true,
        }}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        plugins={[autoplay.current, Fade()]}
        className="w-full"
      >
        <CarouselContent>
          {/* --- Slide 1: Chegall Group --- */}
          <CarouselItem>
            <div>
              <BorderlessCard className="max-h-4/5 w-full overflow-hidden rounded-[40px] sm:max-h-[20rem] md:max-h-4/5 xl:max-h-[32rem]">
                <CardContent className="relative h-full w-full">
                  <Image
                    src="https://storage.c2.liara.space/chegall/hero/ka-lg-2.png"
                    alt={t("slide1.alt")} // Localized
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAYAAABLLYUHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nAE0AMv/AEJwnf5vk7n+tdTl/gB6lbL/rL3K/+r///8AXGJn/5qZmv+6vbr/AAEBAP9naGv/Lion/2T5HyRQ+i8hAAAAAElFTkSuQmCC"
                    width="1000"
                    height="1000"
                    className="hidden w-full object-contain xl:block xl:aspect-auto"
                  />
                  <Image
                    src="https://storage.c2.liara.space/chegall/hero/ka-md-1.png"
                    alt={t("slide1.alt")} // Localized
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AGii2YGoza/R1+j//wBfcn6LkJaprq3O1tEABAAAVlpdVlVVPjs0vDsTTo3m1hMAAAAASUVORK5CYII="
                    width="1000"
                    height="1000"
                    className="hidden w-full object-contain sm:block sm:aspect-auto xl:hidden"
                  />
                  <Image
                    src="https://storage.c2.liara.space/chegall/hero/ka-sm-2.png"
                    alt={t("slide1.alt")} // Localized
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAYAAABLLYUHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nAE0AMv/AEJwnf5vk7n+tdTl/gB6lbL/rL3K/+r///8AXGJn/5qZmv+6vbr/AAEBAP9naGv/Lion/2T5HyRQ+i8hAAAAAElFTkSuQmCC"
                    width="1800"
                    height="2400"
                    className="iphone-se:h-[70vh] iphone-x:h-[70vh] iphone-x:object-cover iphone-se:object-contain iphone-pro:object-cover iphone-pro:h-[70vh] iphone-promax:h-[70vh] w-full sm:hidden"
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-black/5 p-4 sm:bg-black/30">
                    <div className="absolute inset-0 top-[40%] -translate-y-1/2 sm:top-[50%] md:top-[55%] xl:top-[48%]">
                      <h1 className="text-appleBackgroundWhite py-2 text-center text-4xl font-semibold tracking-tight [text-wrap:balance] lg:text-5xl">
                        {t("slide1.title")}
                      </h1>
                      <p className="text-appleBackgroundWhite mt-2 text-center text-2xl text-balance">
                        {t("slide1.subtitle")}
                      </p>
                      <span className="sr-only">{t("slide1.srOnly")}</span>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Button
                          href={aboutHref} // Localized
                          aria-label={t("slide1.ariaLabel")} // Localized
                        >
                          {t("slide1.buttonText")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </BorderlessCard>
            </div>
          </CarouselItem>

          {/* --- Slide 2: Ka Building --- */}
          <CarouselItem>
            <div>
              <BorderlessCard className="max-h-4/5 w-full overflow-hidden rounded-[40px] sm:max-h-[20rem] md:max-h-4/5 xl:max-h-[32rem]">
                <CardContent className="relative h-full w-full">
                  <Image
                    src="https://storage.c2.liara.space/chegall/projects/ka/exterior/ka-exterior-3.png"
                    alt={t("slide2.alt")} // Localized
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/AAYEAElNS5+nqACqq6jt/P+UmJcAJiUf1eLnTFBOABENAKOjnBMTDkm0D6iwGfu+AAAAAElFTkSuQmCC"
                    width="1800"
                    height="1350"
                    className="hidden w-full object-contain xl:block xl:aspect-auto"
                  />
                  <Image
                    src="https://storage.c2.liara.space/chegall/hero/ka-md-2.png"
                    alt={t("slide2.alt")} // Localized
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/APP6/7/HyqOno9fg6ADHy86SkIZDPjB+fngAd3l1T0s8cGpcEgYA2oUTf/c97LUAAAAASUVORK5CYII="
                    width="2000"
                    height="1500"
                    className="hidden w-full object-contain sm:block sm:aspect-auto xl:hidden"
                  />
                  <Image
                    src="https://storage.c2.liara.space/chegall/projects/ka/interior/ka-interior-1-sm.png"
                    alt={t("slide2.alt")} // Localized
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAYAAABLLYUHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nAE0AMv/AEJwnf5vk7n+tdTl/gB6lbL/rL3K/+r///8AXGJn/5qZmv+6vbr/AAEBAP9naGv/Lion/2T5HyRQ+i8hAAAAAElFTkSuQmCC"
                    width="1800"
                    height="2400"
                    className="iphone-se:h-[70vh] iphone-x:h-[70vh] iphone-x:object-cover iphone-se:object-contain iphone-pro:object-cover iphone-pro:h-[70vh] iphone-promax:h-[70vh] w-full sm:hidden"
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-black/20 p-4 sm:bg-black/30">
                    <div className="absolute inset-0 top-[60%] -translate-y-[50%] sm:top-[50%] md:top-[55%] xl:top-[48%]">
                      <h2 className="py-2 text-center text-4xl font-bold tracking-tight [text-wrap:balance] text-white sm:font-semibold lg:text-5xl">
                        {t("slide2.title")}
                      </h2>
                      <p className="text-appleBackgroundWhite mt-2 text-center text-2xl text-balance">
                        {t("slide2.subtitle")}
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Button
                          invert={true}
                          href={kaHref} // Localized
                          aria-label={t("slide2.ariaLabel")} // Localized
                        >
                          {t("slide2.buttonText")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </BorderlessCard>
            </div>
          </CarouselItem>

          {/* --- Slide 3: Jaroun Building --- */}
          <CarouselItem>
            <div>
              <BorderlessCard className="max-h-4/5 w-full overflow-hidden rounded-[40px] sm:max-h-[20rem] md:max-h-4/5 xl:max-h-[32rem]">
                <CardContent className="relative h-full w-full">
                  <Image
                    src="https://storage.c2.liara.space/chegall/hero/jaroun-xl.png"
                    alt={t("slide3.alt")} // Localized
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AIV+eJSNin9/hcG6sp2Wk5KKh5GMkWlpd5aUlrSyrQCMhoCqo5xhX2uUkphQSE8sKjl3c3mOi46hn6C0s68An5iQ0svCnpuhx8bHmZOVjIiLxbyyopiVioaHfXh9AIyDgI6HhaOipMbGxbWrqJqBdbuqnXNrczcyQIeCggCnn5bq5dHNyb/m4tHFv7nKxLTRxblrX2l4fIj//+gAZltVVE1JaF5YdWhgdWZfeGllYlVWVUlKa11ejYF6AA0OAAEDADcyOgoAEgoAEgwAExAAEh4QGjAiKDoqL2r1ZwBJ/215AAAAAElFTkSuQmCC"
                    width="1000"
                    height="1000"
                    className="hidden w-full object-contain xl:block xl:aspect-auto"
                  />
                  <Image
                    src="https://storage.c2.liara.space/chegall/hero/jaroun-md.png"
                    alt={t("slide3.alt")} // Localized
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAL0lEQVR4nGMID/T79v5laGBwa3MLQ1ZasoebFycDk5eHF0NteeGfr68jfdyV5eQANKsOyBMmwVAAAAAASUVORK5CYII="
                    width="1000"
                    height="1000"
                    className="hidden w-full object-contain sm:block sm:aspect-auto xl:hidden"
                  />
                  <Image
                    src="https://storage.c2.liara.space/chegall/hero/jaroun-sm.png"
                    alt={t("slide3.alt")} // Localized
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJ0lEQVR4nAEcAOP/AOXf2f728ACXkY6ZkpAAr62tkoiIACMdGg4AAOwHDQY17PWqAAAAAElFTkSuQmCC"
                    width="1000"
                    height="1000"
                    className="iphone-se:h-[70vh] iphone-pro:h-[70vh] iphone-promax:h-[70vh] w-full object-cover sm:hidden"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-black/25 p-4">
                    <div className="absolute inset-0 top-[55%] -translate-y-[50%] sm:top-[50%] md:top-[55%] xl:top-[48%]">
                      <h2 className="text-jarounCard py-2 text-center text-4xl font-semibold tracking-tight [text-wrap:balance] lg:text-5xl">
                        {t("slide3.title")}
                      </h2>
                      <p className="text-jarounTitleLight mt-2 text-center text-2xl text-balance">
                        {t("slide3.subtitle")}
                      </p>
                      <span className="sr-only">{t("slide3.srOnly")}</span>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Button
                          className="bg-jarounCard text-jarounTitleLight"
                          href={jarounHref} // Localized
                          aria-label={t("slide3.ariaLabel1")} // Localized
                        >
                          {t("slide3.buttonText1")}
                        </Button>
                        <ButtonCustomColor
                          className="bg-jarounTitleLight text-neutral-950 hover:bg-neutral-200"
                          href={workHref} // Localized
                          aria-label={t("slide3.ariaLabel2")} // Localized
                        >
                          {t("slide3.buttonText2")}
                        </ButtonCustomColor>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </BorderlessCard>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselControlButtons dir={direction} />
      </Carousel>
    </Suspense>
  );
}
