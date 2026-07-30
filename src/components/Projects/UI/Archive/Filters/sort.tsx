"use client";
import { usePortfolioFilterContext } from "@/components/Projects/UI/Archive/Filters/FilterProvider";
import { FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { BarsArrowDownIcon, BarsArrowUpIcon } from "@heroicons/react/24/solid";
import { getDirection } from "@/utils/hooks/useDirection";

function Sort() {
  const { setSortConfig, sortConfig } = usePortfolioFilterContext();
  const t = useTranslations("BlogFilters");
  const locale = useLocale();
  const direction = getDirection(locale);

  const handleKeyChange = (key: string) => {
    // Pass the entire new object to the setter
    setSortConfig({ key: key, direction: sortConfig.direction });
  };

  const toggleDirection = () => {
    // Pass the entire new object to the setter
    setSortConfig({
      key: sortConfig.key,
      direction: sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <FieldSet className="">
        <Select
          dir={direction}
          value={sortConfig.key}
          onValueChange={handleKeyChange}
        >
          <SelectTrigger className="max-w-36">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">{t("year") || "Year"}</SelectItem>
            <SelectItem value="publishedAt">{t("date")}</SelectItem>
            <SelectItem value="title">{t("title")}</SelectItem>
          </SelectContent>
        </Select>
      </FieldSet>
      <Button
        variant="ghost"
        onClick={toggleDirection}
        className="size-10 flex-none p-0"
        aria-label={`Sort direction: ${
          sortConfig.direction === "asc" ? "ascending" : "descending"
        }`}
      >
        {sortConfig.direction === "asc" ? (
          <BarsArrowUpIcon className="size-4" />
        ) : (
          <BarsArrowDownIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export default Sort;
