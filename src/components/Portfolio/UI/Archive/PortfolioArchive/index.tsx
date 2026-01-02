import { cn } from "@/utils/cn";
import React, { useMemo } from "react";
import type { CaseStudy } from "@/src/payload-types";
import { Card } from "@/components/Portfolio/UI/Archive/Card";
import { useLocale } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";

export type Props = {
  projects: CaseStudy[];
};

export const PortfolioArchive: React.FC<Props> = (props) => {
  const { projects } = props;
  const length = projects?.length || 0;
  const locale = useLocale();
  const direction = getDirection(locale);
  const isRtl = direction === "rtl";

  // --- 1. Calculate Last Row Start Index ---
  // The layout pattern is:
  // Row 1: 2 items (Indices 0, 1)
  // Row 2: 2 items (Indices 2, 3)
  // Row 3+: 3 items per row (Indices 4, 5, 6...)
  const lastRowStartIndex = useMemo(() => {
    if (length <= 2) return 0; // Row 1 is the last row
    if (length <= 4) return 2; // Row 2 is the last row

    // For items after index 3 (the grid section):
    // We remove the first 4 items, then find the start of the last chunk of 3
    const gridCount = length - 4;
    const remainder = gridCount % 3;

    // If remainder is 0 (e.g., 7 items total -> 3 grid items), start is length - 3
    // If remainder is 1 or 2, start is length - remainder
    const itemsInLastGridRow = remainder === 0 ? 3 : remainder;
    return length - itemsInLastGridRow;
  }, [length]);

  // --- 2. Helper for Directional Corners ---
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
    // --- A. Layout (Column Span) ---
    let colSpan = "sm:col-span-4"; // Default to 1/3 width

    // Edge Case: Single item gets full width
    if (length === 1) {
      colSpan = "sm:col-span-12";
    } else {
      // Standard Pattern
      if (index === 0)
        colSpan = "sm:col-span-8"; // Big
      else if (index === 1)
        colSpan = "sm:col-span-4"; // Small
      else if (index === 2)
        colSpan = "sm:col-span-4"; // Small
      else if (index === 3) colSpan = "sm:col-span-8"; // Big
      // Index 4+ keeps default sm:col-span-4
    }

    // --- B. Corners ---
    const corners: string[] = [];

    // 1. Mobile Styles (Stacked)
    // Always round top of first, bottom of last. Reset on sm.
    if (index === 0) corners.push("rounded-t-[40px]");
    if (index === length - 1) corners.push("rounded-b-[40px]");

    // 2. Desktop Styles (Grid)
    // Reset mobile corners first
    corners.push("sm:rounded-none");

    const isFirstRow = index < (length === 1 ? 1 : 2); // Row 1 ends at index 1 (unless len=1)
    const isRowStart =
      index === 0 || index === 2 || (index >= 4 && (index - 4) % 3 === 0);
    const isRowEnd =
      index === 1 ||
      index === 3 ||
      (index >= 4 && (index - 4) % 3 === 2) ||
      index === length - 1; // Last item always closes row visually in flex/grid
    const isInLastRow = index >= lastRowStartIndex;

    // Top Left Corner
    if (index === 0) {
      corners.push(getCornerClass("tl"));
    }

    // Top Right Corner
    // It's the top right if it's the last item of the first row
    // (Which is index 1, OR index 0 if length is 1)
    if (index === 1 || (index === 0 && length === 1)) {
      corners.push(getCornerClass("tr"));
    }

    // Bottom Left Corner
    // First item of the last row
    if (isInLastRow && isRowStart) {
      corners.push(getCornerClass("bl"));
    }

    // Bottom Right Corner
    // Very last item of the array
    if (index === length - 1) {
      corners.push(getCornerClass("br"));
    }

    return cn(colSpan, corners);
  };

  const getImageSize = (index: number) => {
    // Optimization: Only load large images for the big tiles (0 and 3)
    // or if there is only 1 item total.
    if (length === 1) return "xlarge";
    if (index === 0 || index === 3) return "xlarge";
    return "card";
  };

  return (
    <div className="container">
      <div className="grid grid-cols-1 items-stretch gap-x-4 gap-y-4 sm:grid-cols-12 lg:gap-x-3 lg:gap-y-3 xl:gap-x-3">
        {projects?.map((result, index) => {
          if (typeof result === "object" && result !== null) {
            return (
              <Card
                key={index}
                className={cn("h-full", getItemStyles(index))}
                doc={result}
                relationTo="case-studies"
                showCategories
                imageSize={getImageSize(index)}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
