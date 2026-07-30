"use client";
import { useBlogFilterContext } from "./FilterProvider";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/src/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";
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

const ALL_CATEGORIES_VALUE = "all";

function FilterCategories() {
  const t = useTranslations("BlogFilters");
  const locale = useLocale();
  const direction = getDirection(locale);
  const isRtl = direction === "rtl";

  const { filters, uniqueCategories } = useBlogFilterContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategoryValue = filters.category || ALL_CATEGORIES_VALUE;

  // Find the active object for display label
  const activeCategoryLabel =
    activeCategoryValue === ALL_CATEGORIES_VALUE
      ? t("all-categories")
      : uniqueCategories.find((c) => c.slug === activeCategoryValue)?.title ||
        t("all-categories");

  function handleCategoryChange(categorySlug: string) {
    const newPathSegments = [];
    if (categorySlug !== ALL_CATEGORIES_VALUE) {
      newPathSegments.push(categorySlug);
    }

    if (filters.year !== ALL_CATEGORIES_VALUE)
      newPathSegments.push(filters.year);
    if (filters.month !== ALL_CATEGORIES_VALUE)
      newPathSegments.push(filters.month);

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
      <Listbox value={activeCategoryValue} onChange={handleCategoryChange}>
        {({ open }) => (
          <>
            {/* --- TRIGGER BUTTON --- */}
            <ListboxButton
              className={clsx(
                "group relative w-fit cursor-pointer rounded-[40px] border bg-white/50 px-3 py-2 text-sm font-medium whitespace-nowrap text-neutral-950 shadow-xs transition-[color,box-shadow] outline-none",
                "text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-900",
                "dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white",
                "focus-visible:ring-ring/50 focus:outline-none focus-visible:ring-2",

                // Padding adjustment for icon
                isRtl ? "pr-4 pl-8 text-right" : "pr-8 pl-4 text-left",
              )}
            >
              <span className="block truncate">{activeCategoryLabel}</span>
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
                // 'anchor' prop handles the portal/popper positioning automatically
                anchor={{
                  to: "bottom start",
                  gap: 8, // Space between button and menu
                  padding: 16, // Keep menu 16px away from screen edges
                }}
                className={clsx(
                  "z-[100] mt-1 max-h-[60vh] overflow-auto rounded-2xl p-1.5 focus:outline-none",
                  // Glassmorphism Styles
                  "bg-white/80 backdrop-blur-xl dark:bg-neutral-900/80",
                  // Border & Shadow
                  "shadow-2xl ring-1 ring-black/5 dark:shadow-black/20 dark:ring-white/10",
                  // Width
                  "min-w-[var(--button-width)] sm:min-w-[12rem]",
                )}
              >
                {/* 1. "All" Option */}
                <ListboxOption
                  value={ALL_CATEGORIES_VALUE}
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
                        {t("all-categories")}
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

                {/* Divider Line */}
                <div className="my-1 h-px bg-neutral-200/50 dark:bg-white/5" />

                {/* 2. Dynamic Categories */}
                {uniqueCategories.map((category) => (
                  <ListboxOption
                    key={category.id}
                    value={category.slug ?? ""}
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
                          {category.title}
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

export default FilterCategories;
