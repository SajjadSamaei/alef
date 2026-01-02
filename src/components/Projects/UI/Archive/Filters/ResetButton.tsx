// src/components/Portfolio/UI/Archive/Filters/ResetButton.tsx
"use client";
import { usePortfolioFilterContext } from "./FilterProvider";
import { ButtonCustomColor } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const ALL_VALUE = "all";

export const ResetButton = () => {
  const { filters, setFilters } = usePortfolioFilterContext();
  const t = useTranslations("BlogFilters");

  const handleReset = () => {
    setFilters({
      projectType: ALL_VALUE,
      projectStatus: ALL_VALUE,
      year: ALL_VALUE,
      author: ALL_VALUE,
      q: "",
    });
  };

  // Check if any filter is active
  // We check for existence first to be safe, then value
  const isFilterActive =
    (filters.projectType && filters.projectType !== ALL_VALUE) ||
    (filters.projectStatus && filters.projectStatus !== ALL_VALUE) ||
    (filters.year && filters.year !== ALL_VALUE) ||
    (filters.author && filters.author !== ALL_VALUE) ||
    (filters.q && filters.q !== "");

  // Conditionally render the button only if a filter is active
  if (!isFilterActive) {
    return null;
  }

  return (
    <ButtonCustomColor
      className="w-fit bg-neutral-950 text-sm! text-white! hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
      onClick={handleReset}
      aria-label="Reset Filters"
    >
      {t("reset-filters")}
    </ButtonCustomColor>
  );
};
