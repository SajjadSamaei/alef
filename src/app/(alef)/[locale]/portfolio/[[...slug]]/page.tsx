import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioUI } from "@/components/Portfolio/UI/Archive/PortfolioUI";
// --- PAYLOAD & LOGIC IMPORTS ---
import { getPayload, PaginatedDocs, TypedLocale } from "payload";
import configPromise from "@payload-config";
import { getTranslations } from "next-intl/server";
import localization from "@/src/i18n/localization";
import type { CaseStudy, CaseStudyType, Team } from "@/src/payload-types";
import {
  getMonthFromTimestamp,
  getPersianMonthNumberFromGregorian,
  getPersianYearFromGregorian,
  getYearFromTimestamp,
  getGregorianDateRangeFromPersian,
} from "@/payload/utilities/helpers/date-utils";
import QueryProvider from "@/payload/utilities/stores/QueryProvider";

// --- UI COMPONENT IMPORTS ---
import {
  Container,
  ContainerCard,
} from "@/components/chegall/studio/Container"; // Using Studio container to match Hero style
import { PortfolioFilterProvider } from "@/components/Portfolio/UI/Archive/Filters/FilterProvider";
import { PortfolioFilterRibbon } from "@/components/Portfolio/UI/Archive/Filters/filter-ribbon";

// --- TYPES ---
type PostWithLocale = CaseStudy & { locale?: TypedLocale };

type Args = {
  params: Promise<{
    slug?: string[];
    locale: TypedLocale;
  }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
};

// --- 1. GENERATE STATIC PARAMS (Logic from Source B) ---
//
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const allParams = new Set<string>();
  const locales = localization.locales.map((l) => l.code);

  const { docs: allCategories } = await payload.find({
    collection: "case-study-type",
    depth: 0,
    limit: 1000,
    select: { slug: true },
  });

  const { docs: allPostDates } = await payload.find({
    collection: "case-studies",
    depth: 0,
    limit: 10000,
    select: { publishedAt: true },
    where: { _status: { equals: "published" } },
  });

  const uniqueDates = {
    en: { years: new Set<string>(), months: new Set<string>() },
    fa: { years: new Set<string>(), months: new Set<string>() },
  };

  allPostDates.forEach((post) => {
    if (!post.publishedAt) return;
    const date = new Date(post.publishedAt);
    uniqueDates.en.years.add(getYearFromTimestamp(date));
    uniqueDates.en.months.add(getMonthFromTimestamp(date));
    uniqueDates.fa.years.add(getPersianYearFromGregorian(date));
    uniqueDates.fa.months.add(getPersianMonthNumberFromGregorian(date));
  });

  locales.forEach((locale: string) => {
    const { years, months } = locale === "fa" ? uniqueDates.fa : uniqueDates.en;
    const categorySlugs = allCategories.map((c) => c.slug).filter(Boolean);

    allParams.add(`${locale}|`);

    categorySlugs.forEach((slug) => allParams.add(`${locale}|${slug}`));
    years.forEach((year) => allParams.add(`${locale}|${year}`));

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
    categorySlugs.forEach((slug) => {
      years.forEach((year) => {
        months.forEach((month) => {
          allParams.add(`${locale}|${slug}/${year}/${month}`);
        });
      });
    });
  });

  return Array.from(allParams).map((pathWithLocale) => {
    const [locale, path] = pathWithLocale.split("|");
    return {
      locale: locale,
      slug: path === "" ? undefined : path.split("/"),
    };
  });
}

//
// --- 2. GENERATE METADATA (Logic from Source B) ---
//
export async function generateMetadata({
  params,
  searchParams,
}: Args): Promise<Metadata> {
  const { slug, locale } = await params;
  const { q } = await searchParams;

  // Metadata specific translations
  const t = await getTranslations({
    locale,
    namespace: "Metadata.BlogArchive",
  });
  const tCaseStudy = await getTranslations({
    locale,
    namespace: "Metadata.PortfolioCaseStudies",
  });
  const tMonths = await getTranslations({ locale, namespace: "Months" });

  const payload = await getPayload({ config: configPromise });
  const fallbackLocale = localization.defaultLocale || "en";

  let categorySlug: string | null = null;
  let year: string | null = null;
  let month: string | null = null;

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
      collection: "case-study-type",
      where: { slug: { equals: categorySlug } },
      limit: 1,
      locale: locale,
      fallbackLocale: fallbackLocale as TypedLocale,
    });
    if (categoryDoc.docs.length > 0) {
      categoryTitle = categoryDoc.docs[0].title;
    }
  }

  let title = tCaseStudy("title");
  let description = tCaseStudy("description");
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
    const monthName = tMonths(month);
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
    openGraph: {
      title: title,
      description: description,
      type: "website",
    },
  };
}

//
// --- 3. MAIN PAGE COMPONENT ---
//
export default async function PortfolioPage(props: Args) {
  const payload = await getPayload({ config: configPromise });
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { slug, locale } = await params;
  const { q, page } = searchParams;
  const pageNumber = parseInt((page as string) || "1");

  // Fetch Page Translations for the UI (Hero, Titles)
  const tPage = await getTranslations("PortfolioPage");

  const fallbackLocale = (localization.defaultLocale || "en") as TypedLocale;

  // --- Filter Logic ---
  let categorySlug: string | null = null;
  let year: string | null = null;
  let month: string | null = null;
  let projectStatus: string | null = null;
  let author: string | null = null;

  if (slug) {
    slug.forEach((segment) => {
      if (/^\d{4}$/.test(segment)) year = segment;
      else if (/^\d{1,2}$/.test(segment)) month = segment.padStart(2, "0");
      else categorySlug = segment;
    });
  }

  // --- Fetch Filter Options ---
  const allCategories = await payload.find({
    collection: "case-study-type",
    depth: 0,
    limit: 1000,
    locale: locale,
    fallbackLocale: fallbackLocale,
    select: { title: true, slug: true },
  });
  const allAuthors = await payload.find({
    collection: "team",
    depth: 0,
    locale: locale,
    fallbackLocale: fallbackLocale,
    limit: 1000,
    select: { name: true },
  });
  const allPostDates = await payload.find({
    collection: "case-studies",
    depth: 0,
    limit: 10000,
    locale: locale,
    fallbackLocale: fallbackLocale,
    select: { publishedAt: true },
    where: { _status: { equals: "published" } },
  });

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
    where.and.push({ "projectType.slug": { equals: categorySlug } });
  }

  if (q) {
    where.and.push({
      or: [{ title: { like: q } }, { subtitle: { like: q } }],
    });
  }

  // Date Filtering
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
      const end = new Date(y, m + 1, 0);
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
    collection: "case-studies", // Using logic from Source B
    depth: 1,
    limit: 10,
    page: pageNumber,
    where: where.and.length > 1 ? where : { _status: { equals: "published" } },
    locale: locale,
    fallbackLocale: fallbackLocale,
  })) as PaginatedDocs<PostWithLocale>;

  if (initialPosts.docs.length === 0 && pageNumber > 1) {
    notFound();
  }

  const initialFilters = {
    category: categorySlug || "all",
    year: year || "all",
    month: month || "all",
    projectStatus: projectStatus || "all",
    author: author || "all",
  };

  return (
    <QueryProvider>
      <PortfolioFilterProvider
        initialPosts={initialPosts}
        uniqueCategories={allCategories.docs as CaseStudyType[]}
        uniqueAuthors={allAuthors.docs as Team[]}
        uniqueYears={uniqueYearSet}
        uniqueMonths={uniqueMonthSet}
        initialFilters={initialFilters}
      >
        <PortfolioFilterRibbon />
        <ContainerCard>
          <PortfolioUI />
        </ContainerCard>
      </PortfolioFilterProvider>
    </QueryProvider>
  );
}
