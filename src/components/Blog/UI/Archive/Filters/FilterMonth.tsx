"use client";
import { useBlogFilterContext } from "./FilterProvider";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/routing";
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
import { Fragment } from "react";

const ALL_MONTHS_VALUE = "all";

function FilterMonth() {
  const { filters, uniqueMonths } = useBlogFilterContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("BlogFilters");
  const tMonths = useTranslations("Months");
  const locale = useLocale();
  const direction = getDirection(locale);
  const isRtl = direction === "rtl";

  const activeMonthValue = filters.month || ALL_MONTHS_VALUE;

  // Calculate the display label for the button
  const activeMonthLabel =
    activeMonthValue === ALL_MONTHS_VALUE
      ? t("all-months")
      : tMonths(digitsFaToEn(activeMonthValue));

  function handleMonthChange(monthValue: string) {
    const newPathSegments = [];

    // Use ALL_MONTHS_VALUE consistently for checks
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

    const basePath = `/blog/archive`;
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
      <Listbox value={activeMonthValue} onChange={handleMonthChange}>
        {({ open }) => (
          <>
            {/* --- TRIGGER BUTTON --- */}
            <ListboxButton
              className={clsx(
                "group relative w-full cursor-pointer rounded-[40px] border bg-white/50 px-3 py-2 text-sm font-medium whitespace-nowrap text-neutral-950 shadow-xs transition-[color,box-shadow] outline-none",
                "text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-900",
                "dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white",
                "focus-visible:ring-ring/50 focus:outline-none focus-visible:ring-2",
                isRtl ? "pr-4 pl-8 text-right" : "pr-8 pl-4 text-left",
              )}
            >
              <span className="block truncate">{activeMonthLabel}</span>
              <span
                className={clsx(
                  "pointer-events-none absolute inset-y-0 flex items-center transition-transform duration-150",
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

            {/* --- DROPDOWN PANEL --- */}
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions
                anchor={{
                  to: "bottom start",
                  gap: 8,
                  padding: 16,
                }}
                className={clsx(
                  "z-[100] mt-1 max-h-[60vh] overflow-auto rounded-2xl p-1.5 focus:outline-none",
                  "bg-white/80 backdrop-blur-xl dark:bg-neutral-900/80",
                  "shadow-2xl ring-1 ring-black/5 dark:shadow-black/20 dark:ring-white/10",
                  "min-w-[var(--button-width)] sm:min-w-[10rem]",
                )}
              >
                {/* 1. "All" Option */}
                <ListboxOption
                  value={ALL_MONTHS_VALUE}
                  className={({ focus, selected }) =>
                    clsx(
                      "relative cursor-pointer rounded-xl py-2.5 text-sm transition-colors select-none",
                      isRtl ? "pr-10 pl-4" : "pr-4 pl-10",
                      focus
                        ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                        : "text-neutral-600 dark:text-neutral-300",
                      selected &&
                        "bg-stone-100 font-semibold text-neutral-900 dark:text-white",
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
                        {t("all-months")}
                      </span>
                      {selected && (
                        <span
                          className={clsx(
                            "absolute inset-y-0 flex items-center text-stone-500 dark:text-stone-400",
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

                {/* 2. Dynamic Months */}
                {uniqueMonths.map((month) => {
                  const monthName = tMonths(digitsFaToEn(month));
                  if (!monthName) return null;

                  return (
                    <ListboxOption
                      key={month}
                      value={month}
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
                            {monthName}
                          </span>
                          {selected && (
                            <span
                              className={clsx(
                                "absolute inset-y-0 flex items-center text-zinc-500 dark:text-zinc-400",
                                isRtl ? "right-0 pr-3" : "left-0 pl-3",
                              )}
                            >
                              <CheckIcon
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </ListboxOption>
                  );
                })}
              </ListboxOptions>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
}

export default FilterMonth;
