"use client";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import clsx from "clsx";
import { useState } from "react";

// Project Specific Imports
import FilterCategories from "@/components/Projects/UI/Archive/Filters/FilterCategories";
import FilterStatus from "@/components/Projects/UI/Archive/Filters/FilterStatus";
import { ProjectFiltersMobile } from "@/components/Projects/UI/Archive/Filters/filters-mobile-ui";
import FilterYear from "@/components/Projects/UI/Archive/Filters/FilterYear";
import { SearchBar } from "@/components/Projects/UI/Archive/Search/search";
import Sort from "@/components/Projects/UI/Archive/Filters/sort";
import { ResetButton } from "./ResetButton";

import { ButtonCustomColor } from "@/components/ui/button";
import { useBreakpoint } from "@/utils/hooks/useBreakpoint";
import { ArrowsUpDownIcon, FunnelIcon } from "@heroicons/react/24/solid";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";

export const PorjectsArchiveFilterRibbon = () => {
  const t = useTranslations("Blog");
  const locale = useLocale();
  const direction = getDirection(locale);
  const [isRibbonExpanded, setIsRibbonExpanded] = useState(false);
  const [isSortRibbonExpanded, setIsSortRibbonExpanded] = useState(false);

  const breakpoint = useBreakpoint();

  // Alignment logic
  const isMobile = breakpoint === "sm" || breakpoint === "md";
  const popoverAlignment = isMobile ? "center" : "end";

  // Shared Button Style
  const buttonBaseClass =
    "inline-flex items-center justify-center rounded-full bg-transparent px-3 py-1.5 text-sm font-semibold text-neutral-600 transition-colors duration-300 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white";

  const activePacketClass =
    "bg-neutral-200 text-neutral-900 dark:bg-white/10 dark:text-white";

  return (
    <div
      className={clsx(
        "sticky top-4 z-50 py-1",
        "mx-auto my-4 max-w-screen-xl px-4 md:px-6",
      )}
    >
      <Popover>
        <PopoverAnchor asChild>
          <div
            className={clsx(
              "relative flex items-center justify-between",
              "rounded-full border border-white/10 bg-neutral-100/80 p-1.5 shadow-lg shadow-black/5 backdrop-blur-xl",
              "dark:border-white/10 dark:bg-neutral-900/80",
            )}
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4 pr-1 pl-4">
              <h1 className="font-display text-lg font-bold tracking-tight text-neutral-950 xl:text-xl dark:text-white">
                {t("project")}
              </h1>

              {/* Divider */}
              <div className="hidden h-6 w-px bg-neutral-200 xl:block dark:bg-white/10" />

              {/* --- MOBILE TRIGGER --- */}
              <div className="xl:hidden">
                <PopoverTrigger asChild>
                  <ButtonCustomColor className="flex flex-nowrap items-center gap-1.5 bg-transparent px-2 text-sm font-medium whitespace-nowrap text-neutral-500 hover:text-neutral-900 xl:block dark:text-neutral-400 dark:hover:text-white">
                    <span className="flex items-center justify-center gap-1">
                      <FunnelIcon className="h-4 w-4 shrink-0" /> {t("filters")}
                    </span>
                  </ButtonCustomColor>
                </PopoverTrigger>
              </div>

              {/* --- DESKTOP EXPANDABLE CONTENT --- */}
              <div className="hidden items-center justify-center gap-1 xl:flex">
                {/* 1. Filter Toggle */}
                <ButtonCustomColor
                  onClick={() => setIsRibbonExpanded(!isRibbonExpanded)}
                  className={clsx(
                    buttonBaseClass,
                    isRibbonExpanded && activePacketClass,
                  )}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <FunnelIcon className="h-4 w-4" /> {t("filters")}
                  </span>
                </ButtonCustomColor>

                {/* Expanded Filters Area */}
                <div
                  className={clsx(
                    "flex min-w-0 shrink-0 items-center overflow-hidden transition-[max-width,opacity] ease-in-out",
                    isRibbonExpanded
                      ? "max-w-3xl opacity-100 duration-300"
                      : "max-w-0 opacity-0 duration-200",
                  )}
                >
                  <div className="mx-2 flex items-center gap-x-3 gap-y-2 border-l border-neutral-200 pl-4 whitespace-nowrap dark:border-white/10">
                    <FilterCategories />
                    <FilterYear />
                    <FilterStatus />
                    <ResetButton />
                  </div>
                </div>

                {/* 2. Sort Toggle */}
                <ButtonCustomColor
                  onClick={() => setIsSortRibbonExpanded(!isSortRibbonExpanded)}
                  className={clsx(
                    buttonBaseClass,
                    isSortRibbonExpanded && activePacketClass,
                  )}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <ArrowsUpDownIcon className="h-4 w-4" />
                    {t("sort")}
                  </span>
                </ButtonCustomColor>

                {/* Expanded Sort Area */}
                <div
                  className={clsx(
                    "flex min-w-0 shrink-0 items-center overflow-hidden transition-[max-width,opacity] ease-in-out",
                    isSortRibbonExpanded
                      ? "max-w-3xl opacity-100 duration-300"
                      : "max-w-0 opacity-0 duration-200",
                  )}
                >
                  <div
                    className={clsx(
                      "mx-2 flex items-center gap-x-3 gap-y-2 border-neutral-200 px-2 whitespace-nowrap dark:border-white/10",
                      direction === "rtl" ? "border-r" : "border-l",
                    )}
                  >
                    <Sort />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Search */}
            <div className="flex items-center">
              <SearchBar />
            </div>
          </div>
        </PopoverAnchor>

        {/* MOBILE POPOVER CONTENT */}
        <PopoverContent
          side="bottom"
          align="center"
          sideOffset={8}
          className="w-[92vw] overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-0 shadow-2xl backdrop-blur-xl sm:hidden dark:bg-neutral-900/95"
        >
          <ProjectFiltersMobile />
        </PopoverContent>
      </Popover>
    </div>
  );
};
