"use client";

import React, { useEffect } from "react";
import { useDrag } from "@use-gesture/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import { englishToPersianDigits } from "@/utils/helpers/strings-numbers";
import { useFormatter } from "next-intl";
import clsx from "clsx";

export function FullscreenLightbox({
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
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 hover:scale-105 active:scale-95 cursor-pointer"
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
          className="absolute start-2 sm:start-8 z-30 rounded-full border border-white/10 bg-black/60 p-3 text-white transition hover:bg-black/90 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
        </button>

        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="relative h-full w-full p-2 sm:p-6"
        >
          {currentImage && (
            <ImageMedia
              resource={currentImage}
              fill
              disableSources
              size="100vw"
              imgClassName="object-contain"
            />
          )}
        </div>

        <button
          onClick={isRtl ? handlePrev : handleNext}
          aria-label="Next image"
          className="absolute end-2 sm:end-8 z-30 rounded-full border border-white/10 bg-black/60 p-3 text-white transition hover:bg-black/90 hover:scale-110 active:scale-95 cursor-pointer"
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
