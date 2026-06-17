import { MetadataRoute } from "next";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import localization from "@/src/i18n/localization";
import {
  getYearFromTimestamp,
  getMonthFromTimestamp,
  getPersianYearFromGregorian,
  getPersianMonthNumberFromGregorian,
} from "@/payload/utilities/helpers/date-utils";
import { cacheTag, cacheLife } from "next/cache"; // Next.js 16 Caching

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Enable Next.js 16 Caching
  "use cache";

  // 2. Assign a tag for on-demand revalidation
  // You can call revalidateTag("sitemap") in your Payload hooks to refresh this.
  cacheTag("sitemap");

  // 3. Set cache lifetime profile (e.g., 'hours', 'days', 'weeks')
  cacheLife("days");

  const payload = await getPayload({ config: configPromise });
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://alef-office.ir";

  const sitemap: MetadataRoute.Sitemap = [];

  // Loop through ALL locales
  for (const localeRecord of localization.locales) {
    const locale = localeRecord.code;

    // --- 1. Homepage (Manual Entry) ---
    // Always good to ensure the root locale path exists
    sitemap.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    });

    // --- 2. Static Pages (From 'static-pages' Collection) ---
    // These handle /about, /contact, /services, etc.
    const staticPages = await payload.find({
      collection: "static-pages",
      locale: locale as any,
      depth: 0,
      limit: 1000,
      pagination: false,
      select: { path: true, slug: true, updatedAt: true },
    });

    staticPages.docs.forEach((doc) => {
      // Use 'path' if defined (e.g. '/contact'), otherwise 'slug'
      let route = doc.path || doc.slug;

      // Skip if it's explicitly set to "/" or "home" since we added the root manually above
      if (route === "/" || route === "home") return;

      if (route) {
        // Ensure no double slashes
        if (route.startsWith("/")) route = route.substring(1);

        sitemap.push({
          url: `${baseUrl}/${locale}/${route}`,
          lastModified: new Date(doc.updatedAt),
          changeFrequency: "yearly",
          priority: 0.9, // High priority for core pages
        });
      }
    });

    // --- 4. Case Studies -> /case-studies/[slug] ---
    const caseStudies = await payload.find({
      collection: "case-studies", // Your Case Studies Collection
      locale: locale as any,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: { _status: { equals: "published" } },
      select: { slug: true, updatedAt: true },
    });

    caseStudies.docs.forEach((doc) => {
      if (doc.slug) {
        sitemap.push({
          url: `${baseUrl}/${locale}/case-studies/${doc.slug}`,
          lastModified: new Date(doc.updatedAt),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    });

    // --- 5. Team -> /team/[slug] ---
    const team = await payload.find({
      collection: "team",
      locale: locale as any,
      depth: 0,
      limit: 1000,
      pagination: false,
      select: { slug: true, updatedAt: true },
    });

    team.docs.forEach((doc) => {
      if (doc.slug) {
        sitemap.push({
          url: `${baseUrl}/${locale}/team/${doc.slug}`,
          lastModified: new Date(doc.updatedAt),
          changeFrequency: "yearly",
          priority: 0.6,
        });
      }
    });

    // --- 6. Blog Posts & Archives -> /blog/[slug] ---
    const posts = await payload.find({
      collection: "posts",
      locale: locale as any,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: { _status: { equals: "published" } },
      select: { slug: true, updatedAt: true, publishedAt: true },
    });

    // A. Individual Posts
    posts.docs.forEach((doc) => {
      if (doc.slug) {
        sitemap.push({
          url: `${baseUrl}/${locale}/blog/${doc.slug}`,
          lastModified: new Date(doc.updatedAt),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    });

    // B. Generated Archive Paths (Categories, Years, Months)
    // Only generate these if we actually have posts
    if (posts.docs.length > 0) {
      const archiveBase = `${baseUrl}/${locale}/blog/archive`;

      // Add Root Archive Page
      sitemap.push({
        url: archiveBase,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });

      const uniqueYears = new Set<string>();
      const uniqueMonths = new Set<string>(); // "YYYY/MM"

      posts.docs.forEach((post) => {
        if (!post.publishedAt) return;
        const date = new Date(post.publishedAt);
        let y, m;

        if (locale === "fa") {
          y = getPersianYearFromGregorian(date);
          m = getPersianMonthNumberFromGregorian(date);
        } else {
          y = getYearFromTimestamp(date);
          m = getMonthFromTimestamp(date);
        }
        uniqueYears.add(y);
        uniqueMonths.add(`${y}/${m}`);
      });

      // Year Archives
      uniqueYears.forEach((year) => {
        sitemap.push({
          url: `${archiveBase}/${year}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      });

      // Month Archives
      uniqueMonths.forEach((yearMonth) => {
        sitemap.push({
          url: `${archiveBase}/${yearMonth}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      });

      // Category Archives
      const categories = await payload.find({
        collection: "blog-categories",
        locale: locale as any,
        depth: 0,
        limit: 1000,
        select: { slug: true },
      });

      categories.docs.forEach((cat) => {
        if (cat.slug) {
          sitemap.push({
            url: `${archiveBase}/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      });
    }
  }

  return sitemap;
}
