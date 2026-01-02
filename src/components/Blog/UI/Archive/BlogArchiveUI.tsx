"use client";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArchivePostList } from "@/components/Blog/UI/Archive/ArchiveList";
import { PageRange } from "@/components/Blog/UI/Archive/Paginations/PageRange";
import { Pagination } from "@/components/Blog/UI/Archive/Paginations/dynamic-routing";
import { useBlogFilterContext } from "@/components/Blog/UI/Archive/Filters/FilterProvider";
import { usePostsQuery } from "@/components/Blog/UI/Archive/Filters/usePostsQuery";
import { ArchiveListSkeleton } from "@/components/Blog/UI/Archive/Skeleton/ArchiveListSkeleton"; // You can use the same skeleton or a list-based one
import {
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";

export const BlogArchiveUI = () => {
  const t = useTranslations("Search");
  const { currentPage } = useBlogFilterContext();
  const { data, isLoading, isError, error } = usePostsQuery();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  // 1. Loading
  if (isLoading) {
    // You might want to create a ListSkeleton, but grid skeleton is "okay" as a placeholder
    return <ArchiveListSkeleton />;
  }

  // 2. Error
  if (isError) {
    return (
      <p className="py-20 text-center text-red-500">Error: {error.message}</p>
    );
  }

  const posts = data?.docs || [];

  // 3. Empty
  if (posts.length === 0) {
    return (
      <Container className="py-32 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
          <MagnifyingGlassIcon className="h-10 w-10 text-neutral-400" />
        </div>
        <h2 className="mt-6 text-xl font-medium">{t("noResultsFound")}</h2>
      </Container>
    );
  }

  // 4. List View
  return (
    <div className="mb-24">
      <FadeIn>
        {/* Header */}
        <div className="mb-12 flex items-center justify-between border-b border-neutral-200 pb-6 dark:border-white/10">
          <PageRange
            nounKey="Blog.articles"
            currentPage={currentPage}
            limit={10}
            totalDocs={data?.totalDocs || 0}
          />
        </div>

        {/* The New Modern List */}
        <ArchivePostList posts={posts as any} />

        {/* Pagination */}
        <div className="mt-20 border-t border-neutral-200 pt-12 dark:border-white/10">
          {data?.totalPages > 1 && <Pagination />}
        </div>
      </FadeIn>
    </div>
  );
};
