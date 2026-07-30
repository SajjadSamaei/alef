"use client";
import { useState, useEffect, useCallback, useId, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import useEmblaCarousel from "embla-carousel-react";
import { getPlaceholderImage } from "@/utils/sharp/placeholderImages";
import clsx from "clsx";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { Card, CardContent, BorderlessCard } from "@/components/ui/shadcn/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselControlButtons,
  CarouselDots,
  JarounCarouselDots,
  CarouselSnapDisplay,
  CarouselButtonAndCounter,
} from "@/components/ui/shadcn/carousel";

import { SectionIntro } from "@/components/chegall/studio/SectionIntro";
import { useDirection } from "@/utils/hooks/useDirection";

export function EmblaImageFlow({
  features,
  width,
  height,
  cardBg = "bg-white",
  caption = true,
}) {
  // --- State and Refs ---
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center", // Equivalent to Swiper's centeredSlides
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideTansforms, setSlideTransforms] = useState([]);
  const [featuresWithPlaceholders, setFeaturesWithPlaceholders] = useState([]);
  const paginationId = useId();

  // --- Data Fetching (Unchanged) ---
  useEffect(() => {
    const fetchPlaceholders = async () => {
      const updatedFeatures = await Promise.all(
        features.map(async (feature) => {
          const placeholderData = await getPlaceholderImage(feature.image);
          return { ...feature, placeholder: placeholderData.placeholder };
        }),
      );
      setFeaturesWithPlaceholders(updatedFeatures);
    };
    fetchPlaceholders();
  }, [features]);

  // --- Recreating the Creative Effect ---
  const TWEEN_FACTOR = 1.2; // Controls the intensity of the effect

  const applySlideTransforms = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const transforms = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const tweenValues = engine.scrollBody.tweenAmount.get();

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopPoint) => {
          const target = loopPoint.target();
          if (index === loopPoint.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }

      const translate = diffToTarget * (-100 * TWEEN_FACTOR);
      const scale = 1 - Math.abs(diffToTarget) * 0.5;
      const zIndex = 100 - Math.abs(diffToTarget) * 10;

      return {
        transform: `translateX(${translate}%) scale(${scale})`,
        zIndex,
      };
    });
    setSlideTransforms(transforms);
  }, [emblaApi]);

  // --- Event Listeners ---
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", applySlideTransforms);
    emblaApi.on("reInit", applySlideTransforms); // Re-apply on resize

    // Set initial state
    onSelect();
    applySlideTransforms();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", applySlideTransforms);
      emblaApi.off("reInit", applySlideTransforms);
    };
  }, [emblaApi, applySlideTransforms]);

  return (
    <div className="w-full">
      <div className="embla rounded-3xl" ref={emblaRef}>
        <div className="embla__container h-full">
          {featuresWithPlaceholders.map((feature, index) => (
            <div
              className="embla__slide"
              key={index}
              style={slideTansforms[index]}
            >
              {/* Note: Zoom is handled manually, not with a plugin */}
              <div
                className={clsx(
                  "ring-jarounBlack/5 flex flex-col items-center justify-center rounded-3xl shadow-2xs ring-1 inset-shadow-2xs drop-shadow-xl",
                  cardBg,
                )}
              >
                <Image
                  width={width}
                  height={height}
                  quality={100}
                  alt={feature.name || ""}
                  src={feature.image}
                  placeholder="blur"
                  blurDataURL={feature.placeholder}
                  className="rounded-3xl object-cover object-center"
                />
                {caption && (
                  <span className="flex items-center justify-center py-2 text-base text-neutral-800">
                    {feature.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Custom Pagination --- */}
      <div
        id={paginationId}
        className="custom-pagination z-50 mt-6 flex h-4 items-center justify-center gap-2"
      >
        {emblaApi?.scrollSnapList().map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi.scrollTo(index)}
            className={clsx(
              "h-2 w-2 rounded-full transition-all duration-300",
              index === selectedIndex ? "w-4 bg-neutral-800" : "bg-neutral-300",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function PlansCarousel({
  images,
  placeholder,
  width,
  height,
  cardBg = "bg-white",
  caption = true,
  paginationClassName = "custom-pagination-dark", // <-- default class
}) {
  const direction = useDirection();
  return (
    <Carousel
      dir={direction}
      opts={{
        direction: { direction },
        // loop: true,
      }}
      // plugins={[autoplay.current, Fade()]}
      className="h-full w-full" // 1. Set container height
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            {/* 3. Ensure card and its content also fill the height */}
            <Card
              className={clsx(
                "ring-jarounBlack/5 section-margin flex flex-col items-center justify-center rounded-3xl shadow-2xs ring-1 inset-shadow-2xs drop-shadow-xl",
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
                  className="rounded-3xl object-cover object-center"
                />
                {caption && (
                  <span className="flex items-center justify-center py-4 text-base text-neutral-800">
                    {image.name}
                  </span>
                )}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots className={paginationClassName} />
    </Carousel>
  );
}

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
  spacing = 4, // Corresponds to Tailwind's spacing scale (e.g., 4 = 1rem = 16px)
  paginationClassName = "custom-pagination-dark", // <-- default class
  controllerBgColor = "bg-black/60",
  controllerHoverColor = "hover:bg-black/60",
  controllerTextColor = "text-white",
}) {
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  // 1. Add state for the API and a ref for the timeout
  const [api, setApi] = useState(null);
  const timeoutRef = useRef(null);

  // 2. Create a handler that restarts autoplay after a delay
  const handleInteraction = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      autoplay.current?.play();
    }, 5000); // Set your desired delay here (2000ms = 2s)
  }, []);

  // 3. Set up the effect to listen for interactions
  useEffect(() => {
    if (!api) {
      return;
    }

    // This handles drag interactions
    api.on("pointerDown", handleInteraction);

    // This handles button clicks
    const onSelect = () => {
      // If autoplay is stopped, it's due to interaction.
      if (autoplay.current && !autoplay.current.isPlaying()) {
        handleInteraction();
      }
    };

    api.on("select", onSelect);

    // Cleanup on unmount
    return () => {
      api.off("pointerDown", handleInteraction);
      api.off("select", onSelect);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [api, handleInteraction]);

  // Helper object to map number of slides to Tailwind `basis` classes
  const basisClasses = {
    1: "basis-full",
    2: "basis-1/2",
    3: "basis-1/3",
    4: "basis-1/4",
    5: "basis-1/5",
    6: "basis-1/6",
  };

  // Dynamically create the class string for CarouselItem
  const itemClassName = clsx(
    `pl-${spacing}`, // Add left padding for the gap
    slidesToShow.base && basisClasses[slidesToShow.base],
    slidesToShow.sm && `sm:${basisClasses[slidesToShow.sm]}`,
    slidesToShow.md && `md:${basisClasses[slidesToShow.md]}`,
    slidesToShow.lg && `lg:${basisClasses[slidesToShow.lg]}`,
    slidesToShow.xl && `xl:${basisClasses[slidesToShow.xl]}`,
  );

  return (
    <Carousel
      setApi={setApi}
      dir="rtl"
      opts={{
        direction: "rtl",
        loop: true,
      }}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      plugins={[autoplay.current, Fade()]}
      className={className} // 1. Set container height
    >
       {" "}
      <CarouselContent className={`-ml-${spacing}`}>
        {images.map((image, index) => (
          <CarouselItem key={index} className={itemClassName}>
            {/* 3. Ensure card and its content also fill the height */}
            <BorderlessCard
              className={clsx(
                "sm:section-margin flex flex-col items-center justify-center inset-shadow-sm sm:overflow-hidden sm:rounded-[40px]",
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
      {/* <CarouselDots className={paginationClassName} /> */}
      <CarouselButtonAndCounter
        bgColor={controllerBgColor}
        hoverColor={controllerHoverColor}
        textColor={controllerTextColor}
      />
    </Carousel>
  );
}

export function ImagesCarousel({
  images,
  placeholder,
  width,
  height,
  cardBg = "bg-white",
  caption = true,
}) {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const parallaxRefs = useRef([]);

  useEffect(() => {
    if (!api) return;

    const onScroll = () => {
      const scrollProgress = api.scrollProgress();

      api.scrollSnapList().forEach((_, index) => {
        const scrollSnap = api.scrollSnapList()[index];
        const slide = parallaxRefs.current[index];
        if (!slide) return;

        const diffToTarget = scrollSnap - scrollProgress;
        const translate = diffToTarget * 100; // Adjust intensity here

        slide.style.transform = `translateX(${translate}%)`;
      });
    };

    api.on("scroll", onScroll);
    api.on("reInit", onScroll);
    onScroll();

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();

    return () => {
      api?.off("scroll", onScroll);
      api?.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="w-full space-y-4">
      <Carousel
        dir="rtl"
        opts={{ direction: "rtl" }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="overflow-hidden px-4">
                <BorderlessCard
                  className={clsx(
                    "ring-jarounBlack/5 flex flex-col items-center justify-center rounded-3xl shadow-2xs ring-1 inset-shadow-2xs drop-shadow-xl",
                    cardBg,
                  )}
                >
                  <CardContent className="h-full w-full overflow-hidden p-0">
                    <div
                      ref={(el) => (parallaxRefs.current[index] = el)}
                      className="transition-transform duration-300 will-change-transform"
                    >
                      <Image
                        width={width}
                        height={height}
                        quality={100}
                        alt={image.name || ""}
                        src={image.src}
                        placeholder="blur"
                        blurDataURL={placeholder}
                        className="h-full w-full rounded-3xl object-cover object-center"
                      />
                    </div>
                    {caption && (
                      <div className="flex items-center justify-center py-3">
                        <span className="text-base font-medium text-neutral-800">
                          {image.name}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </BorderlessCard>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselControlButtons />
        <CarouselDots />
      </Carousel>
    </div>
  );
}

const works = [
  {
    name: "جرون",
    logo: "/projects/ka/logo/logomark-dark.svg",
    image: "/building/hero-2.jpg",
    service: "مسکونی هتلی",
    date: "1405",
    href: "/work/ka",
    title: "مجموعه فلان واحدی",
    summary: ["FamilyFund is a crowdfunding platform for friends and family."],
  },
  {
    name: "نیروانا",
    logo: "/projects/jaroun/logo/logomark-dark.svg",
    image: "/building/hero-1.jpg",
    service: "مسکونی",
    date: "تاریخ پروژه",
    href: "/work/jaroun",
    title: "مجموعه فلان",
    summary: ["FamilyFund is a crowdfunding platform for friends and family."],
  },
  {
    name: "دی",
    logo: "/projects/jaroun/logo/logomark-dark.svg",
    image: "/building/hero-1.jpg",
    service: "مسکونی",
    date: "تاریخ پروژه",
    href: "/work/jaroun",
    title: "مجموعه فلان",
    summary: ["FamilyFund is a crowdfunding platform for friends and family."],
  },
  {
    name: "3جرون",
    logo: "/projects/jaroun/logo/logomark-dark.svg",
    image: "/building/hero-1.jpg",
    service: "نوع پروژه",
    date: "تاریخ پروژه",
    href: "/work/jaroun",
    title: "مجموعه فلان",
    summary: ["FamilyFund is a crowdfunding platform for friends and family."],
  },
];

export function PhotoLogoCard({
  name,
  title,
  date,
  image,
  logo,
  service,
  href,
  summary,
  ...props // This captures the onClick handler from the parent
}) {
  return (
    // The component is now just a simple div. All scroll-related classes
    // like `snap-start` are removed as the parent CarouselItem handles it.
    <div
      {...props}
      className="relative flex aspect-9/16 w-72 shrink-0 flex-col sm:w-96"
    >
      <FadeIn key={href} className="flex h-full">
        <article className="relative flex w-full flex-col rounded-3xl bg-white ring-1 ring-neutral-950/5 transition hover:bg-neutral-50">
          {/* Top Section: Photo with Logo */}
          <div className="relative basis-2/3">
            {/* Photo */}
            <Image
              width={384} // 96 * 4
              height={427} // Corresponds to aspect-9/16 at w-96
              alt=""
              src={image}
              className="h-full w-full rounded-t-3xl object-cover"
            />

            {/* Logo */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <Link href={href} className="flex">
                <Image
                  src={logo}
                  alt={name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full" // Added rounded-full for a common logo style
                  unoptimized
                />
              </Link>
            </div>
          </div>

          {/* Bottom Section: Title, Dates, and Summary */}
          <div className="flex basis-1/3 flex-col p-6">
            <p className="flex gap-x-2 text-sm text-neutral-950">
              <time className="font-semibold">{service}</time>
              <span className="text-neutral-300" aria-hidden="true">
                /
              </span>
              <span>{date}</span>
            </p>
            <h3 className="font-display mt-4 text-2xl font-semibold text-neutral-950">
              {title}
            </h3>
            <p className="mt-4 flex-grow text-base text-neutral-600">
              {summary}
            </p>
          </div>
        </article>
      </FadeIn>
    </div>
  );
}

export function ProjectsCarousel() {
  const [api, setApi] = useState(null);
  const [opacities, setOpacities] = useState([]);

  // 👇 The logic for the fade effect
  const setSlideOpacities = useCallback((emblaApi) => {
    if (!emblaApi) return;

    // Get the scroll progress and details for each slide
    const { slides, scrollProgress } = emblaApi.internalEngine();
    const newOpacities = slides.map((slide, index) => {
      // This is one way to calculate opacity. Embla's docs have more examples.
      const TWEEN_FACTOR = 2.5;
      let diffToTarget = emblaApi.scrollProgress() - index;
      if (emblaApi.options.loop) {
        // Adjust for loop mode
        const WHIRL_SIZE = slides.length;
        const halfWhirl = WHIRL_SIZE / 2;
        if (diffToTarget > halfWhirl) diffToTarget -= WHIRL_SIZE;
        if (diffToTarget < -halfWhirl) diffToTarget += WHIRL_SIZE;
      }
      const tween = 1 - Math.abs(diffToTarget * TWEEN_FACTOR);
      return Math.max(0.5, Math.min(1, tween)); // Clamp between 0.5 and 1
    });

    setOpacities(newOpacities);
  }, []);

  useEffect(() => {
    if (!api) return;

    // Set initial opacities
    setSlideOpacities(api);

    // Re-calculate on scroll and settle
    api.on("scroll", setSlideOpacities);
    api.on("settle", setSlideOpacities);

    return () => {
      api.off("scroll", setSlideOpacities);
      api.off("settle", setSlideOpacities);
    };
  }, [api, setSlideOpacities]);

  const scrollTo = (index) => {
    api?.scrollTo(index);
  };

  return (
    <>
      <SectionIntro eyebrow="کارهای ما" title="هر پروژه، یک فکر عمیق" />
      <Carousel
        setApi={setApi}
        // 👇 Set alignment and other options here
        opts={{
          align: "start",
          loop: true, // Optional: for infinite scrolling
          containScroll: "trimSnaps",
        }}
        // 👇 Apply responsive padding to align with your page layout
        className="px-8 md:px-14 lg:px-20 xl:px-8"
      >
        <CarouselContent className="-ml-4 gap-8">
          {works.map(
            (
              { name, logo, image, service, date, href, title, summary },
              index,
            ) => (
              <CarouselItem key={index} className="basis-auto pl-4">
                {/* The PhotoLogoCard is now simpler */}
                <div style={{ opacity: opacities[index] ?? 1 }}>
                  <PhotoLogoCard
                    name={name}
                    title={title}
                    img={image}
                    date={date}
                    service={service}
                    summary={summary}
                    href={href}
                    logo={logo}
                    onClick={() => scrollTo(index)}
                  />
                </div>
              </CarouselItem>
            ),
          )}
        </CarouselContent>
        {/* You can optionally add CarouselPrevious and CarouselNext buttons */}
      </Carousel>
    </>
  );
}
