"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getLatestCaseStudies } from "./actions"; // Import Server Action
import { Link } from "@/src/i18n/routing";
import { TypedLocale } from "payload";
import { getDirection } from "@/utils/hooks/useDirection";

// Define the shape of your data
type Project = {
  id: string | number;
  title?: string | null;
  slug?: string | null;
};

function ProjectLinksSkeleton() {
  return (
    <ul className="mt-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <li key={i}>
          <div className="h-5 w-24 animate-pulse rounded-md bg-neutral-200/50 dark:bg-neutral-800/50" />
        </li>
      ))}
    </ul>
  );
}

export function RecentWorks() {
  const locale = useLocale();
  const t = useTranslations("Footer.Navigation");
  const direction = getDirection(locale);

  // Manual State Management
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        // Call the Server Action directly
        const docs = await getLatestCaseStudies(locale as TypedLocale);
        if (isMounted) {
          setProjects(docs);
        }
      } catch (error) {
        console.error("Failed to fetch recent works:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  if (isLoading) return <ProjectLinksSkeleton />;

  return (
    <ul className="mt-6 space-y-4 text-sm/6">
      {projects.map((project) => (
        <li key={project.id}>
          <Link
            href={`/work/${project.slug}`}
            className="font-medium text-gray-950 transition-colors hover:text-gray-700 data-hover:text-gray-950/75"
          >
            {project.title}
          </Link>
        </li>
      ))}

      {/* Static 'See All' Link */}
      <li>
        <Link
          href="/projects"
          className="font-medium text-gray-950 transition-colors hover:text-gray-700 data-hover:text-gray-950/75"
        >
          {t("projects.links.seeAll")}
          <span className="mx-1 inline-block">
            {direction === "rtl" ? "←" : "→"}
          </span>
        </Link>
      </li>
    </ul>
  );
}
