import { NextRequest, NextResponse } from "next/server";
import { getPayload, type Where } from "payload";
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

    const searchWhere: Where = {
      or: [
        { title: { like: query } },
        { description: { like: query } },
        { keywords: { like: query } },
        { slug: { like: query } },
      ],
    };
    const locales = [locale, locale === "fa" ? "en" : "fa"] as const;
    const localeResults = await Promise.all(
      locales.map((searchLocale) =>
        payload.find({
          collection: "search",
          depth: 1,
          limit: 10,
          locale: searchLocale,
          fallbackLocale: false,
          where: searchWhere,
        }),
      ),
    );
    const searchResults = localeResults
      .flatMap((result) => result.docs)
      .filter(
        (doc, index, docs) =>
          docs.findIndex(
            (candidate) =>
              candidate.doc?.relationTo === doc.doc?.relationTo &&
              (typeof candidate.doc?.value === "object"
                ? candidate.doc.value?.id
                : candidate.doc?.value) ===
                (typeof doc.doc?.value === "object"
                  ? doc.doc.value?.id
                  : doc.doc?.value),
          ) === index,
      )
      .slice(0, 10);

    const formattedResults = searchResults.map((doc: any) => {
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
