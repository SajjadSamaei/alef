// src/components/blog/archive/Filters/usePostsQuery.ts

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

// Define the shape of filters we expect
type Filters = {
  category?: string;
  year?: string;
  month?: string;
  projectStatus?: string;
  author?: string;
  q?: string;
};

const fetchPosts = async (params: URLSearchParams) => {
  const response = await fetch(`/api/portfolio?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

// Hook now accepts current filters directly
export const useProjectsQuery = (filters?: Filters) => {
  const locale = useLocale();

  const combinedParams = new URLSearchParams();
  combinedParams.set("locale", locale);

  // Map the passed filters object to URL params for the API
  if (filters) {
    if (filters.category && filters.category !== 'all') combinedParams.set("category", filters.category);
    if (filters.year && filters.year !== 'all') combinedParams.set("year", filters.year);
    if (filters.month && filters.month !== 'all') combinedParams.set("month", filters.month);
    if (filters.projectStatus && filters.projectStatus !== 'all') combinedParams.set("projectStatus", filters.projectStatus);
    if (filters.author && filters.author !== 'all') combinedParams.set("author", filters.author);
    if (filters.q) combinedParams.set("q", filters.q);
  }

  // Create a unique key for caching based on the params
  const queryKey = ["portfolio-projects", combinedParams.toString()];

  return useQuery({
    queryKey,
    queryFn: () => fetchPosts(combinedParams),
    staleTime: 60 * 1000,
    // Only fetch if we have filters (optional safety)
  });
};