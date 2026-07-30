"use client";

import React, { useState } from "react";
import { CaseStudy } from "@/src/payload-types";
import { Details } from "./details";
import { Title } from "./title";
import RichText from "@/components/RichText/ProjectRichText";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import { useDirection } from "@/utils/hooks/useDirection";
import { FullscreenLightbox } from "./FullscreenLightbox";
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { englishToPersianDigits } from "@/utils/helpers/strings-numbers";
import { useFormatter } from "next-intl";
import clsx from "clsx";

export function NextOfficeLayout({
  post,
  siteLocale,
}: {
  post: CaseStudy;
  siteLocale: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const direction = useDirection();
  const isRtl = direction === "rtl";
  const formatter = useFormatter();

  const { projectGallery, featuredImage, projectDrawings } = post || {};

  const galleryImages =
    projectGallery?.flatMap((item) => item.image || []) || [];
  const photoImages = [featuredImage, ...galleryImages].filter(Boolean);

  const drawingImages =
    projectDrawings?.flatMap((item) => item.drawing || []).filter(Boolean) || [];

  const allImages = [...photoImages, ...drawingImages];

  const activeImage = allImages[selectedIndex] || featuredImage;

  const formatNumber = (num: number) =>
    isRtl ? englishToPersianDigits(num) : formatter.number(num);

  const handleNext = () => setSelectedIndex((selectedIndex + 1) % allImages.length);
  const handlePrev = () => setSelectedIndex((selectedIndex - 1 + allImages.length) % allImages.length);

  return (
    <div className="mt-4">
      {/* ========================================================================= */}
      {/* 3-COLUMN EDITORIAL ARCHITECTURAL LAYOUT (DESKTOP XL+)                      */}
      {/* ========================================================================= */}
      <div className="hidden xl:grid xl:grid-cols-12 xl:gap-8 xl:items-start">
        
        {/* COLUMN 1: Metadata & Specs Sidebar (Sticky Pinned Panel - col-span-3) */}
        <div className="xl:col-span-3 xl:sticky xl:top-24 self-start border-e border-neutral-200/80 pe-6 dark:border-neutral-800">
          <Title post={post} />
          <div className="mt-6">
            <Details post={post} />
          </div>
        </div>

        {/* COLUMN 2: Main Story (Active Photo + Narrative Text - Prominent col-span-6) */}
        <div className="xl:col-span-6 space-y-8">
          {/* Main Display Image */}
          <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-[32px] bg-neutral-900 shadow-md ring-1 ring-black/5">
            {activeImage && (
              <ImageMedia
                resource={activeImage}
                fill
                size="large"
                imgClassName="object-cover cursor-pointer transition-transform duration-500 hover:scale-[1.02]"
                onClick={() => setIsLightboxOpen(true)}
              />
            )}
            
            {/* Light Glass Overlay Buttons (Matching Screenshot) */}
            <div className="absolute inset-x-0 bottom-4 px-4 flex items-center justify-between z-10 pointer-events-none">
              {/* Left Pill: Navigation Arrows */}
              {allImages.length > 1 ? (
                <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/20 bg-white/20 px-3 py-1.5 text-white shadow-sm backdrop-blur-md">
                  <button
                    onClick={isRtl ? handleNext : handlePrev}
                    className="rounded-full p-1 transition hover:bg-white/20 cursor-pointer"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                  </button>
                  <button
                    onClick={isRtl ? handlePrev : handleNext}
                    className="rounded-full p-1 transition hover:bg-white/20 cursor-pointer"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                  </button>
                </div>
              ) : (
                <div />
              )}

              {/* Right Pill: Maximize Icon + Counter Badge */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                title="Maximize image"
                className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-md transition hover:bg-white/30 cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>{formatNumber(selectedIndex + 1)} / {formatNumber(allImages.length)}</span>
              </div>
            </div>
          </div>

          {/* Project Narrative Text */}
          <div className="prose dark:prose-invert max-w-none">
            <RichText
              data={post.details}
              enableGutter={false}
              enableProse={true}
              locale={siteLocale}
            />
          </div>
        </div>

        {/* COLUMN 3: Uniform Photo Grid & Architectural Drawings (col-span-3) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Photo Gallery Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                {isRtl ? "گالری تصاویر پروژه" : "Project Gallery"}
              </h3>
              <span className="text-xs text-neutral-400">
                {formatNumber(photoImages.length)} {isRtl ? "تصویر" : "Photos"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {photoImages.map((img, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={clsx(
                      "group relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 transition-all duration-300 cursor-pointer",
                      isSelected
                        ? "ring-2 ring-neutral-950 dark:ring-white scale-[0.98] opacity-100 shadow-md"
                        : "opacity-75 hover:opacity-100 hover:scale-[1.02]",
                    )}
                  >
                    <ImageMedia
                      resource={img}
                      fill
                      size="thumbnail"
                      imgClassName="object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/10 border-2 border-neutral-950 dark:border-white rounded-xl pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dedicated Architectural Drawings & Floor Plans Section (If Exists) */}
          {drawingImages.length > 0 && (
            <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  {isRtl ? "مدارک و نقشه‌های معماری" : "Architectural Drawings & Plans"}
                </h3>
                <span className="text-xs text-neutral-400">
                  {formatNumber(drawingImages.length)} {isRtl ? "نقشه" : "Drawings"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {drawingImages.map((drawing, idx) => {
                  const globalIndex = photoImages.length + idx;
                  const isSelected = selectedIndex === globalIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedIndex(globalIndex)}
                      title={isRtl ? "مشاهده نقشه معماری" : "View Floor Plan"}
                      className={clsx(
                        "group relative aspect-square w-full overflow-hidden rounded-xl bg-white dark:bg-neutral-900 transition-all duration-300 cursor-pointer border border-neutral-200 dark:border-white/10 p-1",
                        isSelected
                          ? "ring-2 ring-neutral-950 dark:ring-white scale-[0.98] opacity-100 shadow-md"
                          : "opacity-75 hover:opacity-100 hover:scale-[1.02]",
                      )}
                    >
                      <ImageMedia
                        resource={drawing}
                        fill
                        size="thumbnail"
                        imgClassName="object-contain"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/5 border-2 border-neutral-950 dark:border-white rounded-xl pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET VIEW (< XL)                                              */}
      {/* ========================================================================= */}
      <div className="xl:hidden space-y-8">
        <Title post={post} />

        {/* Main Display Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-md">
          {activeImage && (
            <ImageMedia
              resource={activeImage}
              fill
              size="large"
              imgClassName="object-cover cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            />
          )}

          {/* Light Glass Overlay Buttons */}
          <div className="absolute inset-x-0 bottom-4 px-4 flex items-center justify-between z-10 pointer-events-none">
            {allImages.length > 1 ? (
              <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/20 bg-white/20 px-3 py-1.5 text-white shadow-sm backdrop-blur-md">
                <button
                  onClick={isRtl ? handleNext : handlePrev}
                  className="rounded-full p-1 transition hover:bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                </button>
                <button
                  onClick={isRtl ? handlePrev : handleNext}
                  className="rounded-full p-1 transition hover:bg-white/20"
                >
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </button>
              </div>
            ) : (
              <div />
            )}

            <div
              onClick={() => setIsLightboxOpen(true)}
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur-md transition hover:bg-white/30 cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>{formatNumber(selectedIndex + 1)} / {formatNumber(allImages.length)}</span>
            </div>
          </div>
        </div>

        {/* Uniform Grid of equal square thumbnails */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            {isRtl ? "تصاویر پروژه" : "Gallery"}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={clsx(
                  "relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 transition cursor-pointer",
                  index === selectedIndex
                    ? "ring-2 ring-neutral-950 dark:ring-white opacity-100"
                    : "opacity-75 hover:opacity-100",
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

        {/* Details Specs Card (Right after gallery on mobile) */}
        <Details post={post} />

        {/* Narrative Description */}
        <div className="prose dark:prose-invert max-w-none">
          <RichText
            data={post.details}
            enableGutter={false}
            enableProse={true}
            locale={siteLocale}
          />
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <FullscreenLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={allImages}
        currentIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
        direction={direction}
      />
    </div>
  );
}
