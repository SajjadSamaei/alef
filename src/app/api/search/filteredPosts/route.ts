// app/api/blog-posts/route.ts

import { getPayload } from "payload";
import { NextRequest, NextResponse } from "next/server";
import configPromise from "@payload-config";

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });
  const params = req.nextUrl.searchParams;

  const page = parseInt(params.get("page") || "1");
  const limit = parseInt(params.get("limit") || "12");
  const sort = params.get("sort") || "-publishedAt";

  const where: any = { and: [] };
  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  // Free-text search filter
  const searchTerm = params.get("q");
  if (searchTerm) {
    where.and.push({
      or: [
        { title: { like: searchTerm } },
        { subtitle: { like: searchTerm } },
        { keywords: { like: searchTerm } },
        { tags: { like: searchTerm } },
        { categories: { like: searchTerm } },
        { authors: { like: searchTerm } },
      ],
    });
  }

  // Categories filter (for single category selection)
  const category = params.get("category");
  if (category && category !== "all") {
    where.and.push({ "categories.title": { equals: category } });
  }

  // Authors filter (for single author selection)
  const author = params.get("author");
  if (author && author !== "all") {
    where.and.push({ "authors.name": { equals: author } });
  }

  // Published year filter
  const year = params.get("year");
  const month = params.get("month");

  if (year && year !== "همه") {
    const startYear = parseInt(year);
    let startMonth = 0;
    let endMonth = 11;

    if (month && month !== "همه") {
      startMonth = persianMonths.indexOf(month);
      endMonth = startMonth;
    }

    // Construct the date range
    const startOfPeriod = new Date(startYear, startMonth, 1).toISOString();
    const endOfPeriod = new Date(
      startYear,
      endMonth + 1,
      0,
      23,
      59,
      59,
      999,
    ).toISOString();

    where.and.push({
      publishedAt: {
        greater_than_equal: startOfPeriod,
        less_than_equal: endOfPeriod,
      },
    });
  }

  try {
    const posts = await payload.find({
      collection: "posts",
      where: where.and.length > 0 ? where : {},
      limit: limit,
      page: page,
      sort: sort,
      depth: 1,
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
