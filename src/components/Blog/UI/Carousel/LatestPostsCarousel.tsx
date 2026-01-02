"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import useMeasure from "react-use-measure";
import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useDirection } from "@/utils/hooks/useDirection";
import { BlogCard, ViewAllCard } from "./BlogCards";
import type { Post } from "@/src/payload-types";

export function LatestPostsCarousel({ posts }: { posts: Post[] }) {
  const direction = useDirection();
  const isRtl = direction === "rtl";

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollX } = useScroll({ container: scrollRef });
  const [measureRef, bounds] = useMeasure();
  const [activeIndex, setActiveIndex] = useState(0);

  // Total items = posts + 1 CTA card
  const totalItems = posts.length + 1;

  useMotionValueEvent(scrollX, "change", () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const rawScroll = container.scrollLeft;

    let normalizedScroll;

    if (container.dir === "rtl") {
      if (rawScroll <= 0) {
        normalizedScroll = Math.abs(rawScroll);
      } else {
        normalizedScroll = maxScroll - rawScroll;
      }
    } else {
      normalizedScroll = rawScroll;
    }

    // Safety check for children
    if(container.children.length === 0) return;

    const cardWidth = (container.children[0] as HTMLElement).clientWidth;
    const gap = 16;
    const step = cardWidth + gap;

    const index = Math.round(normalizedScroll / step);
    setActiveIndex(index);
  });

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    if (container.children.length === 0) return;
    const cardWidth = (container.children[0] as HTMLElement).clientWidth;
    const gap = 16;
    const step = cardWidth + gap;
    const maxScroll = container.scrollWidth - container.clientWidth;

    const targetScroll = step * index;
    let targetLeft;

    if (container.dir === "rtl") {
      const isWebKitRTL = container.scrollLeft <= 0;
      if (isWebKitRTL) {
        targetLeft = -targetScroll;
      } else {
        targetLeft = maxScroll - targetScroll;
      }
    } else {
      targetLeft = targetScroll;
    }

    container.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    if (activeIndex > 0) scrollTo(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex < totalItems - 1) scrollTo(activeIndex + 1);
  };

  const PrevIcon = isRtl ? ChevronRightIcon : ChevronLeftIcon;
  const NextIcon = isRtl ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <div className="relative w-full" ref={measureRef}>
      {/* Scrollable area */}
      <div
        dir={direction}
        ref={scrollRef}
        className={clsx([
          "mx-auto mt-2 flex gap-4 px-[2rem] pb-8 md:px-[3rem] lg:px-[4.5rem] xl:px-[9.5rem]",
          "scrollbar-hide", // Make sure you have a utility for hiding scrollbar
          "snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth",
          // Padding calculations to center the active item
          "[scroll-padding-inline:calc(50%-9rem)]", // 72*4 / 2 = ~18rem / 2 = 9rem ? 
          "sm:[scroll-padding-inline:calc(50%-10rem)]", 
        ])}
        style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
        }}
      >
        {/* Render Posts */}
        {posts.map((post, index) => (
          <BlogCard
            key={post.id}
            post={post}
            index={index}
            length={totalItems}
            isActive={index === activeIndex}
            bounds={bounds}
            scrollX={scrollX}
          />
        ))}

        {/* Render CTA Card at the end */}
        <ViewAllCard 
            index={posts.length} // Index is after last post
            length={totalItems}
            bounds={bounds}
            scrollX={scrollX}
        />

        {/* Spacer for right side padding balance on mobile */}
        <div className="w-[1rem] shrink-0 sm:hidden" />
      </div>

      {/* Controls section */}
      <div className="mx-auto my-6 mt-2 flex items-center justify-between gap-4 px-[2rem] pb-8 md:px-[3rem] lg:px-[4.5rem] xl:px-[9.5rem]">
        {/* Navigation buttons */}
        <div className="flex transform justify-center gap-4 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className={clsx(
              "flex items-center justify-center rounded-full p-2 transition",
              "hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            <PrevIcon className="h-6 w-6 text-black dark:text-white" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex >= totalItems - 1}
            className={clsx(
              "flex items-center justify-center rounded-full p-2 transition",
              "hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            <NextIcon className="h-6 w-6 text-black dark:text-white" />
          </button>
        </div>

        {/* Index dots (Mobile only) */}
        <div className="flex items-center justify-center gap-2 overflow-hidden rounded-full px-4 py-2 sm:hidden">
          {Array.from({ length: totalItems }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={clsx(
                "h-2 w-2 rounded-full transition",
                i === activeIndex ? "scale-125 bg-black dark:bg-white" : "bg-neutral-400/50",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}