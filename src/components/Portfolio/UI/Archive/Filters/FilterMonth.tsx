"use client";
import { usePortfolioFilterContext } from "./FilterProvider";
import {
  FieldGroup,
  FieldSet,
  Field,
  FieldLegend,
  FieldDescription,
} from "@/components/ui/field";
import { useRouter, useSearchParams } from "next/navigation";
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

// Define types for month name objects for better type safety
type MonthNames = {
  [key: string]: string;
};

const ALL_MONTHS_VALUE = "all";

function FilterMonth() {
  const { filters, uniqueMonths } = usePortfolioFilterContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("BlogFilters");
  const tMonths = useTranslations("Months");
  const locale = useLocale();
  const direction = getDirection(locale);

  function handleMonthChange(monthValue: string) {
    const newPathSegments = [];

    // Use ALL_MONTHS_VALUE consistently for checks

       if (filters.projectStatus && filters.projectStatus !== ALL_MONTHS_VALUE) {
      newPathSegments.push(filters.projectStatus);
    }
        
    if (filters.author && filters.author !== ALL_MONTHS_VALUE) {
      newPathSegments.push(filters.author);
    }
    if (filters.category && filters.category !== ALL_MONTHS_VALUE) {
      newPathSegments.push(filters.category);
    }
    if (filters.year && filters.year !== ALL_MONTHS_VALUE) {
      newPathSegments.push(filters.year);
    }
    if (monthValue !== ALL_MONTHS_VALUE) {
      newPathSegments.push(digitsFaToEn(monthValue));
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", "1");

    // Construct path without locale prefix initially, let router handle it
    const basePath = `/portfolio`;
    const newPath =
      newPathSegments.length > 0
        ? `${basePath}/${newPathSegments.join("/")}`
        : basePath;

    // Use router push with locale potentially handled by next-intl's Link/router
    router.push(
      `${newPath}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`,
    );
  }

  // Use the constant or default to it
  const activeMonthForValue = filters.month || ALL_MONTHS_VALUE;

  return (
    <Field>
      {/* Use Field from CatalystUI */}
      <Select
        dir={direction}
        value={activeMonthForValue}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-full max-w-36">
          <SelectValue placeholder={t("all-months")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_MONTHS_VALUE}>{t("all-months")}</SelectItem>
          {/* Ensure uniqueMonths is sorted if needed, e.g., uniqueMonths.sort().map(...) */}
          {uniqueMonths.map((month) => {
            // 'month' is expected to be "01", "02", etc.

            // *** FIX: Conditionally select the month name based on locale ***
            const monthName =
              // locale === "fa"
              //   ? persianMonthNames[month]
              //   : englishMonthNames[month];
              tMonths(digitsFaToEn(month));

            // Safety check in case month value is unexpected
            if (!monthName) return null;

            return (
              <SelectItem key={month} value={month}>
                {monthName} {/* Display the correct localized name */}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </Field>
  );
}

export default FilterMonth;
