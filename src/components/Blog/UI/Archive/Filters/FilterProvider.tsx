"use client";
import { createContext, useContext, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { BlogCategory, Author } from "@/src/payload-types";
import { PaginatedDocs } from "payload";
import { usePostsQuery } from "./usePostsQuery"; // Import usePostsQuery
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/src/i18n/routing";
import { Post } from "@/src/payload-types";
const ALL_VALUE = "all";

interface BlogFilterContextType {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
  setCurrentPage: (page: number) => void;
  filters: { category: string; year: string; month: string; q: string };
  setFilters: (newFilters: Partial<BlogFilterContextType["filters"]>) => void;
  sortConfig: { key: string; direction: string };
  setSortConfig: (config: { key: string; direction: string }) => void;
  uniqueCategories: BlogCategory[];
  uniqueYears: string[];
  uniqueMonths: string[];
  uniqueAuthors: Author[];
  isLoading: boolean; // Add isLoading to the interface
}

const BlogFilterContext = createContext<BlogFilterContextType | undefined>(
  undefined,
);

export const BlogFilterProvider = ({
  children,
  initialPosts,
  uniqueCategories,
  uniqueAuthors,
  uniqueYears,
  uniqueMonths,
  initialFilters,
}: {
  children: React.ReactNode;
  initialPosts: PaginatedDocs<Post>;
  uniqueCategories: BlogCategory[];
  uniqueAuthors: Author[];
  uniqueYears: string[];
  uniqueMonths: string[];
  initialFilters: {
    category: string;
    year: string;
    month: string;
  };
}) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isLoading } = usePostsQuery(); // Get isLoading from the hook

  // The `filters` object is now derived directly from the URL.
  const filters = useMemo(() => {
    const categoryFromPath = initialFilters.category;
    const yearFromPath = initialFilters.year;
    const monthFromPath = initialFilters.month;
    const qFromUrl = searchParams.get("q") || "";

    return {
      category: categoryFromPath,
      year: yearFromPath,
      month: monthFromPath,
      q: qFromUrl,
    };
  }, [searchParams, initialFilters]);

  const sortConfig = useMemo(() => {
    const sortParam = searchParams.get("sort") || "-publishedAt";
    return {
      key: sortParam.startsWith("-") ? sortParam.substring(1) : sortParam,
      direction: sortParam.startsWith("-") ? "desc" : "asc",
    };
  }, [searchParams]);

  const currentPage = useMemo(() => {
    return parseInt(searchParams.get("page") || "1");
  }, [searchParams]);

  const setFilters = useCallback(
    (newFilters: Partial<BlogFilterContextType["filters"]>) => {
      const newSearchParams = new URLSearchParams(searchParams);

      const updatedCategory = newFilters.category || filters.category;
      const updatedYear = newFilters.year || filters.year;
      const updatedMonth = newFilters.month || filters.month;
      const updatedQ = newFilters.q || filters.q;

      const segments: string[] = [];
      if (updatedCategory !== ALL_VALUE) {
        segments.push(updatedCategory);
      }
      if (updatedYear !== ALL_VALUE) {
        segments.push(updatedYear);
      }
      if (updatedMonth !== ALL_VALUE) {
        segments.push(updatedMonth);
      }
      const newPath = `/blog/archive/${segments.join("/")}`;

      if (updatedQ) {
        newSearchParams.set("q", updatedQ);
      } else {
        newSearchParams.delete("q");
      }

      newSearchParams.set("page", "1");

      router.push(
        `${newPath}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`,
      );
    },
    [searchParams, filters, locale, router],
  );

  const setSortConfig = useCallback(
    (newSortConfig: { key: string; direction: string }) => {
      const newSearchParams = new URLSearchParams(searchParams);
      const sortValue =
        newSortConfig.direction === "desc"
          ? `-${newSortConfig.key}`
          : newSortConfig.key;
      newSearchParams.set("sort", sortValue);
      newSearchParams.set("page", "1");
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const setCurrentPage = useCallback(
    (page: number) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", page.toString());
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const value = useMemo(
    () => ({
      totalPages: initialPosts.totalPages,
      totalDocs: initialPosts.totalDocs,
      currentPage,
      setCurrentPage,
      filters,
      setFilters,
      sortConfig,
      setSortConfig,
      uniqueCategories,
      uniqueYears,
      uniqueMonths,
      uniqueAuthors,
      isLoading, // Add isLoading to the value object
    }),
    [
      initialPosts.totalPages,
      initialPosts.totalDocs,
      currentPage,
      filters,
      sortConfig,
      uniqueCategories,
      uniqueYears,
      uniqueMonths,
      uniqueAuthors,
      isLoading,
      setCurrentPage,
      setFilters,
      setSortConfig,
    ],
  );

  return (
    <BlogFilterContext.Provider value={value}>
      {children}
    </BlogFilterContext.Provider>
  );
};
export const useBlogFilterContext = () => {
  const context = useContext(BlogFilterContext);
  if (context === undefined) {
    throw new Error(
      "useBlogFilterContext must be used within a BlogFilterProvider",
    );
  }
  return context;
};
