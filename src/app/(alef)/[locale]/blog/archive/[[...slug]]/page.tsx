import type { Metadata } from "next/types";
import { notFound } from "next/navigation";
import { getPayload, PaginatedDocs, TypedLocale } from "payload";
import configPromise from "@payload-config";
import { getTranslations } from "next-intl/server";

import localization from "@/src/i18n/localization"; // Your i18n config
import type { Post, BlogCategory, Author } from "@/src/payload-types";
import {
  getMonthFromTimestamp,
  getPersianMonthNumberFromGregorian,
  getPersianYearFromGregorian,
  getYearFromTimestamp,
  getGregorianDateRangeFromPersian,
} from "@/payload/utilities/helpers/date-utils";

import { Container } from "@/components/ui/container";
import { BlogArchiveUI } from "@/components/Blog/UI/Archive/BlogArchiveUI";
import { BlogFilterProvider } from "@/components/Blog/UI/Archive/Filters/FilterProvider";
import { ArchiveFilterRibbon } from "@/components/Blog/UI/Archive/Filters/filter-ribbon";
import QueryProvider from "@/payload/utilities/stores/QueryProvider";
import { requireEnabledPage } from "@/payload/utilities/siteSettings";

// export const dynamic = "force-static";
// export const revalidate = 600;

// Define a type for a Post that includes the 'locale' property
// This is added by Payload at runtime when using fallbacks.
type PostWithLocale = Post & { locale?: TypedLocale };

//
// --- 1. GENERATE STATIC PARAMS ---
//
// This function generates all possible archive paths for all locales
// to ensure the fallback model works perfectly.
//
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const allParams = new Set<string>(); // Stores "locale|path"
  const locales = localization.locales.map((l) => l.code);

  // 1. Fetch all filterable items ONCE
  const { docs: allCategories } = await payload.find({
    collection: "categories",
    depth: 0,
    limit: 1000,
    select: { slug: true },
  });

  const { docs: allPostDates } = await payload.find({
    collection: "posts",
    depth: 0,
    limit: 10000,
    select: { publishedAt: true },
    where: { _status: { equals: "published" } },
  });

  // 2. Process dates into sets for EACH calendar system
  const uniqueDates = {
    en: { years: new Set<string>(), months: new Set<string>() },
    fa: { years: new Set<string>(), months: new Set<string>() },
    // Add other calendar systems if needed (e.g., 'ar')
  };

  allPostDates.forEach((post) => {
    if (!post.publishedAt) return;
    const date = new Date(post.publishedAt);

    // Add Gregorian dates (for 'en', 'es', 'de', etc.)
    uniqueDates.en.years.add(getYearFromTimestamp(date));
    uniqueDates.en.months.add(getMonthFromTimestamp(date));

    // Add Persian dates
    uniqueDates.fa.years.add(getPersianYearFromGregorian(date));
    uniqueDates.fa.months.add(getPersianMonthNumberFromGregorian(date));
  });

  // 3. Loop through locales and build all combinations
  locales.forEach((locale: string) => {
    // Determine which date set to use for this locale
    const { years, months } = locale === "fa" ? uniqueDates.fa : uniqueDates.en;
    const categorySlugs = allCategories.map((c) => c.slug).filter(Boolean);

    // Add base path (e.g., /en/blog/archive)
    allParams.add(`${locale}|`);

    // Add single-segment paths
    categorySlugs.forEach((slug) => allParams.add(`${locale}|${slug}`));
    years.forEach((year) => allParams.add(`${locale}|${year}`));

    // Add two-segment paths
    years.forEach((year) => {
      months.forEach((month) => {
        allParams.add(`${locale}|${year}/${month}`);
      });
    });
    categorySlugs.forEach((slug) => {
      years.forEach((year) => {
        allParams.add(`${locale}|${slug}/${year}`);
      });
    });

    // Add three-segment paths
    categorySlugs.forEach((slug) => {
      years.forEach((year) => {
        months.forEach((month) => {
          allParams.add(`${locale}|${slug}/${year}/${month}`);
        });
      });
    });
  });

  // 4. Format for Next.js
  return Array.from(allParams).map((pathWithLocale) => {
    const [locale, path] = pathWithLocale.split("|");

    return {
      locale: locale,
      slug: path === "" ? undefined : path.split("/"),
    };
  });
}

//
// --- 2. DEFINE PAGE/METADATA ARGS ---
//
type Args = {
  params: Promise<{
    slug?: string[]; // Catch-all route is string[]
    locale: TypedLocale;
  }>;

  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
};

//
// --- 3. GENERATE METADATA ---
//
export async function generateMetadata({
  params,
  searchParams,
}: Args): Promise<Metadata> {
  const { slug, locale } = await params;
  const { q } = await searchParams;
  const t = await getTranslations({
    locale,
    namespace: "Metadata.BlogArchive",
  });
  const tMonths = await getTranslations({ locale, namespace: "Months" });
  const payload = await getPayload({ config: configPromise });

  // Use the single default locale for all fallbacks
  const fallbackLocale = localization.defaultLocale || "en";

  let categorySlug: string | null = null;
  let year: string | null = null;
  let month: string | null = null;

  // Parse segments from the slug array
  if (slug) {
    slug.forEach((segment) => {
      if (/^\d{4}$/.test(segment)) year = segment;
      else if (/^\d{1,2}$/.test(segment)) month = segment.padStart(2, "0");
      else categorySlug = segment;
    });
  }

  let categoryTitle: string | null = null;
  if (categorySlug) {
    const categoryDoc = await payload.find({
      collection: "categories",
      where: { slug: { equals: categorySlug } },
      limit: 1,
      locale: locale,
      fallbackLocale: fallbackLocale as TypedLocale,
    });
    if (categoryDoc.docs.length > 0) {
      categoryTitle = categoryDoc.docs[0].title;
    }
  }

  let title = t("title");
  let description = t("description");
  const parts: string[] = [];

  if (q) {
    parts.push(t("searchingFor", { query: q }));
    title = t("searchResultsTitle", { query: q });
    description = t("searchResultsDescription", { query: q });
  }

  if (categoryTitle) {
    parts.push(t("category", { title: categoryTitle }));
  }
  if (year) {
    const displayYear = new Intl.NumberFormat(locale, {
      useGrouping: false,
    }).format(parseInt(year));
    parts.push(t("year", { year: displayYear }));
  }
  if (month) {
    // Use i18n JSON file for month names
    const monthName = tMonths(month); // e.g., tMonths('01') -> 'January' or 'فروردین'
    parts.push(t("month", { month: monthName }));
  }

  if (parts.length > 0 && !q) {
    title = t("archiveWithFilters", { filters: parts.join(", ") });
  } else if (parts.length > 0 && q) {
    title = t("searchWithFilters", { query: q, filters: parts.join(", ") });
  }

  return {
    title: title,
    description: description,
    // ... openGraph and twitter metadata
  };
}

//
// --- 4. PAGE COMPONENT ---
//
export default async function Page(props: Args) {
  const payload = await getPayload({ config: configPromise });
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { slug, locale } = await params;
  await requireEnabledPage("blog", locale);
  const { q, page } = searchParams; // Destructure page here
  const pageNumber = parseInt((page as string) || "1");

  // Use the single default locale for all fallbacks
  const fallbackLocale = (localization.defaultLocale || "en") as TypedLocale;

  let categorySlug: string | null = null;
  let year: string | null = null;
  let month: string | null = null;

  // Parse segments
  if (slug) {
    slug.forEach((segment) => {
      if (/^\d{4}$/.test(segment)) year = segment;
      else if (/^\d{1,2}$/.test(segment)) month = segment.padStart(2, "0");
      else categorySlug = segment;
    });
  }

  // --- Fetch Filter Options ---
  // (These are used to populate the dropdowns in the client)
  const allCategories = await payload.find({
    collection: "blog-categories",
    depth: 0,
    limit: 1000,
    locale: locale,
    fallbackLocale: fallbackLocale,
    select: { title: true, slug: true },
  });
  const allAuthors = await payload.find({
    collection: "authors",
    depth: 0,
    locale: locale,
    fallbackLocale: fallbackLocale,
    limit: 1000,
    select: { name: true },
  });
  const allPostDates = await payload.find({
    collection: "posts",
    depth: 0,
    limit: 10000,
    locale: locale, // Use current locale
    fallbackLocale: fallbackLocale, // Get fallbacks
    select: { publishedAt: true },
    where: { _status: { equals: "published" } },
  });

  // Generate unique dates *based on the current locale's calendar*
  const uniqueYearSet = [
    ...new Set(
      allPostDates.docs
        .map((post) => {
          if (!post.publishedAt) return null;
          const date = new Date(post.publishedAt);
          return locale === "fa"
            ? getPersianYearFromGregorian(date)
            : getYearFromTimestamp(date);
        })
        .filter(Boolean) as string[],
    ),
  ].sort((a, b) => parseInt(b) - parseInt(a));

  const uniqueMonthSet = [
    ...new Set(
      allPostDates.docs
        .map((post) => {
          if (!post.publishedAt) return null;
          const date = new Date(post.publishedAt);
          return locale === "fa"
            ? getPersianMonthNumberFromGregorian(date)
            : getMonthFromTimestamp(date);
        })
        .filter(Boolean) as string[],
    ),
  ].sort((a, b) => parseInt(a) - parseInt(b));

  // --- Build Where Query ---
  const where: any = { and: [] };
  where.and.push({ _status: { equals: "published" } });

  if (categorySlug) {
    where.and.push({ "categories.slug": { equals: categorySlug } });
  }

  if (q) {
    where.and.push({
      or: [{ title: { like: q } }, { subtitle: { like: q } }],
    });
  }

  // --- Date Filtering (Locale-Aware) ---
  if (year && month) {
    if (locale === "fa") {
      const { start, end } = getGregorianDateRangeFromPersian(year, month);
      if (start && end) {
        where.and.push({
          publishedAt: {
            greater_than_equal: start.toISOString(),
            less_than_equal: end.toISOString(),
          },
        });
      }
    } else {
      const y = parseInt(year);
      const m = parseInt(month) - 1;
      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 0); // Last day of month
      end.setHours(23, 59, 59, 999);
      where.and.push({
        publishedAt: {
          greater_than_equal: start.toISOString(),
          less_than_equal: end.toISOString(),
        },
      });
    }
  } else if (year) {
    if (locale === "fa") {
      const { start: startOfYear } = getGregorianDateRangeFromPersian(
        year,
        "01",
      );
      const { start: endOfYear } = getGregorianDateRangeFromPersian(
        (parseInt(year) + 1).toString(),
        "01",
      );
      if (startOfYear && endOfYear) {
        where.and.push({
          publishedAt: {
            greater_than_equal: startOfYear.toISOString(),
            less_than: endOfYear.toISOString(),
          },
        });
      }
    } else {
      const y = parseInt(year);
      const startOfYear = new Date(y, 0, 1);
      const endOfYear = new Date(y + 1, 0, 1);
      where.and.push({
        publishedAt: {
          greater_than_equal: startOfYear.toISOString(),
          less_than: endOfYear.toISOString(),
        },
      });
    }
  }

  // --- Fetch Initial Posts ---
  const initialPosts: PaginatedDocs<PostWithLocale> = (await payload.find({
    collection: "posts",
    depth: 1,
    limit: 10,
    page: pageNumber,
    where: where.and.length > 1 ? where : { _status: { equals: "published" } }, // Handle no filters
    locale: locale,
    fallbackLocale: fallbackLocale,
  })) as PaginatedDocs<PostWithLocale>; // Cast to our custom type

  if (initialPosts.docs.length === 0 && pageNumber > 1) {
    notFound();
  }

  const initialFilters = {
    category: categorySlug || "all",
    year: year || "all",
    month: month || "all",
  };

  return (
    <QueryProvider>
      <BlogFilterProvider
        initialPosts={initialPosts}
        uniqueCategories={allCategories.docs as BlogCategory[]}
        uniqueAuthors={allAuthors.docs as Author[]}
        uniqueYears={uniqueYearSet}
        uniqueMonths={uniqueMonthSet}
        initialFilters={initialFilters}
      >
        <ArchiveFilterRibbon />
        <Container>
          <BlogArchiveUI />
        </Container>
      </BlogFilterProvider>
    </QueryProvider>
  );
}
