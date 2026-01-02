"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// 1. Import i18n hooks
import { useLocale, useTranslations, useFormatter } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/shadcn/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  const t = useTranslations("Carousel");

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">{t("previousSlide")}</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  const t = useTranslations("Carousel");

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">{t("nextSlide")}</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

const CarouselControlButtons = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(
  (
    { className, variant = "outline", size = "iconBig", dir, ...props },
    ref,
  ) => {
    const { scrollNext, canScrollNext, scrollPrev, canScrollPrev } =
      useCarousel();
    const t = useTranslations("Carousel");
    const locale = useLocale();
    const direction = dir || (locale === "fa" ? "rtl" : "ltr");

    return (
      <div dir={direction} className="relative me-1 mt-4 flex justify-start">
        <div className="absolute flex items-center justify-end gap-2 rounded-[40px] bg-[#eaeaea] px-2 py-1">
          <Button
            ref={ref}
            variant="ghost"
            size={size}
            className={cn(
              "hover:bg-appleBackgorundGray/10 h-8 w-8 rounded-full p-2 transition sm:h-8 sm:w-8",
              className,
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
          >
            {direction === "rtl" ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
            <span className="sr-only">{t("previousSlide")}</span>
          </Button>
          <Button
            ref={ref}
            variant="ghost"
            size={size}
            className={cn(
              "hover:bg-appleBackgorundGray/10 h-8 w-8 rounded-full p-2 transition sm:h-8 sm:w-8",
              className,
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
          >
            {direction === "rtl" ? (
              <ChevronLeft className="h-6 w-6" />
            ) : (
              <ChevronRight className="h-6 w-6" />
            )}
            <span className="sr-only">{t("nextSlide")}</span>
          </Button>
        </div>
      </div>
    );
  },
);
CarouselControlButtons.displayName = "CarouselControlButtons";

const CarouselDots = ({ className = "custom-pagination-dark" }) => {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const direction = useDirection();
  const t = useTranslations("Carousel");

  React.useEffect(() => {
    if (!api) return;

    setScrollSnaps(api.scrollSnapList());
    setSelectedIndex(api.selectedScrollSnap());

    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());

    api.on("select", onSelect);
    api.on("reInit", () => {
      setScrollSnaps(api.scrollSnapList());
      onSelect();
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!api || scrollSnaps.length <= 1) return null;

  return (
    <div dir={direction} className={cn("mt-4", className)}>
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => api.scrollTo(index)}
          className={cn(
            "swiper-pagination-bullet",
            selectedIndex === index && "swiper-pagination-bullet-active",
          )}
          aria-label={t("goToSlide", { slide: index + 1 })}
        />
      ))}
    </div>
  );
};
CarouselDots.displayName = "CarouselDots";

const JarounCarouselDots = () => {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const t = useTranslations("Carousel");

  React.useEffect(() => {
    if (!api) return;

    setScrollSnaps(api.scrollSnapList());
    setSelectedIndex(api.selectedScrollSnap());

    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());

    api.on("select", onSelect);
    api.on("reInit", () => {
      setScrollSnaps(api.scrollSnapList());
      onSelect();
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!api || scrollSnaps.length <= 1) return null;

  return (
    <div className="custom-pagination-dark mt-4">
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => api.scrollTo(index)}
          className={cn(
            "swiper-pagination-bullet",
            selectedIndex === index && "swiper-pagination-bullet-active",
          )}
          aria-label={t("goToSlide", { slide: index + 1 })}
        />
      ))}
    </div>
  );
};
JarounCarouselDots.displayName = "JarounCarouselDots";

interface CarouselSnapDisplayProps {
  className?: string;
  bgColor?: string;
  hoverColor?: string;
  textColor?: string;
  captionText?: string;
}

function CarouselSnapDisplay({ className = "" }: CarouselSnapDisplayProps) {
  const { api } = useCarousel();
  const [selectedSnap, setSelectedSnap] = React.useState(0);
  const [snapCount, setSnapCount] = React.useState(0);
  const format = useFormatter();

  const updateSnapState = React.useCallback(() => {
    if (!api) return;
    setSnapCount(api.scrollSnapList().length);
    setSelectedSnap(api.selectedScrollSnap());
  }, [api]);

  React.useEffect(() => {
    if (!api) return;

    updateSnapState();
    api.on("select", updateSnapState);
    api.on("reInit", updateSnapState);

    return () => {
      api.off("select", updateSnapState);
      api.off("reInit", updateSnapState);
    };
  }, [api, updateSnapState]);

  if (!api || snapCount <= 1) return null;

  return (
    <div
      className={`absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-black/60 px-2 py-1 text-xs text-white ${className}`}
    >
      {format.number(selectedSnap + 1)} / {format.number(snapCount)}
    </div>
  );
}
CarouselSnapDisplay.displayName = "SnapDisplay";

// ---
// ⚠️ **FIX:** Wrap the component logic in `React.forwardRef`
// ---
const CarouselButtonAndCounter = React.forwardRef<
  HTMLButtonElement,
  CarouselSnapDisplayProps
>(
  (
    {
      className = "",
      bgColor = "bg-black/60",
      hoverColor = "hover:bg-black/60",
      textColor = "text-white",
    },
    ref,
  ) => {
    const { api, scrollNext, canScrollNext, scrollPrev, canScrollPrev } =
      useCarousel();
    const [selectedSnap, setSelectedSnap] = React.useState(0);
    const [snapCount, setSnapCount] = React.useState(0);
    const direction = useDirection();
    const format = useFormatter();
    const t = useTranslations("Carousel");

    const updateSnapState = React.useCallback(() => {
      if (!api) return;
      setSnapCount(api.scrollSnapList().length);
      setSelectedSnap(api.selectedScrollSnap());
    }, [api]);

    React.useEffect(() => {
      if (!api) return;

      updateSnapState();
      api.on("select", updateSnapState);
      api.on("reInit", updateSnapState);

      return () => {
        api.off("select", updateSnapState);
        api.off("reInit", updateSnapState);
      };
    }, [api, updateSnapState]);

    if (!api || snapCount <= 1) return null;

    return (
      <div
        dir={direction}
        className="section-margin mt-3 flex items-center justify-between px-4 sm:mt-4"
      >
        <div
          className={cn(
            "inset-0 flex items-center justify-end gap-2 rounded-[40px] px-2 py-1",
            bgColor,
          )}
        >
          <button
            ref={ref}
            className={cn("rounded-full transition", hoverColor, className)}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
          >
            {direction === "rtl" ? (
              <ChevronRight className={cn("h-8 w-8 text-xs", textColor)} />
            ) : (
              <ChevronLeft className={cn("h-8 w-8 text-xs", textColor)} />
            )}
            <span className="sr-only">{t("previousSlide")}</span>
          </button>
          <button
            ref={ref}
            className={cn("rounded-full transition", hoverColor, className)}
            disabled={!canScrollNext}
            onClick={scrollNext}
          >
            {direction === "rtl" ? (
              <ChevronLeft className={cn("h-8 w-8 text-xs", textColor)} />
            ) : (
              <ChevronRight className={cn("h-8 w-8 text-xs", textColor)} />
            )}
            <span className="sr-only">{t("nextSlide")}</span>
          </button>
        </div>
        <div className={cn("rounded-[40px] px-2 py-1", bgColor, className)}>
          <span
            className={cn(
              "text-md flex h-8 items-center justify-center px-2 py-1",
              textColor,
            )}
          >
            {direction === "rtl"
              ? format.number(snapCount)
              : format.number(selectedSnap + 1)}{" "}
            /{" "}
            {direction === "rtl"
              ? format.number(selectedSnap + 1)
              : format.number(snapCount)}
          </span>
        </div>
      </div>
    );
  },
);
CarouselButtonAndCounter.displayName = "CarouselButtonAndCounter";

// ---
// ⚠️ **FIX:** Wrap the component logic in `React.forwardRef`
// ---
const CarouselButtonAndCounterWithText = React.forwardRef<
  HTMLButtonElement,
  CarouselSnapDisplayProps
>(
  (
    {
      className = "",
      bgColor = "bg-black/60",
      hoverColor = "hover:bg-black/60",
      textColor = "text-white",
      captionText = "",
    },
    ref,
  ) => {
    const { api, scrollNext, canScrollNext, scrollPrev, canScrollPrev } =
      useCarousel();
    const [selectedSnap, setSelectedSnap] = React.useState(0);
    const [snapCount, setSnapCount] = React.useState(0);
    const locale = useLocale();
    const direction = locale === "fa" ? "rtl" : "ltr";
    const format = useFormatter();
    const t = useTranslations("Carousel");

    const updateSnapState = React.useCallback(() => {
      if (!api) return;
      setSnapCount(api.scrollSnapList().length);
      setSelectedSnap(api.selectedScrollSnap());
    }, [api]);

    React.useEffect(() => {
      if (!api) return;

      updateSnapState();
      api.on("select", updateSnapState);
      api.on("reInit", updateSnapState);

      return () => {
        api.off("select", updateSnapState);
        api.off("reInit", updateSnapState);
      };
    }, [api, updateSnapState]);

    if (!api || snapCount <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4">
        <div
          className={cn(
            "inset-0 flex items-center justify-end gap-2 rounded-[40px] px-2 py-1",
            bgColor,
          )}
        >
          <button
            ref={ref}
            className={cn("rounded-full transition", hoverColor, className)}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
          >
            {direction === "rtl" ? (
              <ChevronRight className={cn("h-8 w-8 text-xs", textColor)} />
            ) : (
              <ChevronLeft className={cn("h-8 w-8 text-xs", textColor)} />
            )}
            <span className="sr-only">{t("previousSlide")}</span>
          </button>
          <button
            ref={ref}
            className={cn("rounded-full transition", hoverColor, className)}
            disabled={!canScrollNext}
            onClick={scrollNext}
          >
            {direction === "rtl" ? (
              <ChevronLeft className={cn("h-8 w-8 text-xs", textColor)} />
            ) : (
              <ChevronRight className={cn("h-8 w-8 text-xs", textColor)} />
            )}
            <span className="sr-only">{t("nextSlide")}</span>
          </button>
        </div>
        <div className={cn("rounded-[40px] px-2 py-1", bgColor, className)}>
          <span
            className={cn(
              "text-md flex h-8 items-center justify-center px-2 py-1",
              textColor,
            )}
          >
            {captionText}
          </span>
        </div>
        <div className={cn("rounded-[40px] px-2 py-1", bgColor, className)}>
          <span
            className={cn(
              "text-md flex h-8 items-center justify-center px-2 py-1",
              textColor,
            )}
          >
            {format.number(snapCount)} / {format.number(selectedSnap + 1)}
          </span>
        </div>
      </div>
    );
  },
);
CarouselButtonAndCounterWithText.displayName =
  "CarouselButtonAndCounterWithText";

// ---
// ⚠️ **FIX:** Wrap the component logic in `React.forwardRef`
// ---
const HeroCarouselController = React.forwardRef<
  HTMLButtonElement,
  CarouselSnapDisplayProps
>(
  (
    {
      className = "",
      bgColor = "bg-black/60",
      hoverColor = "hover:bg-black/60",
      textColor = "text-white",
    },
    ref,
  ) => {
    const { api, scrollNext, canScrollNext, scrollPrev, canScrollPrev } =
      useCarousel();
    const [selectedSnap, setSelectedSnap] = React.useState(0);
    const [snapCount, setSnapCount] = React.useState(0);
    const locale = useLocale();
    const direction = locale === "fa" ? "rtl" : "ltr";
    const format = useFormatter();
    const t = useTranslations("Carousel");

    const updateSnapState = React.useCallback(() => {
      if (!api) return;
      setSnapCount(api.scrollSnapList().length);
      setSelectedSnap(api.selectedScrollSnap());
    }, [api]);

    React.useEffect(() => {
      if (!api) return;

      updateSnapState();
      api.on("select", updateSnapState);
      api.on("reInit", updateSnapState);

      return () => {
        api.off("select", updateSnapState);
        api.off("reInit", updateSnapState);
      };
    }, [api, updateSnapState]);

    if (!api || snapCount <= 1) return null;

    return (
      <div className="mt-3 flex items-center justify-between px-4 sm:mt-4">
        <div
          className={cn(
            "inset-0 flex items-center justify-end gap-2 rounded-[40px] px-2 py-1",
            bgColor,
          )}
        >
          <button
            ref={ref}
            className={cn("rounded-full transition", hoverColor, className)}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
          >
            {direction === "rtl" ? (
              <ChevronRight className={cn("h-8 w-8 text-xs", textColor)} />
            ) : (
              <ChevronLeft className={cn("h-8 w-8 text-xs", textColor)} />
            )}
            <span className="sr-only">{t("previousSlide")}</span>
          </button>
          <button
            ref={ref}
            className={cn("rounded-full transition", hoverColor, className)}
            disabled={!canScrollNext}
            onClick={scrollNext}
          >
            {direction === "rtl" ? (
              <ChevronLeft className={cn("h-8 w-8 text-xs", textColor)} />
            ) : (
              <ChevronRight className={cn("h-8 w-8 text-xs", textColor)} />
            )}
            <span className="sr-only">{t("nextSlide")}</span>
          </button>
        </div>
        <div className={cn("rounded-[40px] px-2 py-1", bgColor, className)}>
          <span
            className={cn(
              "text-md flex h-8 items-center justify-center px-2 py-1",
              textColor,
            )}
          >
            {format.number(snapCount)} / {format.number(selectedSnap + 1)}
          </span>
        </div>
      </div>
    );
  },
);
HeroCarouselController.displayName = "HeroCarouselController";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselControlButtons,
  CarouselDots,
  JarounCarouselDots,
  CarouselSnapDisplay,
  CarouselButtonAndCounter,
  HeroCarouselController,
  CarouselButtonAndCounterWithText,
};
