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

const projectStatusOptions = [
  { label: "Concept", value: "concept" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export default function FilterStatus() {
  const t = useTranslations("BlogFilters");
  const tStatus = useTranslations("BlogFilters.Status"); // Create translations for: concept, in_progress, completed
  const locale = useLocale();
  const direction = getDirection(locale);
  const { filters } = usePortfolioFilterContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleStatusChange(status: string) {
    const segments: string[] = [];

    // Type (Existing)
    if (filters.projectType && filters.projectType !== ALL_VALUE) {
      segments.push(filters.projectType);
    }

    // Year (Existing)
    if (filters.year && filters.year !== ALL_VALUE) {
      segments.push(filters.year);
    }

    // Status (Current Change)
    if (status !== ALL_VALUE) {
      segments.push(status);
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", "1");

    const basePath = `/portfolio/projects`;
    const newPath =
      segments.length > 0 ? `${basePath}/${segments.join("/")}` : basePath;

    router.push(
      `${newPath}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`,
    );
  }

  const activeStatus = filters.projectStatus || ALL_VALUE;

  return (
    <Field>
      <Select
        dir={direction}
        value={activeStatus}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full max-w-36">
          <SelectValue placeholder={t("all-status")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{t("all-types")}</SelectItem>
          {projectStatusOptions.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {tStatus(category.value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
