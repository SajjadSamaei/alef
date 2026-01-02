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
import { useRef, useState } from "react";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import { useDirection } from "@/utils/hooks/useDirection";
import React from "react";
import type { CaseStudy } from "@/src/payload-types";

export const ImagesGrid: React.FC<{
  post: CaseStudy;
}> = ({ post }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRefXL = useRef<HTMLDivElement>(null);

  // --- Optimized Scroll Logic ---
  const scrollThumbnails = (
    index: number,
    ref: React.RefObject<HTMLDivElement | null>,
    isLarge: boolean,
  ) => {
    if (!ref.current) return;

    const gap = isLarge ? 32 : 16;
    const width = isLarge ? 400 : 120;
    const itemFullWidth = width + gap;

    // Calculate the center position
    const containerWidth = ref.current.offsetWidth;
    const centerOffset = containerWidth / 2 - itemFullWidth / 2;
    const targetPos = index * itemFullWidth - centerOffset;

    // In RTL, scrollLeft is often negative (Chrome) or inverted (Firefox).
    // Using 'scrollTo' with absolute values works best if we account for directionality manually.
    // However, the simplest cross-browser fix for RTL lists is to find the child node and scroll it into view.
    const childNode = ref.current.children[index] as HTMLElement;
    if (childNode) {
      // scrollIntoView with inline: 'center' handles RTL/LTR automatically in modern browsers
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
    // Use timeout to ensure DOM update (if any) before scrolling
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
        if (isRtl) {
          // RTL Swipe Left (<--) means Next
          if (swipeX < 0) handleNext();
          else handlePrev();
        } else {
          // LTR Swipe Left (<--) means Next
          if (swipeX < 0) handleNext();
          else handlePrev();
        }
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
              <SharpCard className="aspect-[9/16] w-full overflow-hidden rounded-[40px] shadow-sm ring-1 ring-white/10 sm:aspect-video sm:rounded-b-[40px]">
                <CardContent className="relative h-full">
                  {image && <ImageMedia resource={image} fill />}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-t from-black/80 to-30% inset-shadow-2xs" />
                  <div className="absolute bottom-4 w-full">
                    <div className="flex items-center justify-between px-4">
                      <div className="inline-flex w-fit rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                        {formatNumber(i + 1)}/
                        {formatNumber(tabbedImages.length)}
                      </div>
                      <div className="flex w-fit items-center justify-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
                        {/* RTL FIX: 
                           In RTL, Right Arrow (>) should visually go to the 'Previous' item (which is to the right).
                           Left Arrow (<) should visually go to the 'Next' item (which is to the left).
                        */}
                        <button
                          // Button 1: Left Visual Position
                          // LTR: Prev | RTL: Next (Left arrow goes leftwards)
                          onClick={isRtl ? handleNext : handlePrev}
                          className="rounded-full p-2 transition hover:bg-white/10"
                        >
                          {isRtl ? (
                            // RTL: Show Left Icon for "Next" action
                            <ChevronRightIcon className="h-4 w-4" />
                          ) : (
                            <ChevronLeftIcon className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          // Button 2: Right Visual Position
                          // LTR: Next | RTL: Prev (Right arrow goes rightwards)
                          onClick={isRtl ? handlePrev : handleNext}
                          className="rounded-full p-2 transition hover:bg-white/10"
                        >
                          {isRtl ? (
                            // RTL: Show Right Icon for "Prev" action
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
          <SharpCard className="bg-appleTextBlack h-full w-full overflow-hidden shadow-2xs ring-1 inset-shadow-2xs ring-white/10 xl:col-span-1 xl:col-start-1 xl:row-span-3 xl:row-start-1 xl:rounded-[40px]">
            <CardContent className="relative h-full w-full">
              {featuredImage && (
                <ImageMedia
                  resource={featuredImage}
                  fill
                  size="card"
                  className="object-cover"
                />
              )}
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
                        <ImageMedia
                          resource={image}
                          fill
                          imgClassName="object-cover"
                        />
                      )}

                      <div className="absolute bottom-4 w-full">
                        <div className="flex items-center justify-between px-4">
                          <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/20 px-3 py-1 text-sm text-white shadow-sm backdrop-blur-sm">
                            {formatNumber(i + 1)}/
                            {formatNumber(tabbedImages.length)}
                          </div>
                          <div className="flex w-fit items-center justify-center gap-2 rounded-full border border-white/10 bg-white/20 px-3 py-1 text-sm text-white shadow-sm backdrop-blur-sm">
                            {/* SAME LOGIC FOR DESKTOP
                             */}
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
    </div>
  );
};
