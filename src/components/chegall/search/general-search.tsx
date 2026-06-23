"use client";
import clsx from "clsx";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  UserIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  XMarkIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Spinner } from "@/components/ui/spinner";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDebounce } from "@/payload/utilities/useDebounce";
import { useDirection } from "@/utils/hooks/useDirection";
import { useRouter } from "@/src/i18n/routing";

// --- Types ---
interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  // Allow for loosely typed API responses
  featuredImage?: any;
  heroImage?: any;
  type: string;
}

interface GeneralSearchBarProps {
  variant?: "header" | "mobile" | "default";
  className?: string;
}

export function GeneralSearchBar({
  variant = "default",
  className,
}: GeneralSearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const t = useTranslations("Search");
  const tNav = useTranslations("Navigation");
  const tSearchGuides = useTranslations("Search.guides");

  const locale = useLocale();
  const direction = useDirection();
  const isRtl = direction === "rtl";
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- GUIDES CONFIGURATION ---
  const guides = [
    {
      label: tNav("projects") || "Projects",
      description:
        tSearchGuides("projects") || "Explore our architectural work",
      icon: BuildingOfficeIcon,
      href: "/portfolio",
      color:
        "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400",
    },
    {
      label: tNav("blog") || "Blog",
      description: tSearchGuides("blog") || "Read our latest news",
      icon: SparklesIcon,
      href: "/blog",
      color:
        "bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400",
    },
    {
      label: tNav("contact") || "Contact",
      description: tSearchGuides("contact-us") || "Get in touch",
      icon: DocumentIcon,
      href: "/contact",
      color:
        "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
    },
    {
      label: tNav("team") || "Team",
      description: tSearchGuides("team") || "Meet the architects",
      icon: UserIcon,
      href: "/about#team",
      color:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
    },
  ];

  // Fetch Logic
  useEffect(() => {
    if (!open) return;

    async function fetchResults() {
      if (!debouncedQuery) {
        setSearchResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/general?q=${encodeURIComponent(debouncedQuery)}&locale=${locale}`,
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
  }, [debouncedQuery, locale, open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (item: SearchResultItem | null) => {
    if (item && item.slug) {
      setOpen(false);
      setQuery("");

      switch (item.type) {
        case "static-pages":
        case "pages":
          const path = item.slug.startsWith("/") ? item.slug : `/${item.slug}`;
          router.push(path === "/home" ? "/" : path);
          break;
        case "posts":
          router.push(`/blog/${item.slug}`);
          break;
        case "case-studies":
          router.push(`/projects/${item.slug}`);
          break;
        case "projects":
          router.push(`/work/${item.slug}`);
          break;
        case "team":
          router.push(`/team/${item.slug}`);
          break;
        default:
          router.push(`/${item.slug}`);
      }
    }
  };

  const handleGuideClick = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  // Helper for Search Result Icons (FIX: Updated classes to h-5 w-5)
  const getTypeIcon = (type: string) => {
    const iconClass = "h-5 w-5 text-neutral-500 dark:text-neutral-400";
    switch (type) {
      case "team":
        return <UserIcon className={iconClass} />;
      case "case-studies":
      case "projects":
        return <BuildingOfficeIcon className={iconClass} />;
      case "static-pages":
      case "pages":
        return <GlobeAltIcon className={iconClass} />;
      default:
        return <DocumentIcon className={iconClass} />;
    }
  };

  // Helper to get Label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "posts":
        return t("post");
      case "static-pages":
      case "pages":
        return t("page");
      case "team":
        return t("team") || "Team";
      case "case-studies":
        return t("project") || "Case Study";
      case "projects":
        return t("project") || "Project";
      default:
        return "";
    }
  };

  const triggerButtonClasses = clsx(
    "flex items-center justify-center transition-colors outline-none",
    {
      "h-full w-full px-6 py-3 hover:bg-black/[2.5%] dark:hover:bg-white/[2.5%]":
        variant === "header",
      "h-12 w-12 rounded-lg hover:bg-black/5 dark:hover:bg-white/10":
        variant === "mobile", // FIX: size-12
      "rounded-full p-2 hover:bg-neutral-100": variant === "default",
    },
    className,
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={triggerButtonClasses}
        aria-label={t("placeholder")}
      >
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-950 dark:text-white" />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open ? (
              <div dir={direction} className="relative z-[9999]">
                <button
                  type="button"
                  aria-label={t("close")}
                  className="fixed inset-0 z-[10000] cursor-default bg-neutral-950/20 backdrop-blur-sm"
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                />

                <div className="pointer-events-none fixed inset-0 z-[10001] w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t("placeholder")}
                    initial={{ opacity: 0, scale: 0.96, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className={clsx(
                      "pointer-events-auto mx-auto max-w-2xl transform overflow-hidden rounded-4xl shadow-2xl ring-1 ring-black/5 ring-inset",
                      "bg-white/65 backdrop-blur-xl dark:bg-neutral-900/90 dark:ring-white/10",
                    )}
                  >
                    <div>
                      {/* Header */}
                      <div className="relative flex items-center border-b border-black/5 px-6 py-4 dark:border-white/5">
                        <MagnifyingGlassIcon
                          className="pointer-events-none h-6 w-6 text-neutral-400"
                          aria-hidden="true"
                        />
                        <input
                          autoFocus
                          value={query}
                          className={clsx(
                            "h-12 w-full bg-transparent text-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-white",
                            isRtl ? "mr-4" : "ml-4",
                          )}
                          placeholder={t("placeholder")}
                          onChange={(event) => setQuery(event.target.value)}
                        />
                        <button
                          onClick={() => setOpen(false)}
                          className="ml-2 rounded-full p-1 text-neutral-400 hover:bg-black/5 hover:text-neutral-600 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Body */}
                      <div className="max-h-[60vh] overflow-y-auto p-2">
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center py-14 text-sm text-neutral-500">
                            <Spinner className="mb-2 h-6 w-6 animate-spin text-neutral-400" />
                            {t("searching")}
                          </div>
                        ) : debouncedQuery ? (
                          searchResults.length > 0 ? (
                            <div
                              className="space-y-1"
                              aria-label={t("results-for")}
                            >
                              {searchResults.map((item) => {
                                // 1. Resolve Image Object safely
                                const rawImage =
                                  item.heroImage || item.featuredImage;

                                const imageObj = rawImage?.value || rawImage;

                                let thumbnailUrl = null;

                                if (imageObj && typeof imageObj === "object") {
                                  thumbnailUrl =
                                    imageObj.sizes?.thumbnail?.url ||
                                    imageObj.url;
                                }
                                const isValidUrl =
                                  typeof thumbnailUrl === "string" &&
                                  thumbnailUrl.length > 0;

                                return (
                                  <button
                                    type="button"
                                    key={`${item.type}-${item.id}`}
                                    onClick={() => handleSelect(item)}
                                    className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl p-3 text-start text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none dark:text-white dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
                                  >
                                    {/* Icon/Image Container */}
                                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                      {isValidUrl ? (
                                        <Image
                                          src={thumbnailUrl!}
                                          alt={item.title || "Result image"}
                                          width={48}
                                          height={48}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        getTypeIcon(item.type)
                                      )}
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex-1 overflow-hidden">
                                      <span className="block truncate text-sm font-medium text-neutral-900 dark:text-white">
                                        {item.title}
                                      </span>
                                      <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                                        {getTypeLabel(item.type)}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            /* NO RESULTS */
                            <div className="flex flex-col items-center justify-center py-14 text-center">
                              <ExclamationCircleIcon className="mb-2 h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                {t("noResultsFound")}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {t("noResultsFoundForQuery", {
                                  query: debouncedQuery,
                                })}
                              </p>
                            </div>
                          )
                        ) : (
                          /* EMPTY STATE (GUIDES) */
                          <div className="p-2 sm:p-4">
                            <p className="mb-4 text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                              {t("menu") || "Quick Access"}
                            </p>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {guides.map((guide) => (
                                <button
                                  key={guide.href}
                                  onClick={() => handleGuideClick(guide.href)}
                                  className={clsx(
                                    "group flex items-center gap-4 rounded-2xl p-3 transition-all",
                                    "hover:bg-neutral-100 dark:hover:bg-white/5",
                                    "border border-transparent hover:border-black/5 dark:hover:border-white/5",
                                    isRtl ? "text-right" : "text-left",
                                  )}
                                >
                                  <div
                                    className={clsx(
                                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                      guide.color,
                                    )}
                                  >
                                    <guide.icon className="h-5 w-5" />
                                  </div>
                                  <div className="flex-1">
                                    <span className="block text-sm font-medium text-neutral-900 dark:text-white">
                                      {guide.label}
                                    </span>
                                    <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                                      {guide.description}
                                    </span>
                                  </div>
                                  <ArrowRightIcon
                                    className={clsx(
                                      "h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1",
                                      isRtl &&
                                        "rotate-180 group-hover:-translate-x-1",
                                    )}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
