import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { TypedLocale } from "payload";

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  // Default to 'en' if no locale is provided
  const targetLocale = (searchParams.get("locale") as TypedLocale) || "en";

  if (!query) {
    return NextResponse.json({ docs: [] });
  }

  try {
    // --- STEP 1: Define Search Logic (Blog Specific Fields) ---
    const searchWhere: any = {
      and: [
        { _status: { equals: "published" } },
        {
          or: [
            // Search in Title
            { title: { like: query } },
            // Search in Subtitle
            { subtitle: { like: query } },
            // Search in Meta Description
            { "meta.description": { like: query } },
            // Search in Category titles
            { "categories.title": { like: query } },
            // Search in Keywords array
            { "keywords.keyword": { like: query } },
          ],
        },
      ],
    };

    // --- STEP 2: Run Parallel Searches (English + Target Locale) ---
    const searchPromises = [
      payload.find({
        collection: "posts",
        locale: "en", // Always search English index
        depth: 0, // Speed optimization: IDs only
        limit: 5,
        where: searchWhere,
      }),
    ];

    if (targetLocale !== "en") {
      searchPromises.push(
        payload.find({
          collection: "posts",
          locale: targetLocale, // Search user's current language index too
          depth: 0,
          limit: 5,
          where: searchWhere,
        }),
      );
    }

    const [enResults, localeResults] = await Promise.all(searchPromises);

    // --- STEP 3: Deduplicate IDs ---
    const allDocs = [
      ...(enResults?.docs || []),
      ...(localeResults?.docs || []),
    ];
    // Create a Set of unique IDs to remove duplicates found in both languages
    const uniqueIds = Array.from(new Set(allDocs.map((doc) => doc.id)));

    if (uniqueIds.length === 0) {
      return NextResponse.json({ docs: [] });
    }

    // --- STEP 4: Fetch Final Rich Data ---
    // Fetch the full data (images, etc.) in the USER'S requested locale
    const finalResults = await payload.find({
      collection: "posts",
      locale: targetLocale,
      depth: 1, // Populate images and categories
      where: {
        id: { in: uniqueIds },
      },
    });

    // --- STEP 5: Format for Frontend ---
    const formattedResults = finalResults.docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      heroImage: doc.heroImage,
      doc: {
        relationTo: "posts",
      },
    }));

    return NextResponse.json({ docs: formattedResults });
  } catch (error) {
    console.error("Blog Search API Error:", error);
    return NextResponse.json({ docs: [] }, { status: 500 });
  }
}
