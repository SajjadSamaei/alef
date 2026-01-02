"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";
import clsx from "clsx";

// UI Components
import { SearchBar } from "@/components/Blog/UI/Search/search";
import { ButtonCustomColor } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/shadcn/navigation-menu";

// Icons & Hooks
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { getDirection } from "@/utils/hooks/useDirection";
import type { Category } from "@/src/payload-types";

type BlogRibbonProps = {
  categories?: Category[];
};

// --- Nav Link Component ---
function NavLink({
  href,
  children,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}) {
  // 1. Desktop Styles: Rounded Pills
  const desktopStyles =
    "inline-flex items-center justify-center rounded-full bg-transparent px-4 py-1.5 text-sm font-semibold text-neutral-600 transition-colors duration-300 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white";

  // 2. Mobile Styles: Rounded Blocks (iOS style)
  // Changed from 'w-full' to 'mx-2 rounded-xl'
  if (mobile) {
    return (
      <Link
        href={href}
        className={clsx(
          "flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-500 transition-all duration-200",
          // Hover & Shape logic:
          "mx-2 my-1 rounded-xl hover:bg-neutral-200 hover:text-neutral-900",
          "dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white",
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <NavigationMenuLink asChild>
      <Link href={href} className={desktopStyles}>
        {children}
      </Link>
    </NavigationMenuLink>
  );
}

export const BlogRibbon = ({ categories = [] }: BlogRibbonProps) => {
  const t = useTranslations("Blog");
  const locale = useLocale();
  const direction = getDirection(locale);

  return (
    <div
      className={clsx(
        "sticky top-4 z-50 py-1",
        "mx-auto mb-4 max-w-7xl px-2 md:px-4 lg:px-8 xl:px-0",
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
            {/* LEFT SIDE: Title + Nav */}
            <div className="flex items-center gap-4 pr-1 pl-4">
              {/* Blog Title */}
              <h1 className="font-display ps-4 text-lg font-bold tracking-tight text-neutral-950 xl:text-xl dark:text-white">
                {t("blog-title")}
              </h1>

              {/* Divider (Hidden on small mobile) */}
              <div className="hidden h-6 w-px bg-neutral-200 sm:block dark:bg-white/10" />

              {/* DESKTOP NAV */}
              <NavigationMenu
                dir={direction}
                className="hidden sm:block"
                viewport={false}
              >
                <NavigationMenuList className="gap-1">
                  <NavigationMenuItem>
                    <NavLink href="/blog/archive">{t("allStories")}</NavLink>
                  </NavigationMenuItem>

                  {categories.map((cat) => (
                    <NavigationMenuItem key={cat.id}>
                      <NavLink href={`/blog/archive/${cat.slug}`}>
                        {cat.title}
                      </NavLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              {/* MOBILE TRIGGER */}
              <PopoverTrigger asChild>
                <ButtonCustomColor className="bg-transparent px-2 text-sm font-medium whitespace-nowrap text-neutral-500 hover:text-neutral-900 sm:hidden dark:text-neutral-400 dark:hover:text-white">
                  <div className="flex flex-row items-center justify-center gap-1.5">
                    <span>{t("categories")}</span>
                    <ChevronDownIcon className="h-4 w-4 shrink-0" />
                  </div>
                </ButtonCustomColor>
              </PopoverTrigger>
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
          {/* Added 'py-2' to give spacing for the first/last items to have hover room */}
          <div className="flex flex-col py-2">
            <NavLink href="/blog/archive" mobile>
              {t("allStories")}
            </NavLink>

            {categories.map((cat) => (
              <NavLink key={cat.id} href={`/blog/archive/${cat.slug}`} mobile>
                {cat.title}
              </NavLink>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
