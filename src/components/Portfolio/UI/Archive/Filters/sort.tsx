"use client";
import { usePortfolioFilterContext } from "@/components/Portfolio/UI/Archive/Filters/FilterProvider";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";

function Sort() {
  const { setSortConfig, sortConfig } = usePortfolioFilterContext();
  const t = useTranslations("BlogFilters");
  const locale = useLocale();
  const direction = getDirection(locale);
  const isRtl = direction === "rtl";

  const sortOptions = [
    { value: "publishedAt", label: t("date") },
    { value: "title", label: t("title") },
  ];

  const activeSortLabel =
    sortOptions.find((opt) => opt.value === sortConfig.key)?.label || t("date");

  const handleKeyChange = (key: string) => {
    setSortConfig({ key: key, direction: sortConfig.direction });
  };

  const toggleDirection = () => {
    setSortConfig({
      key: sortConfig.key,
      direction: sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div className="flex items-center gap-1">
      {/* SORT KEY DROPDOWN */}
      <div className="relative w-full max-w-36">
        <Listbox value={sortConfig.key} onChange={handleKeyChange}>
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
                <span className="block truncate">{activeSortLabel}</span>
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
                    "z-[100] mt-1 overflow-auto rounded-2xl p-1.5 focus:outline-none",
                    "bg-white/80 backdrop-blur-xl dark:bg-neutral-900/80",
                    "shadow-2xl ring-1 ring-black/5 dark:shadow-black/20 dark:ring-white/10",
                    "min-w-[var(--button-width)] sm:min-w-[10rem]",
                  )}
                >
                  {sortOptions.map((option) => (
                    <ListboxOption
                      key={option.value}
                      value={option.value}
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
                            {option.label}
                          </span>
                          {selected && (
                            <span
                              className={clsx(
                                "absolute inset-y-0 flex items-center text-stone-500 dark:text-stone-400",
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
                  ))}
                </ListboxOptions>
              </Transition>
            </>
          )}
        </Listbox>
      </div>

      {/* SORT DIRECTION BUTTON */}
      <Button
        variant="ghost"
        onClick={toggleDirection}
        className={clsx(
          "size-9 rounded-full p-0 text-neutral-500 transition-colors hover:bg-neutral-200/50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white",
        )}
        aria-label={`Sort direction: ${sortConfig.direction === "asc" ? "ascending" : "descending"}`}
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
