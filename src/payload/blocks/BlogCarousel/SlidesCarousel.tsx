"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { type UseEmblaCarouselType } from "embla-carousel-react";
import { ImageMedia } from "@/components/Blog/Media/BlogMedia/ImageMedia";
import type { BlogMedia as MediaType } from "@/src/payload-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/shadcn/carousel";
import { CardContent } from "@/components/ui/shadcn/card";
import { useLocale, useFormatter } from "next-intl";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { englishToPersianDigits } from "@/utils/helpers/strings-numbers";

// Types
type ImageItem = {
  image: MediaType;
  caption?: string;
};

type CarouselApi = UseEmblaCarouselType[1];
type SlideCount = 1 | 2 | 3 | 4 | 5 | 6;

export type SlidesCarouselProps = {
  className?: string;
  images: ImageItem[];
  slidesToShow?: {
    base: SlideCount;
    sm?: SlideCount;
    md?: SlideCount;
    lg?: SlideCount;
    xl?: SlideCount;
  };
  spacing?: 4 | 8 | 12 | 16;
  controllerBgColor?: string;
  controllerHoverColor?: string;
  controllerTextColor?: string;
};

export function SlidesCarousel({
  className = "",
  images,
  slidesToShow: slidesProp,
  spacing = 4,
}: SlidesCarouselProps) {
  const locale = useLocale();
  const direction = locale === "fa" ? "rtl" : "ltr";
  const isRtl = direction === "rtl";
  const formatter = useFormatter();

  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const [api, setApi] = useState<CarouselApi | undefined>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  const handlePrev = useCallback(() => api?.scrollPrev(), [api]);
  const handleNext = useCallback(() => api?.scrollNext(), [api]);

  const formatNumber = (num: number) => {
    return isRtl ? englishToPersianDigits(num) : formatter.number(num);
  };

  const slidesToShow = { base: 1, ...slidesProp };
  const itemClassName = clsx(
    {
      "pl-4": spacing === 4,
      "pl-8": spacing === 8,
      "pl-12": spacing === 12,
      "pl-16": spacing === 16,
    },
    {
      "basis-full": slidesToShow.base === 1,
      "basis-1/2": slidesToShow.base === 2,
      "basis-1/3": slidesToShow.base === 3,
    },
    {
      "sm:basis-full": slidesToShow.sm === 1,
      "sm:basis-1/2": slidesToShow.sm === 2,
      "sm:basis-1/3": slidesToShow.sm === 3,
    },
    {
      "md:basis-full": slidesToShow.md === 1,
      "md:basis-1/2": slidesToShow.md === 2,
      "md:basis-1/3": slidesToShow.md === 3,
    },
    {
      "lg:basis-full": slidesToShow.lg === 1,
      "lg:basis-1/2": slidesToShow.lg === 2,
      "lg:basis-1/3": slidesToShow.lg === 3,
    },
    {
      "xl:basis-full": slidesToShow.xl === 1,
      "xl:basis-1/2": slidesToShow.xl === 2,
      "xl:basis-1/3": slidesToShow.xl === 3,
    },
  );

  return (
    <Carousel
      setApi={setApi}
      dir={direction}
      opts={{
        direction: direction,
        loop: true,
      }}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      plugins={[autoplay.current, Fade()]}
      className={className}
    >
      <CarouselContent>
        {images.map((img, index) => {
          if (typeof img.image === "object" && img.image !== null) {
            return (
              <CarouselItem key={index} className={itemClassName}>
                <CardContent className="relative h-full w-full overflow-hidden rounded-[40px] border-none p-0">
                  <ImageMedia
                    resource={img.image}
                    imgClassName="object-cover rounded-[40px]"
                    className="h-full w-full"
                  />

                  {/* Subtle Gradient Overlay */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 to-30%" />

                  {/* Controller UI */}
                  <div className="absolute bottom-4 w-full px-4">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/20 px-3 py-1 text-sm text-white shadow-sm backdrop-blur-sm">
                        {formatNumber(index + 1)}/{formatNumber(images.length)}
                      </div>

                      <div className="flex w-fit items-center justify-center gap-2 rounded-full border border-white/10 bg-white/20 px-3 py-1 text-sm text-white shadow-sm backdrop-blur-sm">
                        <button
                          onClick={isRtl ? handleNext : handlePrev}
                          className="rounded-full p-2 transition hover:bg-white/10 active:scale-95"
                          aria-label="Previous slide"
                        >
                          {isRtl ? (
                            <ChevronRightIcon className="h-4 w-4" />
                          ) : (
                            <ChevronLeftIcon className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          onClick={isRtl ? handlePrev : handleNext}
                          className="rounded-full p-2 transition hover:bg-white/10 active:scale-95"
                          aria-label="Next slide"
                        >
                          {isRtl ? (
                            <ChevronLeftIcon className="h-4 w-4" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CarouselItem>
            );
          }
          return null;
        })}
      </CarouselContent>
    </Carousel>
  );
}
