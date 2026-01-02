import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getLocale } from "next-intl/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const query = params.get("q");

  // Locale Logic
  const queryLocale = params.get("locale");
  const cookieLocale = await getLocale();
  const locale = (queryLocale || cookieLocale || "en") as "en" | "fa";

  if (!query) {
    return NextResponse.json({ docs: [] });
  }

  try {
    const payload = await getPayload({ config: configPromise });

    const searchResults = await payload.find({
      collection: "search",
      depth: 1, // This populates 'heroImage' AND 'doc' (the original item)
      limit: 10,
      locale,
      where: {
        or: [
          { title: { like: query } },
          { description: { like: query } },
          { keywords: { like: query } },
        ],
      },
    });

    const formattedResults = searchResults.docs.map((doc: any) => {
      // 1. Try to get the image from the Search Index
      let imageToUse = doc.heroImage;

      // 2. If missing/unpopulated, try to grab it from the Original Document
      if (!imageToUse || typeof imageToUse !== "object") {
        const originalDoc = doc.doc?.value; // This is the populated Project/Post

        if (originalDoc) {
          // Check common image field names in your collections
          imageToUse =
            originalDoc.featuredImage ||
            originalDoc.heroImage ||
            originalDoc.profilePicture ||
            originalDoc.coverImage;
        }
      }

      return {
        id: doc.id,
        title: doc.title,
        slug: doc.slug,

        // Return the resolved image object
        heroImage: imageToUse,

        // Pass a backup just in case frontend checks this
        featuredImage: imageToUse,

        type: doc.doc?.relationTo,
      };
    });

    return NextResponse.json({ docs: formattedResults });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "An error occurred during search." },
      { status: 500 },
    );
  }
}
