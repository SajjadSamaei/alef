"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useBreakpoint } from "@/payload/hooks/useBreakpoint";
import useDebounce from "@/payload/hooks/useDebounce";
import {
  FileText as DocumentIcon,
  AlertCircle as ExclamationCircleIcon,
  Search as SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation"; // Keeping your original router logic
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyContent } from "@/components/ui/empty";
import { useDirection } from "@/utils/hooks/useDirection";
import { digitsEnToFa } from "@persian-tools/persian-tools";

// --- Types (Kept from Portfolio Logic) ---
interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  year?: number;
  projectStatus?: "concept" | "in_progress" | "completed";
  featuredImage?: {
    alt?: string;
    sizes?: {
      thumbnail?: {
        url?: string;
      };
    };
    url?: string;
    placeholder?: string; // Added to support blur if available
  };
}

// --- Search Button Component (From Aesthetic Source) ---
export function SearchButton({
  className,
  children,
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={clsx(
        "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-100 dark:hover:bg-white/10",
        className,
      )}
      {...props}
      asChild={asChild}
    >
      {children}
    </Button>
  );
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations("Search");
  const tStatus = useTranslations("BlogFilters.Status");
  const locale = useLocale();
  const direction = useDirection();
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 500);
  const breakpoint = useBreakpoint();
  const searchRef = useRef<HTMLDivElement>(null);

  const isDesktop = useMemo(
    () => breakpoint === "xl" || breakpoint === "2xl",
    [breakpoint],
  );

  // --- Fetch Logic (Kept from Portfolio Logic) ---
  useEffect(() => {
    async function fetchResults() {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/portfolio?q=${encodeURIComponent(
            debouncedQuery,
          )}&limit=5&locale=${locale}`,
        );
        const data = await response.json();
        setSearchResults(data.docs || []);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResults();
  }, [debouncedQuery, locale]);

  // --- Click Outside / Escape Logic (From Aesthetic Source) ---
  useEffect(() => {
    if (!isDesktop) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, isDesktop]);

  const handleSelect = (itemSlug: string) => {
    if (itemSlug) {
      router.push(`/projects/${itemSlug}`);
      setOpen(false);
      setQuery("");
      setSearchResults([]);
    }
  };

  // --- Result Items Component (Merged Aesthetic + Portfolio Data) ---
  const ResultsListItems = () => (
    <>
      {searchResults.map((item) => {
        // Data extraction
        const imageObj = item.featuredImage;
        const hasImage = imageObj && typeof imageObj === "object";
        const imageUrl = hasImage
          ? imageObj.sizes?.thumbnail?.url || imageObj.url
          : null;

        // Status & Title Localization
        const statusLabel = item.projectStatus
          ? tStatus(item.projectStatus)
          : null;
        const localizedTitle =
          item.title && locale === "fa" ? digitsEnToFa(item.title) : item.title;

        return (
          <CommandItem
            key={item.id}
            value={item.id} // or item.slug/title depending on command requirement
            onSelect={() => handleSelect(item.slug)}
            className="group mb-2 flex cursor-pointer items-center rounded-2xl px-4 py-3 transition-colors select-none group-last:mb-0 hover:bg-neutral-100 data-[selected=true]:bg-neutral-100 dark:hover:bg-white/10 dark:data-[selected=true]:bg-white/10"
          >
            {/* Thumbnail - Using Aesthetic Classes */}
            <div
              className={clsx(
                "flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-lg bg-neutral-100 dark:bg-white/10",
                !hasImage && "text-neutral-400",
              )}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageObj?.alt || item.title}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <DocumentIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </div>

            {/* Text Content - Portfolio Data in Aesthetic Layout */}
            <div
              className={clsx(
                "flex-auto",
                direction === "rtl" ? "mr-4" : "ml-4",
              )}
            >
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {localizedTitle}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                {item.year && (
                  <span>
                    {locale === "fa" ? digitsEnToFa(item.year) : item.year}
                  </span>
                )}
                {item.year && statusLabel && <span>•</span>}
                {statusLabel && (
                  <span className="capitalize">{statusLabel}</span>
                )}
              </div>
            </div>
          </CommandItem>
        );
      })}
    </>
  );

  // --- Empty / Loading State ---
  const EmptyOrLoadingState = () => {
    if (isLoading) {
      return (
        <Empty>
          <EmptyContent className="flex items-center justify-center py-8 text-sm text-neutral-500 dark:text-neutral-400">
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
            {t("searching")}
          </EmptyContent>
        </Empty>
      );
    }
    if (!isLoading && debouncedQuery.trim() && searchResults.length === 0) {
      return (
        <CommandEmpty>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ExclamationCircleIcon
              className="h-6 w-6 text-neutral-400"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">
              {t("noResultsFound")}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t("noResultsFoundForQuery", { query: debouncedQuery })}
            </p>
          </div>
        </CommandEmpty>
      );
    }
    return null;
  };

  // --- Render ---
  return (
    <>
      {isDesktop ? (
        // --- DESKTOP SEARCH BAR (Aesthetic Logic) ---
        <div className="relative" ref={searchRef}>
          <Command
            shouldFilter={false}
            className={clsx(
              "overflow-visible rounded-full border border-transparent bg-transparent transition-all duration-300",
              {
                "w-10": !open, // Collapsed Width (Just Icon)
                "w-72 bg-neutral-100 shadow-sm lg:w-80 dark:bg-white/10 dark:shadow-none":
                  open, // Expanded Width
              },
            )}
          >
            <div className="relative flex items-center">
              {/* Icon Trigger */}
              <div
                onClick={() => setOpen(!open)}
                className="absolute inset-y-0 left-0 flex w-10 cursor-pointer items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                {/* Icon hidden intentionally here to allow input to overlay, or you can place icon here */}
                {/* The aesthetic source relies on the button being clicked or the input padding to show icon */}
                {/* <SearchIcon className={clsx("h-4 w-4", open && "opacity-50")} /> */}
              </div>

              {/* Input Field */}
              <CommandInput
                className={clsx(
                  "h-9 w-full bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-500 focus:outline-none dark:text-white dark:placeholder:text-neutral-400",
                  {
                    "cursor-pointer pr-4 opacity-100": open,
                    "w-0 px-0 opacity-0": !open, // Hide input when collapsed
                  },
                )}
                placeholder={t("placeholder")}
                value={query}
                onValueChange={setQuery}
                onFocus={() => {
                  if (!open) setOpen(true);
                }}
                onBlur={() => {
                  if (!query) setOpen(false); // Auto-collapse if empty
                }}
              />
            </div>

            {/* Results Dropdown */}
            {open && debouncedQuery.trim() && (
              <div className="absolute top-full right-0 mt-2 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/80 p-2 shadow-xl backdrop-blur-xl dark:bg-neutral-900/80">
                <CommandList className="max-h-[60vh] overflow-y-auto">
                  <EmptyOrLoadingState />
                  <ResultsListItems />
                </CommandList>
              </div>
            )}
          </Command>
        </div>
      ) : (
        // --- MOBILE SEARCH (Popover - Aesthetic Logic) ---
        <Popover
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setQuery("");
              setSearchResults([]);
            }
          }}
        >
          <PopoverTrigger asChild>
            <SearchButton className="text-neutral-500 hover:text-neutral-900 xl:hidden dark:text-neutral-400 dark:hover:text-white">
              <SearchIcon className="h-5 w-5" />
            </SearchButton>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={8}
            className="w-[92vw] overflow-hidden rounded-3xl border border-white/10 bg-white/95 p-0 shadow-2xl backdrop-blur-xl dark:bg-neutral-900/95"
          >
            <Command shouldFilter={false} className="bg-transparent">
              {/* Mobile Input */}
              <div className="flex items-center border-b border-neutral-200 px-4 py-3 dark:border-white/10">
                {/* <SearchIcon className="mr-3 h-4 w-4 text-neutral-500 dark:text-neutral-400" /> */}
                <CommandInput
                  autoFocus
                  className="h-auto w-full min-w-0 bg-transparent p-0 text-base font-medium text-neutral-900 outline-none placeholder:text-neutral-500 dark:text-white dark:placeholder:text-neutral-400"
                  placeholder={t("placeholder")}
                  value={query}
                  onValueChange={setQuery}
                />
              </div>

              {/* Mobile Results */}
              {debouncedQuery.trim() && (
                <CommandList className="max-h-[50vh] overflow-y-auto p-2">
                  <EmptyOrLoadingState />
                  <ResultsListItems />
                </CommandList>
              )}
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
