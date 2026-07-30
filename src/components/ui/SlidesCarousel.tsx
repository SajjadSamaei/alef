"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { CardContent, BorderlessCard } from "@/components/ui/shadcn/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselButtonAndCounter,
} from "@/components/ui/shadcn/carousel";
import Autoplay from "embla-carousel-autoplay";
// Import the Embla Carousel type
import { EmblaCarouselType } from "embla-carousel";
import Fade from "embla-carousel-fade";
import clsx from "clsx";
import { useDirection } from "@/utils/hooks/useDirection";

// --- Types ---

type SlidesToShow = {
  base: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

type ImageProp = {
  name?: string;
  src: string;
};

type SlidesCarouselProps = {
  className?: string;
  images: ImageProp[];
  placeholder?: string;
  width: number;
  height: number;
  cardBg?: string;
  caption?: boolean;
  cardMode?: boolean;
  slidesToShow?: SlidesToShow;
  spacing?: number;
  paginationClassName?: string;
  controllerBgColor?: string;
  controllerHoverColor?: string;
  controllerTextColor?: string;
};

// --- Component ---

export function SlidesCarousel({
  className = "w-full",
  images,
  placeholder,
  width,
  height,
  cardBg = "bg-white",
  caption = true,
  cardMode = true,
  slidesToShow = { base: 1, md: 2, xl: 3 },
  spacing = 4,
  controllerBgColor = "bg-black/60",
  controllerHoverColor = "hover:bg-black/60",
  controllerTextColor = "text-white",
}: SlidesCarouselProps) {
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  // Type the `api` state to allow null or the Embla type
  const [api, setApi] = useState<EmblaCarouselType | undefined>(undefined);

  // Type the `timeoutRef` to allow null or the Timeout type
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const direction = useDirection();

  const handleInteraction = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => autoplay.current?.play(), 5000);
  }, []);

  useEffect(() => {
    if (!api) return;

    // `api.on` and `api.off` now work
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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [api, handleInteraction]);

  // Add a number index signature to the type
  const basisClasses: { [key: number]: string } = {
    1: "basis-full",
    2: "basis-1/2",
    3: "basis-1/3",
    4: "basis-1/4",
    5: "basis-1/5",
    6: "basis-1/6",
  };

  const itemClassName = clsx(
    `pl-${spacing}`,
    slidesToShow.base && basisClasses[slidesToShow.base],
    slidesToShow.sm && `sm:${basisClasses[slidesToShow.sm]}`,
    slidesToShow.md && `md:${basisClasses[slidesToShow.md]}`,
    slidesToShow.lg && `lg:${basisClasses[slidesToShow.lg]}`,
    slidesToShow.xl && `xl:${basisClasses[slidesToShow.xl]}`,
  );

  return (
    <Carousel
      setApi={setApi}
      dir={direction}
      opts={{
        direction: direction,
        loop: true,
        align: "center",
      }}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      plugins={[autoplay.current, Fade()]}
      className={className}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <BorderlessCard
              className={clsx(
                "sm:section-margin flex flex-col items-center justify-center inset-shadow-sm sm:overflow-hidden sm:rounded-[40px] xl:max-h-[70vh]",
                cardMode && "section-margin overflow-hidden rounded-[40px]",
                cardBg,
              )}
            >
              <CardContent className="h-full w-full">
                <Image
                  width={width}
                  height={height}
                  quality={100}
                  alt={image.name || ""}
                  src={image.src}
                  placeholder="blur"
                  blurDataURL={placeholder}
                  className="object-cover object-center"
                />
                {caption && (
                  <span className="flex items-center justify-center py-4 text-base text-neutral-800">
                    {image.name}
                  </span>
                )}
              </CardContent>
            </BorderlessCard>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselButtonAndCounter
        bgColor={controllerBgColor}
        hoverColor={controllerHoverColor}
        textColor={controllerTextColor}
      />
    </Carousel>
  );
}
