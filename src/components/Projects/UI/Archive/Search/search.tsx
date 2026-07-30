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
import { useRouter } from "next/navigation";
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

// --- Interfaces ---
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
  };
}

// --- Components ---
export function SearchButton({
  className,
  children,
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const buttonClassName = clsx(
    className,
    "inline-flex items-center justify-center rounded-full xl:px-4 xl:py-1.5 text-sm font-semibold transition",
  );

  return (
    <Button
      variant="ghost"
      size="icon"
      className={buttonClassName}
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
  const tStatus = useTranslations("ProjectStatus");
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

  // --- Fetch Logic ---
  useEffect(() => {
    async function fetchResults() {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/projects?q=${encodeURIComponent(debouncedQuery)}&limit=5&locale=${locale}`,
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

  // --- Desktop Listeners ---
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
      router.push(`/portfolio/projects/${itemSlug}`);
      setOpen(false);
      setQuery("");
      setSearchResults([]);
    }
  };

  const ResultsListItems = () => (
    <>
      {searchResults.map((item) => {
        const imageObj = item.featuredImage;
        const hasImage = imageObj && typeof imageObj === "object";
        const imageUrl = hasImage
          ? imageObj.sizes?.thumbnail?.url || imageObj.url
          : null;
        const statusLabel = item.projectStatus
          ? tStatus(item.projectStatus)
          : null;
        const localizedTitle =
          item.title && locale === "fa" ? digitsEnToFa(item.title) : item.title;

        return (
          <CommandItem
            key={item.id}
            value={item.id}
            onSelect={() => handleSelect(item.slug)}
            className="group data-focus:hover:bg-appleBackgorundGray/80 hover:bg-appleBackgorundGray/80 data-focus:bg-appleBackgorundGray/80 data-focus:ring-appleBackgroundWhite/50 flex cursor-default rounded-[40px] p-5 select-none data-focus:outline-hidden sm:data-focus:ring-1"
          >
            <div
              className={clsx(
                "flex size-12 flex-none items-center justify-center overflow-hidden rounded-lg",
                !hasImage && "bg-appleBackgorundGray/80",
              )}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageObj?.alt || item.title}
                  width={48}
                  height={48}
                  className="size-full object-cover"
                />
              ) : (
                <DocumentIcon
                  className="size-6 text-white"
                  aria-hidden="true"
                />
              )}
            </div>
            <div
              className={clsx(
                "flex-auto",
                direction === "rtl" ? "mr-4" : "ml-4",
              )}
            >
              <p className="text-appletextgray/80 text-sm font-medium group-data-focus:text-white">
                {localizedTitle}
              </p>
              <div className="text-appletextgray/50 flex items-center gap-2 text-sm group-data-focus:text-gray-300 sm:text-gray-800 sm:group-data-focus:text-gray-600">
                {item.year && <span>{item.year}</span>}
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

  const EmptyOrLoadingState = () => {
    if (isLoading) {
      return (
        <Empty>
          <EmptyContent className="text-appletextgray/50 flex items-center justify-center px-6 py-14 text-sm">
            <Spinner className="ms-2 h-4 w-4 animate-spin" />
            {t("searching")}
          </EmptyContent>
        </Empty>
      );
    }
    if (!isLoading && debouncedQuery.trim() && searchResults.length === 0) {
      return (
        <CommandEmpty>
          <div className="px-6 py-14 text-center text-sm sm:px-14">
            <ExclamationCircleIcon
              className="text-appletextgray mx-auto size-6"
              aria-hidden="true"
            />
            <p className="text-appletextgray/80 mt-4 font-semibold">
              {t("noResultsFound")}
            </p>
            <p className="text-appletextgray/50 mt-2">
              {t("noResultsFoundForQuery", { query: debouncedQuery })}
            </p>
          </div>
        </CommandEmpty>
      );
    }
    return null;
  };

  return (
    <>
      {isDesktop ? (
        // --- DESKTOP VIEW ---
        <div className="relative" ref={searchRef}>
          <Command
            shouldFilter={false}
            className={clsx("overflow-visible transition-all duration-300", {
              "w-12 rounded-full bg-transparent": !open,
              "bg-appleBackgroundWhite/60 ring-appleLightGray w-80 rounded-[40px] shadow-2xl ring-1 inset-shadow-2xs backdrop-blur-sm":
                open,
            })}
          >
            <div>
              <div
                onClick={() => setOpen(!open)}
                className="absolute top-0 left-0 flex h-12 w-12 cursor-pointer items-center justify-center"
              ></div>
              <CommandInput
                className={clsx(
                  "text-appleTextBlack h-full grow bg-transparent text-base outline-none placeholder:text-gray-400 sm:text-sm",
                  "border-none transition-all duration-300 focus:ring-0",
                  {
                    "pointer-events-none w-0 ps-12 opacity-0": !open,
                    "w-full ps-12 opacity-100": open,
                  },
                )}
                placeholder={t("placeholder")}
                value={query}
                onValueChange={setQuery}
                onFocus={() => {
                  if (!open) setOpen(true);
                }}
              />
            </div>
            {open && debouncedQuery.trim() && (
              <CommandList className="ring-appleLightGray bg-appleBackgroundWhite/60 absolute top-full left-0 z-50 mt-2 max-h-96 w-full transform transform-gpu scroll-py-3 overflow-hidden overflow-y-auto rounded-[40px] p-3 shadow-2xl ring-1 backdrop-blur-xl">
                <EmptyOrLoadingState />
                <ResultsListItems />
              </CommandList>
            )}
          </Command>
        </div>
      ) : (
        // --- MOBILE VIEW (Popover) ---
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
            <SearchButton className="bg-transparent hover:bg-neutral-200/50 xl:hidden">
              <span className="flex items-center justify-center gap-1">
                <SearchIcon className="h-4 w-4 text-black sm:h-3 sm:w-3" />
              </span>
            </SearchButton>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            dir={direction}
            className={clsx(
              "ring-appleLightGray bg-appleBackgroundWhite/60 z-10 overflow-hidden rounded-[40px] shadow-2xl ring-1 backdrop-blur-xl",
              "mt-3 w-[90vw] sm:max-w-sm",
              direction === "ltr" ? "mr-4" : "ml-4",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            )}
          >
            <Command
              shouldFilter={false}
              className="flex h-full w-full flex-col bg-transparent"
            >
              <div
                className={clsx(
                  debouncedQuery.trim() && "border-b border-gray-200/50",
                )}
              >
                {/* FIX: Manual SearchIcon removed here to avoid double icons */}
                <CommandInput
                  autoFocus
                  className="placeholder:text-appleBackgorundGray/70 h-auto w-full min-w-0 border-0 bg-transparent p-0 text-base font-medium text-neutral-900 outline-none focus:ring-0"
                  placeholder={t("placeholder")}
                  value={query}
                  onValueChange={setQuery}
                />
              </div>

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
