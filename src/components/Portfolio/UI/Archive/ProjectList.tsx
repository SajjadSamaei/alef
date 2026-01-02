"use client";

import React from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import type { CaseStudy } from "@/src/payload-types";
import { Project } from "@/components/Portfolio/UI/Archive/Project";
import { useLocale } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";
import { cn } from "@/utils/cn";

export type Props = {
  posts: CaseStudy[];
};

export const ProjectList: React.FC<Props> = (props) => {
  const { posts } = props;
  const locale = useLocale();
  const direction = getDirection(locale);
  const isRtl = direction === "rtl";
  const length = posts?.length || 0;

  const getCornerClass = (corner: "tl" | "tr" | "bl" | "br") => {
    const map = {
      tl: isRtl ? "sm:rounded-tr-[40px]" : "sm:rounded-tl-[40px]",
      tr: isRtl ? "sm:rounded-tl-[40px]" : "sm:rounded-tr-[40px]",
      bl: isRtl ? "sm:rounded-br-[40px]" : "sm:rounded-bl-[40px]",
      br: isRtl ? "sm:rounded-bl-[40px]" : "sm:rounded-br-[40px]",
    };
    return map[corner];
  };

  const getItemStyles = (index: number) => {
    let colSpan = "sm:col-span-4";
    let imageSize: "card" | "xlarge" | "square" = "card";
    const roundingClasses: string[] = [];

    // --- 1. Layout (Grid Spans & Image Sizes) ---
    if (length === 1) {
      colSpan = "sm:col-span-12";
      imageSize = "xlarge";
    } else {
      if (index === 0) {
        colSpan = "sm:col-span-8";
        imageSize = "xlarge";
      } else if (index === 1) {
        colSpan = "sm:col-span-4";
        imageSize = "square";
      } else if (index === 2) {
        colSpan = "sm:col-span-4";
        imageSize = "square";
      } else if (index === 3) {
        colSpan = "sm:col-span-8";
        imageSize = "xlarge";
      } else {
        colSpan = "sm:col-span-4";
        imageSize = "card";
      }
    }

    // --- 2. Row Logic ---
    const isRow1End = index === 1 || (index === 0 && length === 1);

    // Calculate Grid Section (Index 4+)
    let lastRowStartIndex = 0;
    if (length <= 2) lastRowStartIndex = 0;
    else if (length <= 4) lastRowStartIndex = 2;
    else {
      const gridCount = length - 4;
      const gridRows = Math.ceil(gridCount / 3);
      lastRowStartIndex = 4 + (gridRows - 1) * 3;
    }

    const isLastRow = index >= lastRowStartIndex;

    const isVisualRowStart =
      index === 0 || index === 2 || (index >= 4 && (index - 4) % 3 === 0);

    const isVisualRowEnd =
      index === 1 ||
      index === 3 ||
      (index >= 4 && (index - 4) % 3 === 2) ||
      index === length - 1;

    // --- 3. Corner Logic ---

    // Mobile Defaults
    if (index === 0) roundingClasses.push("rounded-t-[40px]");
    if (index === length - 1) roundingClasses.push("rounded-b-[40px]");

    // Desktop Reset
    roundingClasses.push("sm:rounded-none");

    // Desktop Corners
    if (index === 0) roundingClasses.push(getCornerClass("tl"));
    if (isRow1End) roundingClasses.push(getCornerClass("tr"));
    if (isLastRow && isVisualRowStart)
      roundingClasses.push(getCornerClass("bl"));
    if (index === length - 1 || (isLastRow && isVisualRowEnd)) {
      roundingClasses.push(getCornerClass("br"));
    }

    return {
      colSpan,
      corners: cn(roundingClasses),
      imageSize,
    };
  };

  return (
    <div className="container">
      <div className="grid grid-cols-1 items-stretch gap-x-4 gap-y-4 sm:grid-cols-12 lg:gap-x-3 lg:gap-y-3 xl:gap-x-3">
        {posts?.map((result, index) => {
          if (typeof result === "object" && result !== null) {
            const styles = getItemStyles(index);
            return (
              <FadeIn
                key={index}
                // FIX: Apply ONLY grid positioning to the wrapper
                className={cn("h-full", styles.colSpan)}
              >
                <Project
                  // FIX: Apply rounding classes to the Card itself
                  className={cn("h-full", styles.corners)}
                  doc={result}
                  relationTo="case-studies"
                  showCategories
                  imageSize={styles.imageSize}
                />
              </FadeIn>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
