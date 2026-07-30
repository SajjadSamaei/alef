"use client";
import { usePortfolioFilterContext } from "./FilterProvider";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Field } from "@/components/ui/field";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";

const ALL_VALUE = "all";

export default function FilterProjectTypes() {
  const t = useTranslations("BlogFilters"); // Ensure you have "all-types" translated here
  const locale = useLocale();
  const direction = getDirection(locale);
  const { filters, uniqueProjectTypes } = usePortfolioFilterContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleTypeChange(typeSlug: string) {
    // 1. Construct the new segments based on canonical order: Type -> Year -> Status
    const segments: string[] = [];

    // Type (Current Change)
    if (typeSlug !== ALL_VALUE) {
      segments.push(typeSlug);
    }

    // Year (Existing Filter)
    if (filters.year && filters.year !== ALL_VALUE) {
      segments.push(filters.year);
    }

    // Status (Existing Filter)
    if (filters.projectStatus && filters.projectStatus !== ALL_VALUE) {
      segments.push(filters.projectStatus);
    }

    // 2. Build Query Params (preserve search 'q' and 'author')
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", "1"); // Reset to page 1

    // 3. Navigate
    const basePath = `/portfolio/projects`;
    const newPath =
      segments.length > 0 ? `${basePath}/${segments.join("/")}` : basePath;

    router.push(
      `${newPath}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`,
    );
  }

  const activeType = filters.projectType || ALL_VALUE;

  return (
    <Field>
      <Select
        dir={direction}
        value={activeType}
        onValueChange={handleTypeChange}
      >
        <SelectTrigger className="w-full max-w-36">
          <SelectValue placeholder={t("all-types")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t("all-types")}</SelectItem>
          {uniqueProjectTypes.map((type) => (
            <SelectItem key={type.id} value={type.slug ?? ""}>
              {type.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
