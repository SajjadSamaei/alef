"use client";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProjectList } from "@/components/Projects/UI/Archive/ProjectList";
import { PageRange } from "@/components/Projects/UI/Archive/Paginations/PageRange";
import { Pagination } from "@/components/Projects/UI/Archive/Paginations/dynamic-routing";
import { usePortfolioFilterContext } from "@/components/Projects/UI/Archive/Filters/FilterProvider";
import { useProjectsQuery } from "@/components/Projects/UI/Archive/Filters/useProjectsQuery";
import { PostSkeleton } from "@/components/Projects/UI/Archive/Skeleton/PostSkeleton";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

import { useTranslations } from "next-intl";

export const ProjectArchiveUI = () => {
  const t = useTranslations("Search");
  const { currentPage, filters } = usePortfolioFilterContext();
  const { data, isLoading, isError, error } = useProjectsQuery(filters);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  if (isLoading) {
    return (
      <div className="space-y-20 sm:space-y-24 lg:space-y-32">
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  const posts = data?.docs || []; // Check if no posts were returned

  if (posts.length === 0) {
    if (searchQuery) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <ExclamationCircleIcon className="text-appleBackgorundGray/80 dark:text-appleBackgroundWhite/80 h-16 w-16" />
          <h2 className="text-appleBackgorundGray/80 dark:text-appleBackgroundWhite/80 mt-4 text-xl font-semibold">
            {t("no-results")}
          </h2>
          <p className="text-appleBackgorundGray/70 dark:text-appleBackgroundWhite/70 mt-2">
            {t("noResultsFoundForQuery", { query: searchQuery })}
          </p>
          <p className="text-appleBackgorundGray/70 dark:text-appleBackgroundWhite/70 mt-1">
            {t("tryAgain")}
          </p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <ExclamationCircleIcon className="text-appleBackgorundGray/80 dark:text-appleBackgroundWhite/80 h-16 w-16" />
          <h2 className="text-appleBackgorundGray/70 dark:text-appleBackgroundWhite/70 mt-4 text-xl font-semibold">
            {t("no-results")}
          </h2>
          <p className="text-appleBackgorundGray/70 dark:text-appleBackgroundWhite/70 mt-2">
            {t("noArticlesAvailable")}
          </p>
        </div>
      );
    }
  }

  return (
    <div className="mb-16">
      <FadeIn>
        <div className="section-style-no-mobile mb-8">
          <PageRange
            nounKey="Blog.projects"
            currentPage={currentPage}
            limit={12}
            totalDocs={data?.totalDocs || 0}
          />
        </div>

        <ProjectList posts={posts} />

        <div className="container">
          {data?.totalPages > 1 && <Pagination />}
        </div>
      </FadeIn>
    </div>
  );
};
