"use client";
import { createContext, useContext, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { ProjectType, Team, Project } from "@/src/payload-types";
import { PaginatedDocs } from "payload";
import { useProjectsQuery } from "./useProjectsQuery"; // Ensure you create this hook
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
    projectType: string; // Changed from category
    year: string;
    q: string;
  };
  setFilters: (
    newFilters: Partial<PortfolioFilterContextType["filters"]>,
  ) => void;
  sortConfig: { key: string; direction: string };
  setSortConfig: (config: { key: string; direction: string }) => void;
  uniqueProjectTypes: ProjectType[];
  uniqueYears: string[];
  uniqueAuthors: Team[];
  isLoading: boolean;
}

const ProjectsFilterContext = createContext<
  PortfolioFilterContextType | undefined
>(undefined);

export const PortfolioFilterProvider = ({
  children,
  initialPosts,
  uniqueProjectTypes,
  uniqueAuthors,
  uniqueYears,
  initialFilters,
}: {
  children: React.ReactNode;
  initialPosts: PaginatedDocs<Project>;
  uniqueProjectTypes: ProjectType[];
  uniqueAuthors: Team[];
  uniqueYears: string[];
  initialFilters: {
    projectType: string;
    year: string;
    projectStatus: string;
    author: string;
    q: string;
  };
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create a useProjectsQuery hook similar to usePostsQuery but for 'projects' collection
  const { isLoading } = useProjectsQuery();

  const filters = useMemo(() => {
    return {
      projectStatus: initialFilters.projectStatus,
      projectType: initialFilters.projectType,
      author: initialFilters.author,
      year: initialFilters.year,
      q: searchParams.get("q") || "",
    };
  }, [searchParams, initialFilters]);

  const sortConfig = useMemo(() => {
    const sortParam = searchParams.get("sort") || "-year"; // Default sort
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

      // Merge current filters with new ones
      const updatedStatus = newFilters.projectStatus || filters.projectStatus;
      const updatedType = newFilters.projectType || filters.projectType;
      const updatedAuthor = newFilters.author || filters.author;
      const updatedYear = newFilters.year || filters.year;
      const updatedQ = newFilters.q !== undefined ? newFilters.q : filters.q;

      // Construct URL Path segments
      const segments: string[] = [];

      // Logic for path construction (Order matters based on generateStaticParams)
      if (updatedType !== ALL_VALUE) segments.push(updatedType);
      if (updatedYear !== ALL_VALUE) segments.push(updatedYear);
      if (updatedStatus !== ALL_VALUE) segments.push(updatedStatus);

      // Note: If you want to support /type/year, you need to handle that order logic here
      // For simplicity in this example, we append segments linearly.
      // Ensure this matches your generateStaticParams order or use query params for non-primary facets.

      const newPath = `/portfolio/projects/${segments.join("/")}`;

      if (updatedQ) newSearchParams.set("q", updatedQ);
      else newSearchParams.delete("q");

      if (updatedAuthor !== ALL_VALUE)
        newSearchParams.set("author", updatedAuthor); // Author usually query param
      else newSearchParams.delete("author");

      newSearchParams.set("page", "1");

      // Clean double slashes if segments empty
      const finalPath =
        newPath.endsWith("/") && segments.length === 0
          ? newPath.slice(0, -1)
          : newPath;

      router.push(
        `${finalPath}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`,
      );
    },
    [searchParams, filters, router],
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
      uniqueProjectTypes,
      uniqueYears,
      uniqueAuthors,
      isLoading,
    }),
    [
      initialPosts.totalPages,
      initialPosts.totalDocs,
      currentPage,
      filters,
      sortConfig,
      uniqueProjectTypes,
      uniqueYears,
      uniqueAuthors,
      isLoading,
      setCurrentPage,
      setFilters,
      setSortConfig,
    ],
  );

  return (
    <ProjectsFilterContext.Provider value={value}>
      {children}
    </ProjectsFilterContext.Provider>
  );
};

export const usePortfolioFilterContext = () => {
  const context = useContext(ProjectsFilterContext);
  if (context === undefined) {
    throw new Error(
      "usePortfolioFilterContext must be used within a PortfolioFilterProvider",
    );
  }
  return context;
};
