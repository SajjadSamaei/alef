"use client";
import ImageZoom from "@/components/chegall/ImageZoom";
import { useState, useId, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import { getPlaceholderImage } from "@/utils/sharp/placeholderImages";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCards,
  EffectCoverflow,
  Pagination,
  Zoom,
  Mousewheel,
  FreeMode,
  EffectCreative,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useTranslations } from "next-intl"; // 1. Import i18n hook
import { useDirection } from "@/utils/hooks/useDirection"; // 2. Import direction hook

// --- (Static images and blur data remain the same) ---
const images = {
  skylineImage:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/levels/skyline.png",
  levels1Image:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/levels/levels-1.png",
  levels2Image:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/levels/levels-2.png",
};
const blurData = {
  skylineImge:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/AGpjdmxleaacrcbB1sXB2/Xr+tzQ3Ozf6NrY8KKmzQBqY3djXG5qY3Klm6jf1d757vf/+P/27v/d3fb27vkAZl9xUktYNi87OjRCRj5NbWVyn5Whz8bN8ObovLC5AF9XaE1DUpKUrsXK5KyvxoeDlEY+TzMtPDw4RionNABVTlxTTFx+d4ezrrnCu8WVjZlMR1U8OEZLQ1BcUVoASEBNUkxbPTdAKyUvDQAMLiUtPzhEPjhBSkFKRTxFWkdbjmfbh98AAAAASUVORK5CYII=",
  levels1Image:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/AJ+YoZ+Yn5mSma2jqq+qr7Kqr7Onq3dudyMUHicWIACso63Z1+Dh4ez79/v/+//9+fr69PWUjJhFN0ZJOkcAQSszX0tSgHF5npGXurGzwLS44NbWiYCLU0ZTTkFNAHJhaWZVX2hXY4V0fW1fYpuPkt/V1ZyRm2laZkY6RgA7KTU+M0FdUWKtnqOcjI+Id3nEtbWPgo9gUmBKPEgAFAALHA0WHRIaSDlEhHFu07yqo5CPem5+T0FNQjRAM5BZyJ5EFJQAAAAASUVORK5CYII=",
  levels2Image:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/ALm4wNrb4Pr69vT18ff49vb29fPz8vj49cvIzn97ggAdFh5OSFBoYWZuaG18dXh+eHx0bXFpYWgzKzQXCBUAIRkkGREdJB0qNCw6S0JNVU1WNy48KiIuIxomDgMSAE1LWEVAT1FOX2hmcm1mb29ocHZyfVtWY0lFUSknMwBQTl9bWmhcWmpvbnluYmJ2aWaIgopaXGtVU2JPTlwANTRCOjhIQ0JSMS88LSo0OjM+NTRAPzxONDRCMS8/jiNFxAZamOkAAAAASUVORK5CYII=",
};

// --- TYPE DEFINITIONS ---

// 3. Define types for props
interface Feature {
  name: string;
  image: string;
  [key: string]: any; // Allow other properties
}

interface ImageCardStackProps {
  features: Feature[];
  width: number;
  height: number;
}

interface ImageCoverFlowProps {
  features: Feature[];
  width: number;
  height: number;
  cardBg?: string;
  caption?: boolean;
}

// --- ImageCardStack Component ---
export function ImageCardStack({
  features,
  width,
  height,
}: ImageCardStackProps) {
  return (
    <Swiper effect={"cards"} grabCursor={true} modules={[EffectCards]}>
      {features.map((feature, featureIndex) => (
        <SwiperSlide className="bg-jarounGray6 rounded-4xl" key={featureIndex}>
          <div className="grid grid-cols-1 grid-rows-4">
            <ImageZoom
              width={width}
              height={height}
              alt={feature.name || "Feature Image"} // Use localized name for alt
              src={feature.image}
              className="row-span-3 rounded-t-3xl object-cover object-center"
            />
            <div className="flex items-center justify-center">
              <span className="text-base text-neutral-200">{feature.name}</span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

// --- ImageCoverFlow Component ---
export function ImageCoverFlow({
  features,
  width,
  height,
  cardBg = "bg-white",
  caption = true,
}: ImageCoverFlowProps) {
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [featuresWithPlaceholders, setFeaturesWithPlaceholders] = useState<
    any[]
  >([]); // Add type
  const paginationId = useId();
  const paginationRef = useRef<HTMLDivElement | null>(null); // Add type
  const direction = useDirection(); // 4. Get direction

  // useEffect(() => {
  //   import("swiper/css/pagination").then(() => {
  //     document.body.clientWidth;
  //   });
  // }, []);

  useEffect(() => {
    const fetchPlaceholders = async () => {
      const updatedFeatures = await Promise.all(
        features.map(async (feature) => {
          // Assuming getPlaceholderImage is async and returns { placeholder: string }
          const placeholderData = await getPlaceholderImage(feature.image);
          return { ...feature, placeholder: placeholderData.placeholder };
        }),
      );
      setFeaturesWithPlaceholders(updatedFeatures);
    };

    if (features.length) {
      fetchPlaceholders();
    }
  }, [features]);

  const handleZoomToggle = () => {
    setZoomEnabled(!zoomEnabled);
  };

  return (
    <Swiper
      modules={[Pagination, EffectCreative, Zoom, Mousewheel, FreeMode]}
      effect={"creative"}
      zoom={{
        maxRatio: 3,
        minRatio: 1,
        toggle: true,
      }}
      onDoubleClick={handleZoomToggle}
      grabCursor={true}
      mousewheel={{
        forceToAxis: true,
        sensitivity: 0.5,
        releaseOnEdges: true,
      }}
      direction={"horizontal"}
      centeredSlides={true}
      slidesPerView={"auto"}
      creativeEffect={{
        prev: {
          shadow: false,
          translate: ["-120%", 0, -500],
        },
        next: {
          shadow: false,
          translate: ["120%", 0, -500],
        },
      }}
      pagination={{
        el: paginationRef.current, // Use the ref
        clickable: true,
      }}
      dir={direction} // 5. Set direction
      className="h-full w-full overflow-hidden rounded-3xl"
    >
      {featuresWithPlaceholders.map((feature, featureIndex) => (
        <SwiperSlide
          key={featureIndex}
          className="flex items-center justify-center bg-transparent"
        >
          <div
            className={clsx(
              "swiper-zoom-container ring-jarounBlack/5 flex flex-col items-center justify-center rounded-3xl shadow-2xs ring-1 inset-shadow-2xs drop-shadow-xl",
              zoomEnabled && "zoom-active",
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
              blurDataURL={feature.placeholder || blurData.levels1Image} // Fallback blur
              className="rounded-3xl object-cover object-center"
            />
            {caption && (
              <span className="flex items-center justify-center py-2 text-base text-neutral-800">
                {feature.name}
              </span>
            )}
          </div>
        </SwiperSlide>
      ))}
      <div
        id={paginationId}
        ref={paginationRef}
        className="custom-pagination z-50 mt-6 h-4"
      />
    </Swiper>
  );
}

// --- FeatureCards Component ---
export function FeatureCards() {
  const t = useTranslations("Project.Jaroun.FeatureCards"); // 6. Get translations

  return (
    <Swiper
      effect={"creative"}
      grabCursor={true}
      mousewheel={{
        forceToAxis: true,
        sensitivity: 0.3,
        releaseOnEdges: true,
        invert: false,
        thresholdDelta: 50,
      }}
      direction={"horizontal"}
      centeredSlides={true}
      breakpoints={{
        0: { slidesPerView: 1.2, spaceBetween: 16 },
        768: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: "auto", spaceBetween: 32 },
      }}
      pagination={{
        el: ".custom-pagination-dark",
        clickable: true,
      }}
      modules={[Pagination, Mousewheel, FreeMode]}
      className="h-full w-full"
    >
      <SwiperSlide className="inset-0 flex max-w-7xl flex-col items-center justify-center md:px-[5rem] lg:px-[8rem] xl:px-8">
        <div className="relative">
          <div className="max-lg:rounded-t-3xl-t-[2rem] lg:rounded-tl-3xl-[2rem] bg-jarounGray1 absolute inset-px rounded-3xl" />
          <div className="max-lg:rounded-t-3xl-[calc(2rem+1px)] lg:rounded-tl-3xl-[calc(2rem+1px)] relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-3xl)+1px)]">
            <Image
              width={1236}
              height={768}
              alt={t("community.alt")}
              src={images.levels1Image}
              blurDataURL={blurData.levels1Image}
              placeholder="blur"
              className="h-80 object-cover"
            />
            <div className="p-10 pt-4">
              <p className="text-jarounGray7 mt-2 text-lg/7 font-medium tracking-tight">
                {t("community.title")}
              </p>
              <p className="text-jarounGray5 mt-2 mb-3 max-w-lg text-sm/6">
                {t("community.description")}
              </p>
            </div>
          </div>
          <div className="max-lg:rounded-t-3xl-[2rem] lg:rounded-tl-3xl-[2rem] pointer-events-none absolute inset-px rounded-3xl shadow-2xs ring-1 ring-black/5" />
        </div>
      </SwiperSlide>
      <SwiperSlide className="inset-0 flex max-w-7xl flex-col items-center justify-center md:px-[5rem] lg:px-[8rem] xl:px-8">
        <div className="relative">
          <div className="max-lg:rounded-t-3xl-t-[2rem] lg:rounded-tl-3xl-[2rem] bg-jarounGray1 absolute inset-px rounded-3xl" />
          <div className="max-lg:rounded-t-3xl-[calc(2rem+1px)] lg:rounded-tl-3xl-[calc(2rem+1px)] relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-3xl)+1px)]">
            <Image
              width={1236}
              height={768}
              alt={t("privacy.alt")}
              src={images.levels2Image}
              blurDataURL={blurData.levels2Image}
              placeholder="blur"
              className="h-80 object-cover"
            />
            <div className="p-10 pt-4">
              <p className="text-jarounGray7 mt-2 text-lg/7 font-medium tracking-tight">
                {t("privacy.title")}
              </p>
              <p className="text-jarounGray5 mt-2 mb-3 max-w-lg text-sm/6">
                {t("privacy.description")}
              </p>
            </div>
          </div>
          <div className="max-lg:rounded-t-3xl-[2rem] lg:rounded-tl-3xl-[2rem] pointer-events-none absolute inset-px rounded-3xl shadow-2xs ring-1 ring-black/5" />
        </div>
      </SwiperSlide>
      <SwiperSlide className="inset-0 flex max-w-7xl flex-col items-center justify-center md:px-[5rem] lg:px-[8rem] xl:px-8">
        <div className="relative lg:col-span-2">
          <div className="max-lg:rounded-t-3xl-t-[2rem] lg:rounded-tl-3xl-[2rem] bg-jarounGray1 absolute inset-px rounded-3xl" />
          <div className="max-lg:rounded-t-3xl-[calc(2rem+1px)] lg:rounded-tl-3xl-[calc(2rem+1px)] relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-3xl)+1px)]">
            <Image
              width={1862}
              height={1063}
              alt={t("skylight.alt")}
              src={images.skylineImage}
              blurDataURL={blurData.skylineImge}
              placeholder="blur"
              className="h-80 object-cover"
            />
            <div className="p-10 pt-4">
              <p className="text-jarounGray7 mt-2 text-lg/7 font-medium tracking-tight">
                {t("skylight.title")}
              </p>
              <p className="text-jarounGray5 mt-2 mb-3 max-w-lg text-sm/6">
                {t("skylight.description")}
              </p>
            </div>
          </div>
          <div className="max-lg:rounded-t-3xl-[2rem] lg:rounded-tl-3xl-[2rem] pointer-events-none absolute inset-px rounded-3xl shadow-2xs ring-1 ring-black/5" />
        </div>
      </SwiperSlide>
      {/* Pagination container */}
      <div className="custom-pagination-dark z-50 mt-4 h-4" />
    </Swiper>
  );
}
