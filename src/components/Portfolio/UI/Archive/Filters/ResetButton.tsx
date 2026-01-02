// src/components/blog/archive/Filters/ResetButton.tsx
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
      category: ALL_VALUE,
      year: ALL_VALUE,
      month: ALL_VALUE,
      q: "",
    });
  };

  // Check if any filter is active
  const isFilterActive =
    filters.category !== ALL_VALUE ||
    filters.year !== ALL_VALUE ||
    filters.month !== ALL_VALUE ||
    filters.q !== "";

  // Conditionally render the button only if a filter is active
  if (!isFilterActive) {
    return null;
  }

  return (
    <ButtonCustomColor
      className="w-fit bg-neutral-950 text-sm! text-white!"
      onClick={handleReset}
      aria-label="Reset Filters"
    >
      {t("reset-filters")}
    </ButtonCustomColor>
  );
};
