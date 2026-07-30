// src/components/Portfolio/UI/Archive/Filters/useProjectsQuery.ts

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

// Define the shape of filters specific to Projects
type Filters = {
  projectType?: string; // Changed from 'category'
  year?: string;
  projectStatus?: string; // Unique to projects
  author?: string;
  q?: string;
};

const fetchProjects = async (params: URLSearchParams) => {
  // We point to a dedicated API route for projects to keep logic clean
  const response = await fetch(`/api/projects?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useProjectsQuery = (filters?: Filters) => {
  const locale = useLocale();

  const combinedParams = new URLSearchParams();
  combinedParams.set("locale", locale);

  // Map filters to URL params
  if (filters) {
    // Project Type
    if (filters.projectType && filters.projectType !== "all") {
      combinedParams.set("projectType", filters.projectType);
    }

    // Year
    if (filters.year && filters.year !== "all") {
      combinedParams.set("year", filters.year);
    }

    // Status
    if (filters.projectStatus && filters.projectStatus !== "all") {
      combinedParams.set("projectStatus", filters.projectStatus);
    }

    // Author / Team Member
    if (filters.author && filters.author !== "all") {
      combinedParams.set("author", filters.author);
    }

    // Search Query
    if (filters.q) {
      combinedParams.set("q", filters.q);
    }
  }

  // Unique cache key for projects
  const queryKey = ["portfolio-projects", combinedParams.toString()];

  return useQuery({
    queryKey,
    queryFn: () => fetchProjects(combinedParams),
    staleTime: 60 * 1000, // 1 minute cache
  });
};
