import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import {
  getGregorianDateRangeFromPersian,
  getPersianMonthNumberFromGregorian,
} from "@/payload/utilities/helpers/date-utils"; // Ensure this path is correct based on your project structure
import { getLocale } from "next-intl/server";

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });
  const params = req.nextUrl.searchParams;

  const page = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "10");
  const sort = params.get("sort") || "-publishedAt";
  const queryLocale = params.get("locale");
  // 2. Fallback to cookie (optional, but good for direct API calls)
  const cookieLocale = await getLocale();

  // 3. Determine final locale
  const locale = (queryLocale || cookieLocale || "en") as "en" | "fa";

  const where: any = { and: [] };
  where.and.push({ _status: { equals: "published" } });

  // --- Search Logic ---
  const q = params.get("q");
  if (q) {
    const orQuery: any[] = [
      { title: { like: q } },
      { subtitle: { like: q } },
      { "authors.name": { like: q } },
    ];
    // Check if the posts have keywords before querying the nested field
    orQuery.push({ "keywords.keyword": { like: q } });

    where.and.push({ or: orQuery });
  }

  // --- Category Logic ---
  const category = params.get("category");
  if (category && category !== "all") {
    where.and.push({ "projectType.slug": { equals: category } });
  }

  // --- Author Logic ---
  const author = params.get("author");
  if (author && author !== "all") {
    where.and.push({ "authors.name": { equals: author } });
  }

  // --- Status Logic ---
  const projectStatus = params.get("projectStatus");
  if (projectStatus && projectStatus !== "all") {
    where.and.push({ "projectStatus.value": { equals: projectStatus } });
  }

  // --- Date Logic ---
  const year = params.get("year");
  const month = params.get("month"); // e.g., "01", "09", "12"

  if (year && year !== "all" && month && month !== "all") {
    // =========================================
    // 1. Filter by Year AND Month
    // =========================================

    if (locale === "fa") {
      // --- PERSIAN LOGIC ---
      // Convert 1402/09 to Gregorian Start/End range
      const { start, end } = getGregorianDateRangeFromPersian(year, month);

      if (start && end) {
        where.and.push({
          publishedAt: {
            greater_than_equal: start.toISOString(),
            less_than: end.toISOString(),
          },
        });
      }
    } else {
      // --- GREGORIAN LOGIC ---
      const y = parseInt(year);
      const m = parseInt(month) - 1; // JS months are 0-indexed

      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 1); // First day of next month

      where.and.push({
        publishedAt: {
          greater_than_equal: start.toISOString(),
          less_than: end.toISOString(),
        },
      });
    }
  } else if (year && year !== "all") {
    // =========================================
    // 2. Filter by Year ONLY
    // =========================================

    if (locale === "fa") {
      // --- PERSIAN LOGIC ---
      // Start of year: 1402/01/01
      const { start: startOfYear } = getGregorianDateRangeFromPersian(
        year,
        "01",
      );
      // Start of NEXT year: 1403/01/01
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
      // --- GREGORIAN LOGIC ---
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
  } else if (month && month !== "all") {
    // =========================================
    // 3. Filter by Month ONLY (Across all years)
    // =========================================
    // This requires fetching all docs and filtering in JS because
    // Payload/Mongo doesn't easily support "Month = X" across different years.

    const allPosts = await payload.find({
      collection: "case-studies",
      where: where.and.length > 0 ? where : {},
      limit: 1000,
      sort: sort,
      depth: 2,
      locale: locale as any, // Ensure we fetch locale-specific data if needed
    });

    const filteredPosts = allPosts.docs.filter((post) => {
      if (!post.publishedAt) return false;
      const publishedDate = new Date(post.publishedAt);

      if (locale === "fa") {
        // --- PERSIAN LOGIC ---
        // Convert the post's Gregorian date to Persian Month (e.g., "09")
        const persianMonth = getPersianMonthNumberFromGregorian(publishedDate);
        return persianMonth === month;
      } else {
        // --- GREGORIAN LOGIC ---
        // Get 0-indexed month, add 1, pad to "01"
        const gregorianMonth = (publishedDate.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        return gregorianMonth === month;
      }
    });

    const paginatedDocs = filteredPosts.slice((page - 1) * limit, page * limit);
    const totalPages = Math.ceil(filteredPosts.length / limit);
    const totalDocs = filteredPosts.length;

    return NextResponse.json({
      docs: paginatedDocs,
      totalDocs: totalDocs,
      limit: limit,
      page: page,
      totalPages: totalPages,
    });
  }

  // --- Final Query Execution (If not handled by "Month Only" block) ---
  try {
    const posts = await payload.find({
      collection: "case-studies",
      where: where.and.length > 0 ? where : {},
      limit: limit,
      page: page,
      sort: sort,
      depth: 2,
      locale: locale as any,
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts." },
      { status: 500 },
    );
  }
}
