"use client";
import { usePortfolioFilterContext } from "./FilterProvider";
import { useMemo, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";
import { digitsFaToEn } from "@persian-tools/persian-tools";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

const ALL_YEARS_VALUE = "all";

function FilterYear() {
  const { filters, uniqueYears } = usePortfolioFilterContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations("BlogFilters");
  const locale = useLocale();
  const direction = getDirection(locale);
  const isRtl = direction === "rtl";

  const yearFormatter = useMemo(() => {
    return new Intl.NumberFormat(locale, { useGrouping: false });
  }, [locale]);

  const activeYearValue = filters.year || ALL_YEARS_VALUE;

  const activeYearLabel =
    activeYearValue === ALL_YEARS_VALUE
      ? t("all-years")
      : yearFormatter.format(parseInt(digitsFaToEn(activeYearValue), 10));

  function handleYearChange(yearValue: string) {
    const newPathSegments = [];
    const pathSegments = pathname.split("/").filter(Boolean);
    const archiveIndex = pathSegments.indexOf("archive");
    const currentFilters =
      archiveIndex !== -1 ? pathSegments.slice(archiveIndex + 1) : [];

    const currentCategory = currentFilters.find(
      (segment) =>
        segment !== "all" &&
        !/^\d{4}$/.test(segment) &&
        !/^\d{1,2}$/.test(segment),
    );
    const currentMonth = currentFilters.find(
      (segment) => /^\d{1,2}$/.test(segment) && segment.length <= 2,
    );

    if (currentCategory) newPathSegments.push(currentCategory);
    if (filters.projectStatus && filters.projectStatus !== "all")
      newPathSegments.push(filters.projectStatus);
    if (filters.author && filters.author !== "all")
      newPathSegments.push(filters.author);

    if (yearValue !== ALL_YEARS_VALUE) {
      newPathSegments.push(digitsFaToEn(yearValue));
    }

    if (currentMonth) newPathSegments.push(currentMonth);

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", "1");

    const basePath = `/portfolio`;
    const newPath =
      newPathSegments.length > 0
        ? `${basePath}/${newPathSegments.join("/")}`
        : basePath;

    router.push(
      `${newPath}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`,
    );
  }

  return (
    <div className="relative w-full max-w-36">
      <Listbox value={activeYearValue} onChange={handleYearChange}>
        {({ open }) => (
          <>
            <ListboxButton
              className={clsx(
                "group relative w-fit cursor-pointer rounded-[40px] border bg-white/50 px-3 py-2 text-sm font-medium whitespace-nowrap text-neutral-950 shadow-xs transition-[color,box-shadow] outline-none",
                "text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-900",
                "dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white",
                "focus-visible:ring-ring/50 focus:outline-none focus-visible:ring-2",
                isRtl ? "pr-4 pl-8 text-right" : "pr-8 pl-4 text-left",
              )}
            >
              <span className="block truncate">{activeYearLabel}</span>
              <span
                className={clsx(
                  "pointer-events-none absolute inset-y-0 flex items-center transition-transform duration-300",
                  isRtl ? "left-2" : "right-2",
                  open && "rotate-180",
                )}
              >
                <ChevronDownIcon
                  className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions
                anchor={{ to: "bottom start", gap: 8, padding: 16 }}
                className={clsx(
                  "z-[100] mt-1 max-h-[60vh] overflow-auto rounded-2xl p-1.5 focus:outline-none",
                  "bg-white/80 backdrop-blur-xl dark:bg-neutral-900/80",
                  "shadow-2xl ring-1 ring-black/5 dark:shadow-black/20 dark:ring-white/10",
                  "min-w-[var(--button-width)] sm:min-w-[10rem]",
                )}
              >
                <ListboxOption
                  value={ALL_YEARS_VALUE}
                  className={({ focus, selected }) =>
                    clsx(
                      "relative cursor-pointer rounded-xl py-2.5 text-sm transition-colors select-none",
                      isRtl ? "pr-10 pl-4" : "pr-4 pl-10",
                      focus
                        ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                        : "text-neutral-600 dark:text-neutral-300",
                      selected &&
                        "font-semibold text-neutral-900 dark:text-white",
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={clsx(
                          "block truncate",
                          selected ? "font-semibold" : "font-normal",
                        )}
                      >
                        {t("all-years")}
                      </span>
                      {selected && (
                        <span
                          className={clsx(
                            "absolute inset-y-0 flex items-center text-zinc-500 dark:text-zinc-400",
                            isRtl ? "right-0 pr-3" : "left-0 pl-3",
                          )}
                        >
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>

                <div className="my-1 h-px bg-neutral-200/50 dark:bg-white/5" />

                {uniqueYears.map((year) => (
                  <ListboxOption
                    key={year}
                    value={year}
                    className={({ focus, selected }) =>
                      clsx(
                        "relative cursor-pointer rounded-xl py-2.5 text-sm transition-colors select-none",
                        isRtl ? "pr-10 pl-4" : "pr-4 pl-10",
                        focus
                          ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                          : "text-neutral-600 dark:text-neutral-300",
                        selected &&
                          "font-semibold text-neutral-900 dark:text-white",
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={clsx(
                            "block truncate",
                            selected ? "font-semibold" : "font-normal",
                          )}
                        >
                          {yearFormatter.format(
                            parseInt(digitsFaToEn(year), 10),
                          )}
                        </span>
                        {selected && (
                          <span
                            className={clsx(
                              "absolute inset-y-0 flex items-center text-zinc-500 dark:text-zinc-400",
                              isRtl ? "right-0 pr-3" : "left-0 pl-3",
                            )}
                          >
                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
}

export default FilterYear;
