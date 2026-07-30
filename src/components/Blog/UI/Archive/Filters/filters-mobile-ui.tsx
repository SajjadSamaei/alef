"use client";
import FilterCategories from "@/components/Blog/UI/Archive/Filters/FilterCategories";
import FilterYear from "@/components/Blog/UI/Archive/Filters/FilterYear";
import FilterMonth from "@/components/Blog/UI/Archive/Filters/FilterMonth";
import Sort from "./sort";
import { ResetButton } from "@/components/Blog/UI/Archive/Filters/ResetButton";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";

// A small reusable component for the active filter "pills"
export function FilterPill({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-x-1.5 rounded-md bg-emerald-500/15 px-3 py-1 text-sm/5 font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
      <span>{label}</span>
      <button
        onClick={onClear}
        type="button"
        className="group -mr-1 inline-flex h-4 w-4 shrink-0 rounded-full p-1 hover:bg-emerald-500/25"
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 8 8"
          className="h-2 w-2"
        >
          <path d="M1 1l6 6m0-6L1 7" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}

export function ProjectFiltersMobile() {
  const t = useTranslations("Blog"); // Assuming 'Blog.all-months' translation exists
  const locale = useLocale();
  const direction = getDirection(locale);
  return (
    <div
      dir={direction}
      className="z-20 flex-auto overflow-hidden text-sm leading-6"
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 p-6 md:grid-cols-3">
        <span className="col-span-2 flex items-center justify-start text-sm text-zinc-950/50 md:col-span-3">
          {t("filters")}
        </span>
        <FilterCategories />
        <FilterYear />
        <FilterMonth />
        <ResetButton />
        <span className="col-span-2 flex items-center justify-start text-sm text-zinc-950/50 md:col-span-3">
          {t("sort")}
        </span>
        <Sort />
        {/* You can add/remove filter components here as needed */}
      </div>

      <div className="flex flex-wrap items-center justify-start gap-4 px-4 py-3">
        {/* Action Buttons */}
        <div className="flex items-center gap-x-3"></div>
      </div>
    </div>
  );
}
