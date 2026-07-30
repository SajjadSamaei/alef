"use client";

import { useParams } from "next/navigation";
import React, { useTransition, Fragment } from "react";
import { useLocale } from "next-intl";
import localization from "@/src/i18n/localization";
import { usePathname, useRouter } from "@/src/i18n/routing";
import { locales } from "@/src/i18n/i18n.config";
import clsx from "clsx";
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
  LanguageIcon,
} from "@heroicons/react/20/solid";
import { getDirection } from "@/utils/hooks/useDirection";

interface LocaleSwitcherProps {
  isDark?: boolean;
  variant?: "default" | "header" | "minimal";
  className?: string;
}

export function LocaleSwitcher({
  isDark = false,
  variant = "default",
  className,
}: LocaleSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const direction = getDirection(locale);
  const isRtl = direction === "rtl";

  function onSelectChange(value: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- dynamic params
        { pathname, params },
        { locale: value as (typeof locales)[number] },
      );
    });
  }

  const currentLocaleObj = localization.locales.find((l) => l.code === locale);

  // Use short label (e.g. "EN") for header to save space, or label ("English") if preferred
  const label =
    variant === "minimal"
      ? currentLocaleObj?.shortLabel
      : currentLocaleObj?.label;

  // --- Styles Configuration ---

  // Base styles common to all variants
  const baseStyles =
    "group relative flex items-center justify-between cursor-pointer transition-colors outline-none";

  const variantStyles = {
    // Default: Rounded pill, solid/glassy (Filters, etc.)
    default: clsx(
      "w-fit gap-2 rounded-full px-3 py-1.5 text-sm font-medium",
      "bg-white/50 border border-neutral-200/50 shadow-sm hover:bg-neutral-100",
      "dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10",
      "text-neutral-700 dark:text-neutral-300",
      "focus-visible:ring-2 focus-visible:ring-blue-500/50",
    ),

    // Header: Matches Navbar Link design (Rectangular, full height in grid)
    header: clsx(
      "h-full w-fit gap-2 px-4 py-3 text-base font-medium",
      "text-gray-950 dark:text-white",
      // Hover states matching your Link component
      "hover:bg-black/[2.5%] dark:hover:bg-white/[2.5%]",
      // Open state (optional highlight)
      "data-[headlessui-state=open]:bg-black/[2.5%] dark:data-[headlessui-state=open]:bg-white/[2.5%]",
    ),

    // Minimal: Simple text (Footer or small headers)
    minimal: clsx(
      "w-fit gap-1 rounded-md px-1 py-0.5 text-sm",
      "text-neutral-600 hover:text-neutral-900",
      "dark:text-neutral-400 dark:hover:text-white",
    ),
  };

  const buttonClasses = clsx(
    baseStyles,
    variantStyles[variant],
    isDark && "dark",
    className,
  );

  return (
    <div
      className={clsx(
        "relative h-full",
        variant === "header" ? "block" : "inline-block text-left",
      )}
    >
      <Listbox value={locale} onChange={onSelectChange} disabled={isPending}>
        {({ open }) => (
          <>
            <ListboxButton className={buttonClasses}>
              <span className="flex items-center gap-2">
                {/* Optional: Add an icon if you want it to look exactly like a menu item */}
                <LanguageIcon className="h-4 w-4 opacity-50" />
                <span className="block truncate">{label}</span>
              </span>

              {/* Chevron: Hidden in header variant if you want it to look exactly like a link, 
                  or keep it small to indicate dropdown */}
              <ChevronDownIcon
                className={clsx(
                  "h-4 w-4 opacity-50 transition-transform duration-200",
                  open && "rotate-180",
                )}
                aria-hidden="true"
              />
            </ListboxButton>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions
                anchor={{
                  to: "bottom end",
                  gap: variant === "header" ? 12 : 8,
                  padding: 16,
                }}
                className={clsx(
                  "z-[150] max-w-36 mt-1 max-h-60 overflow-auto rounded-xl p-1 focus:outline-none",
                  "shadow-lg shadow-black/5 border-white/10 bg-neutral-100/80 backdrop-blur-xl ring-1 ring-black/5 dark:shadow-black/40 dark:ring-white/10",
              
                )}
              >
                {localization.locales
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((l) => (
                    <ListboxOption
                      key={l.code}
                      value={l.code}
                      className={({ focus, selected }) =>
                        clsx(
                          "relative cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors select-none",
                          focus
                            ? "bg-neutral-100 text-neutral-900 hover:bg-blend-multiply dark:bg-white/10 dark:text-white"
                            : "text-neutral-600 dark:text-neutral-400",
                          selected &&
                            "bg-neutral-50 font-semibold text-neutral-900 dark:bg-white/5 dark:text-white",
                        )
                      }
                    >
                      {({ selected }) => (
                        <div className="flex w-full items-center justify-between gap-4">
                          <span className="block truncate">{l.label}</span>
                          {selected && (
                            <CheckIcon
                              className="h-4 w-4 text-blue-500"
                              aria-hidden="true"
                            />
                          )}
                        </div>
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

export function HeaderLocaleSwitcher() {
  return <LocaleSwitcher variant="header" />;
}

export function HeaderLocaleSwitcherDesktop() {
  return <LocaleSwitcher variant="minimal" />;
}
