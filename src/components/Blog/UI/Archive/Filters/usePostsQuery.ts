// src/components/blog/archive/Filters/usePostsQuery.ts

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation"; // <-- Add usePathname
import { usePathname } from "@/src/i18n/routing";
import { useLocale } from "next-intl";

const fetchPosts = async (params: URLSearchParams) => {
  const response = await fetch(`/api/blog-posts?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const getFiltersFromPathname = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const archiveIndex = segments.indexOf("archive");
  if (archiveIndex === -1 || archiveIndex === segments.length - 1) {
    return { category: null, year: null, month: null };
  }
  const filterSegments = segments.slice(archiveIndex + 1);

  let category = null;
  let year = null;
  let month = null;

  filterSegments.forEach((segment) => {
    if (/^\d{4}$/.test(segment)) {
      year = segment;
    } else if (/^\d{1,2}$/.test(segment)) {
      month = segment;
    } else {
      category = segment;
    }
  });

  return { category, year, month };
};

export const usePostsQuery = () => {
  const pathname = usePathname(); // <-- Get pathname here
  const searchParams = useSearchParams();
  const locale = useLocale();

  // Extract filters from the pathname
  const pathFilters = getFiltersFromPathname(pathname);

  // Combine path-based filters with search-based filters
  const combinedParams = new URLSearchParams(searchParams);
  combinedParams.set("locale", locale);
  if (pathFilters.category) {
    combinedParams.set("category", pathFilters.category);
  }
  if (pathFilters.year) {
    combinedParams.set("year", pathFilters.year);
  }
  if (pathFilters.month) {
    combinedParams.set("month", pathFilters.month);
  }

  const queryKey = ["posts", combinedParams.toString()];

  return useQuery({
    queryKey,
    queryFn: () => fetchPosts(combinedParams),
    staleTime: 60 * 1000,
  });
};
