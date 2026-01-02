"use client";
import { createContext, useContext, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { ProjectType, Team, CaseStudy } from "@/src/payload-types";
import { PaginatedDocs } from "payload";
import { usePostsQuery } from "./usePostsQuery"; // Import usePostsQuery
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/src/i18n/routing";
const ALL_VALUE = "all";

interface PortfolioFilterContextType {
  currentPage: number;
  totalPages: number;
  totalDocs: number;
  setCurrentPage: (page: number) => void;
  filters: {
    projectStatus: string;
    author: string;
    category: string;
    year: string;
    month: string;
    q: string;
  };
  setFilters: (
    newFilters: Partial<PortfolioFilterContextType["filters"]>,
  ) => void;
  sortConfig: { key: string; direction: string };
  setSortConfig: (config: { key: string; direction: string }) => void;
  uniqueCategories: ProjectType[];
  uniqueYears: string[];
  uniqueMonths: string[];
  uniqueAuthors: Team[];
  isLoading: boolean; // Add isLoading to the interface
}

const PortfolioFilterContext = createContext<
  PortfolioFilterContextType | undefined
>(undefined);

export const PortfolioFilterProvider = ({
  children,
  initialPosts,
  uniqueCategories,
  uniqueAuthors,
  uniqueYears,
  uniqueMonths,
  initialFilters,
}: {
  children: React.ReactNode;
  initialPosts: PaginatedDocs<CaseStudy>;
  uniqueCategories: ProjectType[];
  uniqueAuthors: Team[];
  uniqueYears: string[];
  uniqueMonths: string[];
  initialFilters: {
    category: string;
    year: string;
    month: string;
    projectStatus: string;
    author: string;
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
    const statusFromPath = initialFilters.projectStatus;
    const authorFromPath = initialFilters.author;
    const yearFromPath = initialFilters.year;
    const monthFromPath = initialFilters.month;
    const qFromUrl = searchParams.get("q") || "";

    return {
      projectStatus: statusFromPath,
      category: categoryFromPath,
      author: authorFromPath,
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
    (newFilters: Partial<PortfolioFilterContextType["filters"]>) => {
      const newSearchParams = new URLSearchParams(searchParams);
      const updatedStatus = newFilters.projectStatus || filters.projectStatus;
      const updatedCategory = newFilters.category || filters.category;
      const updatedAuthor = newFilters.author || filters.author;
      const updatedYear = newFilters.year || filters.year;
      const updatedMonth = newFilters.month || filters.month;
      const updatedQ = newFilters.q || filters.q;

      const segments: string[] = [];

      if (updatedStatus !== ALL_VALUE) {
        segments.push(updatedStatus);
      }
      if (updatedAuthor !== ALL_VALUE) {
        segments.push(updatedAuthor);
      }
      if (updatedCategory !== ALL_VALUE) {
        segments.push(updatedCategory);
      }
      if (updatedYear !== ALL_VALUE) {
        segments.push(updatedYear);
      }
      if (updatedMonth !== ALL_VALUE) {
        segments.push(updatedMonth);
      }
      const newPath = `/portfolio/${segments.join("/")}`;

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
    <PortfolioFilterContext.Provider value={value}>
      {children}
    </PortfolioFilterContext.Provider>
  );
};
export const usePortfolioFilterContext = () => {
  const context = useContext(PortfolioFilterContext);
  if (context === undefined) {
    throw new Error(
      "usePortfolioFilterContext must be used within a PortfolioFilterProvider",
    );
  }
  return context;
};
