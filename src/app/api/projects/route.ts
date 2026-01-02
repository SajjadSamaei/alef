// src/app/api/projects/route.ts
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { NextRequest, NextResponse } from "next/server";
import { TypedLocale } from "payload";

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });
  const { searchParams } = new URL(req.url);

  // Extract query parameters
  const locale = (searchParams.get("locale") as TypedLocale) || "en";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const projectType = searchParams.get("projectType");
  const year = searchParams.get("year");
  const projectStatus = searchParams.get("projectStatus");
  const author = searchParams.get("author"); // This assumes filtering by author ID or Name
  const q = searchParams.get("q");

  // Build the 'where' query
  const where: any = {
    and: [
      // If you use drafts, ensure we only show published in API
      // { _status: { equals: "published" } }
    ],
  };

  // 1. Filter by Project Type (Relationship)
  if (projectType && projectType !== "all") {
    where.and.push({
      "projectType.slug": { equals: projectType },
    });
  }

  // 2. Filter by Year (Number)
  if (year && year !== "all") {
    where.and.push({
      year: { equals: parseInt(year) },
    });
  }

  // 3. Filter by Status (Select)
  if (projectStatus && projectStatus !== "all") {
    where.and.push({
      projectStatus: { equals: projectStatus },
    });
  }

  // 4. Filter by Search Query (Title or Subtitle)
  if (q) {
    where.and.push({
      or: [{ title: { like: q } }, { subtitle: { like: q } }],
    });
  }

  // 5. Filter by Author/Team (Relationship)
  // Note: Standard dropdown usually sends the ID or Slug.
  // If your filter sends the ID:
  if (author && author !== "all") {
    where.and.push({
      "team.name": { equals: author }, // Or "team" { equals: authorID }
    });
  }

  try {
    const results = await payload.find({
      collection: "projects",
      where: where.and.length > 0 ? where : {}, // Pass empty object if no filters
      page,
      limit,
      sort: "-year", // Default sort
      locale,
      fallbackLocale: "en",
      depth: 1, // Ensure we get image URLs
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
