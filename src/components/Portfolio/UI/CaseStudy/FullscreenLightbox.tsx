"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import { englishToPersianDigits } from "@/utils/helpers/strings-numbers";
import { useFormatter } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
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

  // Track page direction for smooth slide transitions (1 = forward, -1 = backward)
  const [slideDirection, setSlideDirection] = useState(0);

  // Track image loading state to show placeholder/spinner until image is fully loaded
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Preload adjacent images for instant switching
  useEffect(() => {
    if (!isOpen || images.length <= 1) return;

    const nextIdx = (currentIndex + 1) % images.length;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;

    [images[nextIdx], images[prevIdx]].forEach((img) => {
      const url =
        typeof img === "object" && img?.url
          ? img.url
          : typeof img === "string"
          ? img
          : null;
      if (url) {
        const imgObj = new Image();
        imgObj.src = url;
      }
    });
  }, [currentIndex, isOpen, images]);

  // Physical Right navigation (always moves to the visually right thumbnail & slides right)
  const handlePhysicalRight = () => {
    setSlideDirection(1);
    setIsImageLoading(true);
    // In RTL, thumbnails go 0 -> 1 -> 2 from right to left, so rightward thumbnail is index - 1.
    // In LTR, thumbnails go 0 -> 1 -> 2 from left to right, so rightward thumbnail is index + 1.
    const targetIdx = isRtl
      ? (currentIndex - 1 + images.length) % images.length
      : (currentIndex + 1) % images.length;
    onSelectIndex(targetIdx);
  };

  // Physical Left navigation (always moves to the visually left thumbnail & slides left)
  const handlePhysicalLeft = () => {
    setSlideDirection(-1);
    setIsImageLoading(true);
    const targetIdx = isRtl
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;
    onSelectIndex(targetIdx);
  };

  const handleThumbnailClick = (idx: number) => {
    if (idx === currentIndex) return;
    // Determine physical movement direction based on layout direction
    const isMovingRight = isRtl ? idx < currentIndex : idx > currentIndex;
    setSlideDirection(isMovingRight ? 1 : -1);
    setIsImageLoading(true);
    onSelectIndex(idx);
  };

  const bindModalDrag = useDrag(
    ({ swipe: [swipeX, swipeY] }) => {
      if (swipeY !== 0) {
        onClose();
        return;
      }
      if (swipeX !== 0) {
        // Swiping left moves to the right item; swiping right moves to the left item
        if (swipeX < 0) handlePhysicalRight();
        else handlePhysicalLeft();
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
        handlePhysicalRight();
      } else if (e.key === "ArrowLeft") {
        handlePhysicalLeft();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, isRtl]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const formatNumber = (num: number) =>
    isRtl ? englishToPersianDigits(num) : formatter.number(num);

  const placeholderUrl =
    typeof currentImage === "object"
      ? currentImage?.placeholder ||
        currentImage?.sizes?.thumbnail?.url ||
        currentImage?.sizes?.card?.url ||
        currentImage?.url
      : null;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : dir < 0 ? -100 : 0,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : dir > 0 ? -100 : 0,
      opacity: 0,
      scale: 0.96,
      transition: {
        opacity: { duration: 0.15 },
        scale: { duration: 0.15 },
      },
    }),
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 p-4 sm:p-6 backdrop-blur-xl select-none"
      >
        {/* Top Controls Header */}
        <div className="flex items-center justify-between text-white z-20 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-md shadow-lg">
              {formatNumber(currentIndex + 1)} / {formatNumber(images.length)}
            </div>
            {currentImage?.caption && (
              <span className="hidden sm:inline-block text-sm text-neutral-300 max-w-md truncate">
                {currentImage.caption}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close fullscreen view"
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-white/25 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <span>{isRtl ? "بستن" : "Close"}</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Main Image View with Motion Slider & Preloading */}
        <div
          {...bindModalDrag()}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="relative flex flex-1 items-center justify-center my-2 overflow-hidden touch-none"
        >
          {/* Physical Left Navigation Button (Navigates to the thumbnail on the left) */}
          <button
            onClick={handlePhysicalLeft}
            aria-label="Previous image"
            className="absolute start-2 sm:start-8 z-30 rounded-full border border-white/15 bg-black/60 p-3.5 text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:bg-black/90 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
          </button>

          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
            className="relative h-full w-full p-2 sm:p-6 flex items-center justify-center"
          >
            <AnimatePresence custom={slideDirection} mode="wait">
              <motion.div
                key={currentIndex}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative h-full w-full flex items-center justify-center"
              >
                {/* 1. Low-Res Blur Placeholder / Skeleton while high-res original image loads */}
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {placeholderUrl ? (
                      <img
                        src={placeholderUrl}
                        alt="Placeholder"
                        className="h-full w-full object-contain filter blur-lg opacity-60 transition-opacity duration-300 scale-98"
                      />
                    ) : null}
                    <div className="absolute flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs text-white/80 backdrop-blur-md shadow-2xl">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>{isRtl ? "در حال بارگذاری..." : "Loading..."}</span>
                    </div>
                  </div>
                )}

                {/* 2. Full High-Res Original Image */}
                {currentImage && (
                  <div
                    className={clsx(
                      "relative h-full w-full transition-opacity duration-300",
                      isImageLoading ? "opacity-0" : "opacity-100",
                    )}
                  >
                    <ImageMedia
                      resource={currentImage}
                      fill
                      disableSources
                      size="100vw"
                      imgClassName="object-contain drop-shadow-2xl"
                      onLoad={() => setIsImageLoading(false)}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Physical Right Navigation Button (Navigates to the thumbnail on the right) */}
          <button
            onClick={handlePhysicalRight}
            aria-label="Next image"
            className="absolute end-2 sm:end-8 z-30 rounded-full border border-white/15 bg-black/60 p-3.5 text-white shadow-2xl backdrop-blur-md transition-all duration-200 hover:bg-black/90 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-6 w-6 rtl:rotate-180" />
          </button>
        </div>

        {/* Bottom Thumbnails Carousel with Active Glow */}
        <div className="flex flex-col items-center justify-center gap-2 py-2 z-20">
          <div className="flex items-center justify-center overflow-x-auto max-w-full hide-scrollbar px-4">
            <div className="flex gap-3 px-2 py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={clsx(
                    "relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl transition-all duration-300 cursor-pointer shadow-md",
                    idx === currentIndex
                      ? "ring-2 ring-white scale-110 shadow-white/20 shadow-lg z-10"
                      : "opacity-40 hover:opacity-100 hover:scale-105",
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
      </motion.div>
    </AnimatePresence>
  );
}
