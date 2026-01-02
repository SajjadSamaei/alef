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
    // --- STEP 1: Define Search Logic ---
    const searchWhere: any = {
      and: [
        { _status: { equals: "published" } },
        {
          or: [
            { title: { like: query } },
            { subtitle: { like: query } },
            { projectBrief: { like: query } },
            // Searching inside the keywords array
            { "keywords.keyword": { like: query } },
          ],
        },
      ],
    };

    // --- STEP 2: Run Parallel Searches (English + Target Locale) ---
    const searchPromises = [
      payload.find({
        collection: "case-studies",
        locale: "en", // Always search English index
        depth: 0, // Speed optimization: IDs only
        limit: 5,
        where: searchWhere,
      }),
    ];

    if (targetLocale !== "en") {
      searchPromises.push(
        payload.find({
          collection: "case-studies",
          locale: targetLocale, // Search Farsi index too
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
    const uniqueIds = Array.from(new Set(allDocs.map((doc) => doc.id)));

    if (uniqueIds.length === 0) {
      return NextResponse.json({ docs: [] });
    }

    // --- STEP 4: Fetch Final Rich Data ---
    // Now get the full data (images, etc.) in the USER'S locale
    const finalResults = await payload.find({
      collection: "case-studies",
      locale: targetLocale,
      depth: 1, // Populate images
      where: {
        id: { in: uniqueIds },
      },
    });

    // --- STEP 5: Format for Frontend ---
    const formattedResults = finalResults.docs.map((doc: any) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,

      // Map your specific fields:
      featuredImage: doc.featuredImage, // The image object
      year: doc.yearCompleted, // 'yearCompleted' from config -> 'year' for frontend
      projectStatus: doc.projectStatus, // 'concept', 'built', etc.
    }));

    return NextResponse.json({ docs: formattedResults });
  } catch (error) {
    console.error("Portfolio Search API Error:", error);
    return NextResponse.json({ docs: [] }, { status: 500 });
  }
}
