"use client";
import { useBlogFilterContext } from "./FilterProvider";
import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

const ALL_VALUE = "all";

export const ResetButton = () => {
  const { filters, setFilters } = useBlogFilterContext();
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

  // Conditionally render only if a filter is active
  if (!isFilterActive) {
    return null;
  }

  return (
    <button
      onClick={handleReset}
      className={clsx(
        // Base Layout & Shape
        "group flex items-center gap-1.5 rounded-[40px] border px-3 py-2 text-sm font-medium transition-all outline-none",

        // Colors: Slightly darker background to indicate it's a "secondary" action vs the "white/50" dropdowns
        "border-neutral-200 bg-neutral-900 text-neutral-100 hover:bg-neutral-600 hover:text-neutral-100",

        // Dark Mode
        "dark:border-white/10 dark:bg-white/5 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white",

        // Focus & Shadow
        "shadow-xs focus-visible:ring-2 focus-visible:ring-neutral-500",
      )}
      aria-label="Reset Filters"
    >
      <XMarkIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
      <span>{t("reset-filters")}</span>
    </button>
  );
};
