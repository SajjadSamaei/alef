import { cn } from "@/utils/cn";
import React from "react";
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
  const direction = getDirection(locale); // "ltr" or "rtl"

  // Helper to determine layout classes for each item
  const getItemStyles = (index: number) => {
    let colSpan = "sm:col-span-4"; // Default 3-column grid item
    let corners = "";

    // 1. Determine Column Span (Layout Pattern)
    if (index === 0) colSpan = "sm:col-span-8";
    else if (index === 1) colSpan = "sm:col-span-4";
    else if (index === 2) colSpan = "sm:col-span-4";
    else if (index === 3) colSpan = "sm:col-span-8";

    // 2. Determine Row Position (Start/End of Row)
    const isRowStart =
      index === 0 || index === 2 || (index >= 4 && (index - 4) % 3 === 0);

    const isRowEnd =
      index === 1 || index === 3 || (index >= 4 && (index - 4) % 3 === 2);

    // 3. Determine Last Row Status
    let lastRowStartIndex = 0;
    if (length <= 2) lastRowStartIndex = 0;
    else if (length <= 4) lastRowStartIndex = 2;
    else {
      // For grid part (index 4+), calculate start of the last chunk of 3
      const gridCount = length - 4;
      const gridRows = Math.ceil(gridCount / 3);
      lastRowStartIndex = 4 + (gridRows - 1) * 3;
    }
    const isLastRow = index >= lastRowStartIndex;

    // 4. Assign Corner Classes

    // --- Mobile Defaults (Stacked) ---
    // First item gets top rounded, Last item gets bottom rounded
    if (index === 0) corners += "rounded-t-[40px] ";
    if (index === length - 1) corners += "rounded-b-[40px] ";

    // --- Desktop Overrides (Grid) ---
    // Reset mobile corners for desktop to prevent conflicts
    if (index === 0) {
      corners +=
        direction === "rtl" ? "sm:rounded-tl-none " : "sm:rounded-tr-none ";
    }

    // Top-Start (Top-Left in LTR)
    if (index === 0) {
      corners +=
        direction === "rtl" ? "sm:rounded-tr-[40px] " : "sm:rounded-tl-[40px] ";
    }

    // Top-End (Top-Right in LTR)
    if (index === 1) {
      corners +=
        direction === "rtl" ? "sm:rounded-tl-[40px] " : "sm:rounded-tr-[40px] ";
    }

    // Bottom-Start (Bottom-Left in LTR)
    if (isLastRow && isRowStart) {
      if (index === length - 1) {
        corners +=
          direction === "rtl" ? "sm:rounded-bl-none " : "sm:rounded-br-none ";
      }
      corners +=
        direction === "rtl" ? "sm:rounded-br-[40px] " : "sm:rounded-bl-[40px] ";
    }

    // Bottom-End (Bottom-Right in LTR)
    if (isLastRow && isRowEnd) {
      if (index === length - 1) {
        corners +=
          direction === "rtl" ? "sm:rounded-br-none " : "sm:rounded-bl-none ";
      }
      corners +=
        direction === "rtl" ? "sm:rounded-bl-[40px] " : "sm:rounded-br-[40px] ";
    }

    return cn(colSpan, corners);
  };

  return (
    <div className={cn("container")}>
      <div>
        <div className="grid grid-cols-1 items-stretch gap-x-4 gap-y-4 sm:grid-cols-12 lg:gap-x-3 lg:gap-y-3 xl:gap-x-3">
          {projects?.map((result, index) => {
            if (typeof result === "object" && result !== null) {
              // 👇 FIX: Pass calculated classes directly to Card, NO wrapper div
              return (
                <Card
                  key={index}
                  className={cn("h-full", getItemStyles(index))}
                  doc={result}
                  relationTo="case-studies"
                  showCategories
                  imageSize={index === 0 || index === 3 ? "xlarge" : "card"}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
