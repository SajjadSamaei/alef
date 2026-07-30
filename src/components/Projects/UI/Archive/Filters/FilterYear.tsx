"use client";

import { usePortfolioFilterContext } from "./FilterProvider";
import {
  FieldGroup,
  FieldSet,
  Field,
  FieldLegend,
  FieldDescription,
} from "@/components/ui/field";
import { useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";
import { digitsFaToEn } from "@persian-tools/persian-tools";

const ALL_YEARS_VALUE = "all";

function FilterYear() {
  const { filters, uniqueYears } = usePortfolioFilterContext(); // Assume uniqueYears contains English numeral strings like "2023", "2024"
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations("BlogFilters");
  const locale = useLocale();
  const direction = getDirection(locale);

  const yearFormatter = useMemo(() => {
    return new Intl.NumberFormat(locale, {
      useGrouping: false, // <-- This is CRITICAL. It prevents "2,023"
    });
  }, [locale]);

  function handleYearChange(yearValue: string) {
    // Renamed for clarity, expects "2023", "all", etc.
    const newPathSegments = [];

    // Simpler way to get current filters from pathname
    const pathSegments = pathname.split("/").filter(Boolean);
    const archiveIndex = pathSegments.indexOf("archive");
    const currentFilters =
      archiveIndex !== -1 ? pathSegments.slice(archiveIndex + 1) : [];

    // Find existing category/month using specific checks
    const currentCategory = currentFilters.find(
      (segment) =>
        segment !== ALL_YEARS_VALUE && // Exclude 'all'
        !/^\d{4}$/.test(segment) && // Exclude 4-digit years
        !/^\d{1,2}$/.test(segment), // Exclude 1 or 2-digit months
    );
    const currentMonth = currentFilters.find(
      (segment) => /^\d{1,2}$/.test(segment) && segment.length <= 2, // Find 1 or 2 digit months
    );

    // Reconstruct path segments in order: category (if exists), year (if not 'all'), month (if exists)
    if (currentCategory) {
      newPathSegments.push(currentCategory);
    }

    if (filters.projectStatus && filters.projectStatus !== ALL_YEARS_VALUE) {
      newPathSegments.push(filters.projectStatus);
    }
    if (filters.author && filters.author !== ALL_YEARS_VALUE) {
      newPathSegments.push(filters.author);
    }

    if (yearValue !== ALL_YEARS_VALUE) {
      newPathSegments.push(digitsFaToEn(yearValue)); // Use the English numeral year directly
    }

    if (currentMonth) {
      newPathSegments.push(currentMonth);
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", "1");

    // Construct path without locale prefix, router should handle it
    const basePath = `/portfolio/projects`;
    const newPath =
      newPathSegments.length > 0
        ? `${basePath}/${newPathSegments.join("/")}`
        : basePath;

    router.push(
      `${newPath}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`,
    );
  }

  // --- FIX: Use English numeral string for the value ---
  // filters.year comes from the URL, which should use English numerals ("2023", "all").
  const activeYear = filters.year || ALL_YEARS_VALUE; // No conversion needed here

  return (
    <Field>
      <Select
        dir={direction}
        value={activeYear}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-full max-w-36">
          <SelectValue placeholder={t("all-years")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_YEARS_VALUE}>{t("all-years")}</SelectItem>
          {/* Ensure uniqueYears is sorted if necessary, e.g., uniqueYears.sort((a, b) => b - a).map(...) */}
          {uniqueYears.map((year) => {
            const displayYear =
              // locale === "fa"
              //   ? convertEnglishToPersianNumerals(year) // Convert only for display
              //   : year;
              yearFormatter.format(parseInt(digitsFaToEn(year), 10));

            return (
              // --- FIX: Use English numeral string for the value ---
              <SelectItem key={year} value={year}>
                {displayYear} {/* Show potentially converted year */}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </Field>
  );
}

export default FilterYear;
