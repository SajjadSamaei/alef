"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { CardContent, SharpCard } from "@/components/ui/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";
import { englishToPersianDigits } from "@/utils/helpers/strings-numbers";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useDrag } from "@use-gesture/react";
import clsx from "clsx";
import { useFormatter } from "next-intl";
import { useMemo, useRef, useState, useEffect } from "react";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import { useDirection } from "@/utils/hooks/useDirection";
import React from "react";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { CaseStudy } from "@/src/payload-types";

function GalleryDisplayImage({
  image,
  fit = "cover",
  className,
  onClick,
}: {
  image: NonNullable<CaseStudy["featuredImage"]>;
  fit?: "cover" | "contain";
  className?: string;
  onClick?: () => void;
}) {
  if (fit === "cover") {
    return (
      <div onClick={onClick} className={clsx("cursor-pointer h-full w-full", className)}>
        <ImageMedia
          resource={image}
          fill
          imgSize="large"
          pictureClassName={className}
          imgClassName="object-cover transition-transform duration-500 hover:scale-[1.02]"
        />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={clsx("absolute inset-0 cursor-pointer overflow-hidden bg-neutral-900", className)}
    >
      <ImageMedia
        resource={image}
        fill
        imgSize="large"
        imgClassName="scale-125 object-cover opacity-70 blur-2xl"
      />
      <div className="absolute inset-0 bg-black/30" />
      <ImageMedia
        resource={image}
        fill
        imgSize="large"
        imgClassName="object-contain transition-transform duration-500 hover:scale-[1.02]"
      />
    </div>
  );
}

const getAspectRatio = (image: unknown) => {
  if (!image || typeof image !== "object") return null;
  const { width, height } = image as { width?: number | null; height?: number | null };
  return width && height ? width / height : null;
};

const getFrameAspectRatio = (
  images: unknown[],
  {
    min = 3 / 4,
    max = 3 / 2,
    squareBandMin = 0.85,
    squareBandMax = 1.15,
    squareBias = 4 / 5,
  }: {
    min?: number;
    max?: number;
    squareBandMin?: number;
    squareBandMax?: number;
    squareBias?: number;
  } = {},
) => {
  const ratios = images
    .map(getAspectRatio)
    .filter((ratio): ratio is number => Boolean(ratio));
  if (!ratios.length) return squareBias;

  const sorted = [...ratios].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  if (median >= squareBandMin && median <= squareBandMax) return squareBias;

  return Math.min(Math.max(median, min), max);
};

const getFitForFrame = (
  image: unknown,
  frameAspectRatio: number,
): "cover" | "contain" => {
  const ratio = getAspectRatio(image);
  if (!ratio) return "cover";
  return Math.abs(Math.log(ratio / frameAspectRatio)) < 0.35 ? "cover" : "contain";
};

// Fullscreen Lightbox Modal
function FullscreenLightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onSelectIndex,
  direction,
}: {
  isOpen: boolean;
  onClose: () => void;
  images: any[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  direction: "ltr" | "rtl";
}) {
  const isRtl = direction === "rtl";
  const formatter = useFormatter();

  const handleNext = () => {
    onSelectIndex((currentIndex + 1) % images.length);
  };

  const handlePrev = () => {
    onSelectIndex((currentIndex - 1 + images.length) % images.length);
  };

  const bindModalDrag = useDrag(
    ({ swipe: [swipeX, swipeY] }) => {
      // Vertical swipe (up or down) dismisses the lightbox
      if (swipeY !== 0) {
        onClose();
        return;
      }
      // Horizontal swipe navigates between images
      if (swipeX !== 0) {
        if (swipeX < 0) handleNext();
        else handlePrev();
      }
    },
    {
      filterTaps: true,
      pointer: { touch: true },
    },
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        if (isRtl) handlePrev();
        else handleNext();
      } else if (e.key === "ArrowLeft") {
        if (isRtl) handleNext();
        else handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, isRtl]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const formatNumber = (num: number) =>
    isRtl ? englishToPersianDigits(num) : formatter.number(num);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 p-4 sm:p-6 backdrop-blur-md animate-in fade-in-0 duration-200 select-none"
    >
      {/* Top Controls Header */}
      <div className="flex items-center justify-between text-white z-20 pointer-events-auto">
        <div className="rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          {formatNumber(currentIndex + 1)} / {formatNumber(images.length)}
        </div>
        
        <button
          onClick={onClose}
          aria-label="Close fullscreen view"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 hover:scale-105 active:scale-95"
        >
          <span>{isRtl ? "بستن" : "Close"}</span>
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main Image View with Touch Gesture & Backdrop Tap */}
      <div
        {...bindModalDrag()}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="relative flex flex-1 items-center justify-center my-4 overflow-hidden touch-none"
      >
        {/* Navigation Buttons */}
        <button
          onClick={isRtl ? handleNext : handlePrev}
          aria-label="Previous image"
          className="absolute start-2 sm:start-8 z-30 rounded-full border border-white/10 bg-black/60 p-3 text-white transition hover:bg-black/90 hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
        </button>

        <div
          onClick={(e) => {
            // Tap image backdrop frame to close
            if (e.target === e.currentTarget) onClose();
          }}
          className="relative h-full w-full max-w-6xl max-h-[82vh]"
        >
          {currentImage && (
            <ImageMedia
              resource={currentImage}
              fill
              size="large"
              imgClassName="object-contain"
            />
          )}
        </div>

        <button
          onClick={isRtl ? handlePrev : handleNext}
          aria-label="Next image"
          className="absolute end-2 sm:end-8 z-30 rounded-full border border-white/10 bg-black/60 p-3 text-white transition hover:bg-black/90 hover:scale-110 active:scale-95"
        >
          <ChevronRight className="h-6 w-6 rtl:rotate-180" />
        </button>
      </div>

      {/* Bottom Thumbnails Carousel */}
      <div className="flex items-center justify-center overflow-x-auto py-2 hide-scrollbar z-20">
        <div className="flex gap-2.5 px-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={clsx(
                "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition-all duration-200 cursor-pointer",
                idx === currentIndex
                  ? "ring-2 ring-white scale-105"
                  : "opacity-40 hover:opacity-100",
              )}
            >
              <ImageMedia
                resource={img}
                fill
                size="thumbnail"
                imgClassName="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export const ImagesGrid: React.FC<{
  post: CaseStudy;
}> = ({ post }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const direction = useDirection();
  const isRtl = direction === "rtl";
  const formatter = useFormatter();

  const { projectGallery, featuredImage, projectDrawings } = post || {};

  // --- Data Preparation ---
  const galleryImages =
    projectGallery?.flatMap((item) => item.image || []) || [];
  const drawingImages =
    projectDrawings?.flatMap((item) => item.drawing || []) || [];

  const tabbedImages = [
    featuredImage,
    ...galleryImages,
    ...drawingImages,
  ].filter(Boolean);

  const mobileFrameAspectRatio = useMemo(
    () => getFrameAspectRatio(tabbedImages),
    [tabbedImages],
  );
  const desktopHeroAspectRatio = 3 / 4;
  const desktopCarouselAspectRatio = 16 / 9;

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRefXL = useRef<HTMLDivElement>(null);

  const scrollThumbnails = (
    index: number,
    ref: React.RefObject<HTMLDivElement | null>,
    isLarge: boolean,
  ) => {
    if (!ref.current) return;
    const childNode = ref.current.children[index] as HTMLElement;
    if (childNode) {
      childNode.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const changeSlide = (step: number) => {
    const total = tabbedImages.length;
    if (total === 0) return;
    const newIndex = (selectedTabIndex + step + total) % total;

    setSelectedTabIndex(newIndex);
    setTimeout(() => {
      scrollThumbnails(newIndex, scrollRef, false);
      scrollThumbnails(newIndex, scrollRefXL, true);
    }, 0);
  };

  const handleNext = () => changeSlide(1);
  const handlePrev = () => changeSlide(-1);

  const bind = useDrag(
    ({ swipe: [swipeX] }) => {
      if (swipeX !== 0) {
        if (swipeX < 0) handleNext();
        else handlePrev();
      }
    },
    {
      axis: "x",
      filterTaps: true,
      pointer: { touch: true },
    },
  );

  const formatNumber = (num: number) => {
    return isRtl ? englishToPersianDigits(num) : formatter.number(num);
  };

  if (tabbedImages.length === 0) return null;

  return (
    <div className="mt-2">
      <Tabs
        dir={direction}
        value={`tab-${selectedTabIndex}`}
        onValueChange={(value) => {
          const index = parseInt(value.replace("tab-", ""), 10);
          setSelectedTabIndex(index);
        }}
      >
        {/* --- MOBILE VIEW (< XL) --- */}
        <div className="xl:hidden">
          {tabbedImages.map((image, i) => (
            <TabsContent
              {...bind()}
              style={{ touchAction: "auto" }}
              key={`content-${i}`}
              value={`tab-${i}`}
            >
              <SharpCard
                className="w-full overflow-hidden rounded-[40px] bg-neutral-100 shadow-sm ring-1 ring-white/10 sm:rounded-b-[40px]"
                style={{ aspectRatio: mobileFrameAspectRatio }}
              >
                <CardContent className="relative h-full">
                  {image && (
                    <GalleryDisplayImage
                      image={image as any}
                      fit={getFitForFrame(image, mobileFrameAspectRatio)}
                      onClick={() => setIsLightboxOpen(true)}
                    />
                  )}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-linear-to-t from-black/80 to-30% inset-shadow-2xs" />
                  <div className="absolute bottom-4 w-full z-10">
                    <div className="flex items-center justify-between px-4">
                      <div className="inline-flex w-fit items-center gap-2">
                        <div className="inline-flex w-fit rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                          {formatNumber(i + 1)}/
                          {formatNumber(tabbedImages.length)}
                        </div>
                        <button
                          onClick={() => setIsLightboxOpen(true)}
                          aria-label="Maximize image"
                          title="Maximize"
                          className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30 backdrop-blur-sm"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex w-fit items-center justify-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                        <button
                          onClick={isRtl ? handleNext : handlePrev}
                          className="rounded-full p-2 transition hover:bg-white/10"
                        >
                          {isRtl ? (
                            <ChevronRightIcon className="h-4 w-4" />
                          ) : (
                            <ChevronLeftIcon className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          onClick={isRtl ? handlePrev : handleNext}
                          className="rounded-full p-2 transition hover:bg-white/10"
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
              </SharpCard>
            </TabsContent>
          ))}
          <TabsList
            ref={scrollRef}
            className={clsx(
              "mt-4 h-full w-full",
              "dark:bg-appleTextBlack/80 overflow-x-auto rounded-[40px] bg-neutral-100 ring-1 ring-white/10",
              "flex scroll-px-6 gap-4 px-6 py-2",
              "hide-scrollbar",
            )}
          >
            {tabbedImages.map((image, i) => (
              <TabsTrigger
                key={`trigger-${i}`}
                value={`tab-${i}`}
                className={clsx("relative h-14 w-14 shrink-0 focus:z-10", {
                  "opacity-50 hover:opacity-100": i !== selectedTabIndex,
                })}
              >
                {image && (
                  <ImageMedia
                    resource={image}
                    fill
                    size="thumbnail"
                    imgClassName="aspect-square cursor-pointer rounded-md object-cover grayscale-[40%] hover:opacity-80 sm:rounded-none sm:grayscale-50"
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* --- DESKTOP VIEW (XL+) --- */}
        <FadeIn className="hidden xl:grid xl:grid-cols-3 xl:grid-rows-3 xl:gap-3">
          {/* Static Featured Image */}
          <SharpCard className="bg-appleTextBlack group relative h-full w-full overflow-hidden shadow-2xs ring-1 inset-shadow-2xs ring-white/10 xl:col-span-1 xl:col-start-1 xl:row-span-3 xl:row-start-1 xl:rounded-[40px]">
            <CardContent className="relative h-full w-full">
              {featuredImage && (
                <GalleryDisplayImage
                  image={featuredImage as any}
                  fit={getFitForFrame(featuredImage, desktopHeroAspectRatio)}
                  onClick={() => {
                    setSelectedTabIndex(0);
                    setIsLightboxOpen(true);
                  }}
                />
              )}
              {/* Corner Maximize Icon on Featured Image */}
              <button
                onClick={() => {
                  setSelectedTabIndex(0);
                  setIsLightboxOpen(true);
                }}
                aria-label="Maximize image"
                title="Maximize"
                className="absolute top-4 end-4 z-20 rounded-full border border-white/10 bg-black/40 p-2.5 text-white opacity-80 backdrop-blur-md transition hover:scale-110 hover:bg-black/70 hover:opacity-100"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </CardContent>
          </SharpCard>

          {/* Interactive Carousel */}
          <div className="xl:col-span-2 xl:col-start-2 xl:row-span-3">
            <div className="grid grid-cols-1 grid-rows-4 gap-y-3">
              <SharpCard className="dark:bg-appleTextBlack aspect-video w-full overflow-hidden bg-neutral-100 shadow-2xs ring-1 inset-shadow-2xs ring-white/10 xl:row-span-3 xl:rounded-[40px]">
                <CardContent className="relative h-full">
                  {tabbedImages.map((image, i) => (
                    <TabsContent key={`contentxl-${i}`} value={`tab-${i}`}>
                      {image && (
                        <GalleryDisplayImage
                          image={image as any}
                          fit={getFitForFrame(image, desktopCarouselAspectRatio)}
                          onClick={() => setIsLightboxOpen(true)}
                        />
                      )}

                      <div className="absolute bottom-4 w-full z-10">
                        <div className="flex items-center justify-between px-4">
                          <div className="inline-flex w-fit items-center gap-2">
                            <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/20 px-3 py-1 text-sm text-white shadow-sm backdrop-blur-sm">
                              {formatNumber(i + 1)}/
                              {formatNumber(tabbedImages.length)}
                            </div>
                            <button
                              onClick={() => setIsLightboxOpen(true)}
                              aria-label="Maximize image"
                              title="Maximize"
                              className="rounded-full border border-white/10 bg-white/20 p-2 text-white transition hover:bg-white/30 backdrop-blur-sm"
                            >
                              <Maximize2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex w-fit items-center justify-center gap-2 rounded-full border border-white/10 bg-white/20 px-3 py-1 text-sm text-white shadow-sm backdrop-blur-sm">
                            <button
                              onClick={handlePrev}
                              className="rounded-full p-2 transition hover:bg-white/10"
                            >
                              {isRtl ? (
                                <ChevronRightIcon className="h-4 w-4 text-white" />
                              ) : (
                                <ChevronLeftIcon className="h-4 w-4 text-white" />
                              )}
                            </button>
                            <button
                              onClick={handleNext}
                              className="rounded-full p-2 transition hover:bg-white/10"
                            >
                              {isRtl ? (
                                <ChevronLeftIcon className="h-4 w-4 text-white" />
                              ) : (
                                <ChevronRightIcon className="h-4 w-4 text-white" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </CardContent>
              </SharpCard>

              {/* Thumbnails (Desktop) */}
              <TabsList
                ref={scrollRefXL}
                className={clsx(
                  "h-full w-full",
                  "xl:row-span-1 xl:rounded-[40px]",
                  "hide-scrollbar flex scroll-px-6 gap-4 overflow-x-auto px-8 py-4",
                  "dark:bg-appleTextBlack bg-neutral-100 shadow-2xs ring-1 inset-shadow-2xs ring-neutral-400/20 dark:ring-white/10",
                )}
              >
                {tabbedImages.map((image, i) => (
                  <TabsTrigger
                    key={`triggerxl-${i}`}
                    value={`tab-${i}`}
                    className={clsx("relative w-48 shrink-0 focus:z-10", {
                      "ring-veryLightGray ring-2 outline-none focus:ring-2":
                        i === selectedTabIndex,
                      "opacity-50 hover:opacity-100": i !== selectedTabIndex,
                    })}
                  >
                    {image && (
                      <ImageMedia
                        resource={image}
                        fill
                        size="thumbnail"
                        imgClassName=" cursor-pointer rounded-md overflow-hidden object-cover hover:opacity-80"
                      />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        </FadeIn>
      </Tabs>

      {/* Fullscreen Lightbox Modal */}
      <FullscreenLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={tabbedImages}
        currentIndex={selectedTabIndex}
        onSelectIndex={(index) => {
          setSelectedTabIndex(index);
          setTimeout(() => {
            scrollThumbnails(index, scrollRef, false);
            scrollThumbnails(index, scrollRefXL, true);
          }, 0);
        }}
        direction={direction}
      />
    </div>
  );
};
