import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import { GradientComponent } from "@/components/chegall/radient/gradient";
import { TypingAnimation } from "@/components/ui/magicui/typing-animation";
import { BlogRibbon } from "@/components/Blog/UI/Ribbon/blog-ribbon";
import { CollectionArchive } from "@/components/Blog/UI/Archive/CollectionArchive";
import { CollectionArchiveSkeleton } from "@/components/Blog/UI/Archive/CollectionArchive/Skeleton";
import { Pagination } from "@/components/Blog/UI/Archive/Paginations/Pagination";
import configPromise from "@payload-config";
import { getPayload, TypedLocale } from "payload";
import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/routing"; // Using standard routing link
import {
  ArrowLongRightIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/outline"; // Switched to Outline to match Portfolio
import clsx from "clsx";
import type { Post, Category } from "@/src/payload-types";
import { getDirection } from "@/utils/hooks/useDirection";
import { FeatureCard } from "@/components/Blog/UI/Archive/FeatureCard";

type Args = {
  params: Promise<{ locale: TypedLocale }>;
  searchParams: Promise<{ page?: string; category?: string }>;
};

// --- METADATA ---
export async function generateMetadata(props: Args): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Blog.Metadata" });
  const ogLocale = locale === "fa" ? "fa_IR" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      locale: ogLocale,
      description: t("description"),
    },
  };
}

// --- DATA FETCHERS ---

// 1. Fetch Categories for the Quick Nav
async function getCategories(locale: TypedLocale) {
  const payload = await getPayload({ config: configPromise });
  const categories = await payload.find({
    collection: "blog-categories",
    locale,
    limit: 100,
    sort: "title",
  });
  return categories.docs;
}

const getButtonClasses = (invert = false) => {
  return clsx(
    "inline-flex items-center rounded-full px-4 py-1.5 text-base sm:text-sm font-semibold transition",
    invert
      ? "bg-white text-neutral-950 hover:bg-neutral-200"
      : "bg-neutral-950 text-white hover:bg-neutral-800",
  );
};

// 2. Fetch "Jaroun" specific posts (Featured Project Tag)
async function getJarounPosts(locale: TypedLocale) {
  const payload = await getPayload({ config: configPromise });
  // Assuming 'tags' is a relationship field. Adjust 'jaroun' to your actual tag slug.
  const posts = await payload.find({
    collection: "posts",
    locale,
    limit: 3,
    sort: "-publishedAt",
    where: {
      "tags.slug": { equals: "jaroun" }, // Ensure you have a 'tags' collection or field
    },
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      publishedAt: true,
    },
  });
  return posts.docs;
}

// 3. Fetch Main Posts (Paginated)
async function getMainPosts(
  locale: TypedLocale,
  page: number,
  categorySlug?: string,
) {
  const payload = await getPayload({ config: configPromise });

  const whereQuery: any = {};
  if (categorySlug) {
    whereQuery["categories.slug"] = { equals: categorySlug };
  }

  return await payload.find({
    collection: "posts",
    depth: 1,
    limit: 9, // Layout works best with multiples of 3 or 4
    page,
    locale,
    fallbackLocale: "fa",
    sort: "-publishedAt",
    where: whereQuery,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      publishedAt: true,
      updatedAt: true,
      createdAt: true,
    },
  });
}

// --- PAGE COMPONENT ---
export default async function Page(props: Args) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { locale } = params;
  const t = await getTranslations("Blog");
  const tCommon = await getTranslations("Common"); // For generic "See More" etc.

  const pageNumber = parseInt(searchParams.page || "1");
  const categoryFilter = searchParams.category;
  const isRtl = locale === "fa";

  // Parallel Fetching for performance
  const [categories, jarounPosts, mainPosts] = await Promise.all([
    getCategories(locale),
    getJarounPosts(locale),
    getMainPosts(locale, pageNumber, categoryFilter),
  ]);

  return (
    <>
      <BlogRibbon categories={categories as Category[]} />

      {/* --- HERO SECTION (Matches Portfolio Style) --- */}
      <Container className="mt-10 lg:mt-10">
        <div className="relative">
          <GradientComponent className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
          <Container className="relative">
            <div className="flex flex-col items-center justify-center gap-4 pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
              <div className="flex items-center justify-center">
                <TypingAnimation className="font-display text-center! text-4xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-6xl/[0.8] md:text-7xl/[0.8]">
                  {t("Hero.title")}
                </TypingAnimation>
              </div>
              <p className="mt-8 max-w-lg text-center text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8">
                {t("Hero.subtitle")}
              </p>

              {/* Category Pills - Centered in Hero now */}
              <div className="mx-auto mt-12 w-full max-w-4xl">
                <FadeInStagger faster>
                  <div className="flex flex-wrap justify-center gap-3">
                    {/* "All Stories" Link */}
                    <FadeIn>
                      <Link
                        href="/blog/archive"
                        className={clsx(
                          "inline-block rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300",
                          !categoryFilter
                            ? "scale-105 border-neutral-950 bg-neutral-950 text-white shadow-md" // Active state
                            : "border-neutral-200 bg-white text-neutral-600 hover:scale-105 hover:border-neutral-400 hover:bg-neutral-50", // Inactive state
                        )}
                      >
                        {t("allStories")}
                      </Link>
                    </FadeIn>

                    {/* Dynamic Categories */}
                    {categories.map((cat) => (
                      <FadeIn key={cat.id}>
                        <Link
                          href={`/blog/archive/${(cat as Category).slug}`}
                          className={clsx(
                            "inline-block rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300",
                            categoryFilter === (cat as Category).slug
                              ? "scale-105 border-neutral-950 bg-neutral-950 text-white shadow-md"
                              : "border-neutral-200 bg-white text-neutral-600 hover:scale-105 hover:border-neutral-400 hover:bg-neutral-50",
                          )}
                        >
                          {(cat as Category).title}
                        </Link>
                      </FadeIn>
                    ))}
                  </div>
                </FadeInStagger>
              </div>
            </div>
          </Container>
        </div>
      </Container>

      {/* 5. Main Article Grid */}
      <Container>
        <div id="latest" className="section-padding mt-12 sm:mt-18">
          <FadeIn className="col-span-2">
            <div className="section-padding section-style mx-auto text-center">
              <h2 className="text-jarounGray7 eyebrow-style mb-2 lg:mb-3">
                {t("latestArticles")}
              </h2>
              <p className="text-jarounGray7 title-style text-4xl font-medium sm:text-5xl">
                {t("latestDescription")}
              </p>
            </div>
          </FadeIn>
          <Suspense fallback={<CollectionArchiveSkeleton />}>
            <CollectionArchive posts={mainPosts.docs} />
          </Suspense>

          {/* {mainPosts.totalPages > 1 && (
            <div className="mt-16">
              <Pagination
                page={mainPosts.page || 1}
                totalPages={mainPosts.totalPages}
              />
            </div>
          )} */}
        </div>
      </Container>

      {/* 4. "Jaroun" Feature Section (Only on page 1 & no category filter) */}
      <Container>
        {jarounPosts.length > 0 && pageNumber === 1 && !categoryFilter && (
          <Container className="section-padding section-style mx-auto mt-12 rounded-[40px] bg-neutral-100 p-8 sm:mt-18 sm:p-12 lg:p-16 dark:bg-neutral-900/50">
            {/* HEADER: Just Title & Desc */}
            <div className="mb-12 max-w-2xl">
              <span className="mb-3 block font-mono text-xs font-bold tracking-widest text-neutral-500 uppercase">
                {t("Featured.label")}
              </span>
              <h2 className="mb-4 text-3xl font-semibold text-neutral-950 sm:text-4xl dark:text-white">
                {t("Featured.jarounTitle")}
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                {t("Featured.jarounDesc")}
              </p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {jarounPosts.map((post, index) => (
                <FeatureCard
                  key={index}
                  doc={post as Post}
                  index={index}
                  locale={locale}
                  readMoreLabel={tCommon("readMore")}
                />
              ))}
            </div>

            {/* FOOTER: Button Centered at bottom */}
            <div className="mt-12 flex justify-center md:justify-end">
              <Link
                href={`/${locale}/blog?q=jaroun`}
                className={getButtonClasses(false)}
              >
                {t("Featured.exploreJaroun")}
                {isRtl ? (
                  <ArrowLongLeftIcon className="mr-2 h-5 w-5" />
                ) : (
                  <ArrowLongRightIcon className="ml-2 h-5 w-5" />
                )}
              </Link>
            </div>
          </Container>
        )}
      </Container>
    </>
  );
}
