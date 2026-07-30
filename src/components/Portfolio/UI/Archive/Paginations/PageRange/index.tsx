// src/components/PageRange.tsx
"use client";

import { cn } from "@/utils/cn"; // Assuming you use shadcn's cn utility
import { useFormatter, useTranslations } from "next-intl";
import React from "react";

export const PageRange: React.FC<{
  className?: string;
  /**
   * The translation key for the noun, e.g., "Blog.articles".
   * This key must have pluralization defined in your JSON files.
   * Espects something like this:
   * <PageRange
  nounKey="Users.users"
  currentPage={userPage.page}
  limit={userPage.limit}
  totalDocs={userPage.totalDocs}
/>
   */
  nounKey: string;
  currentPage?: number;
  limit?: number;
  totalDocs?: number;
}> = (props) => {
  const t = useTranslations();
  const format = useFormatter();
  const { className, nounKey, currentPage = 1, limit = 12, totalDocs } = props;

  // Handle "No Results" case
  if (typeof totalDocs === "undefined" || totalDocs === 0) {
    return (
      <div className={cn("text-appletextgray font-base text-base", className)}>
        {t("Pagination.noResults")}
      </div>
    );
  }

  // Calculate page range
  const indexStart = (currentPage - 1) * limit + 1;
  let indexEnd = currentPage * limit;
  if (indexEnd > totalDocs) indexEnd = totalDocs;

  // Format numbers for the current locale
  const fIndexStart = format.number(indexStart);
  const fIndexEnd = format.number(indexEnd);
  const fTotalDocs = format.number(totalDocs);

  // Get the localized and pluralized noun
  // `t` will automatically pick singular or plural based on `totalDocs`
  const noun = t(nounKey, { count: totalDocs });

  // Determine the range string (e.g., "1 - 10" or just "1")
  const range = indexStart === indexEnd ? "" : ` - ${fIndexEnd}`;

  return (
    <div className={cn("text-appletextgray font-base text-base", className)}>
      {t("Pagination.showing", {
        start: fIndexStart,
        range: range, // This will be " - 10" or ""
        total: fTotalDocs,
        noun: noun,
      })}
    </div>
  );
};
