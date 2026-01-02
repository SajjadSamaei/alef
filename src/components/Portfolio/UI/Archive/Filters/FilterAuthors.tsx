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
import {
  FieldGroup,
  FieldSet,
  Field,
  FieldLegend,
  FieldDescription,
} from "@/components/ui/field";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";

const ALL_CATEGORIES_VALUE = "all";

function FilterAuthors() {
  const t = useTranslations("BlogFilters");
  const locale = useLocale();
  const direction = getDirection(locale);
  const { filters, uniqueAuthors } = usePortfolioFilterContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleAuthorChange(authorSlug: string) {
    const newPathSegments = [];
    if (authorSlug !== ALL_CATEGORIES_VALUE) {
      newPathSegments.push(authorSlug);
    }
           if (filters.projectStatus && filters.projectStatus !== ALL_CATEGORIES_VALUE) {
      newPathSegments.push(filters.projectStatus);
    }

        if (filters.category && filters.category !== ALL_CATEGORIES_VALUE) {
      newPathSegments.push(filters.category);
    }
    
    if (filters.year !== ALL_CATEGORIES_VALUE) {
      newPathSegments.push(filters.year);
    }
    if (filters.month !== ALL_CATEGORIES_VALUE) {
      newPathSegments.push(filters.month);
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", "1");

    // const newPath = `${locale}/blog/archive/${newPathSegments.join('/')}`
    // router.push(`${newPath}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`)
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

  const activeAuthor = filters.author || ALL_CATEGORIES_VALUE;

  return (
    <Field>
      <Select
        dir={direction}
        value={activeAuthor}
        onValueChange={handleAuthorChange}
      >
        <SelectTrigger className="w-full max-w-36">
          <SelectValue placeholder=     {t("all-members")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_CATEGORIES_VALUE}>
            {t("all-members")}
          </SelectItem>
          {uniqueAuthors.map((category) => (
            <SelectItem key={category.id} value={category.slug ?? ""}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

export default FilterAuthors;
