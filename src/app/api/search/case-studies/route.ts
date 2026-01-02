import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getLocale } from "next-intl/server";

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  // Detect locale to search in the correct language
  const localeParam = searchParams.get("locale");
  const cookieLocale = await getLocale();
  const locale = (localeParam || cookieLocale || "en") as "en" | "fa";

  if (!query) {
    return NextResponse.json({ docs: [] });
  }

  try {
    const results = await payload.find({
      collection: "case-studies",
      locale, // Search in the user's current language
      depth: 2,
      limit: 5, // Keep it snappy, only return top 5 matches
      where: {
        and: [
          { _status: { equals: "published" } },
          {
            or: [
              // Search in Title
              { title: { like: query } },
              // Search in Subtitle/Meta description
              { subtitle: { like: query } },
              { "meta.description": { like: query } },
              // Optional: Search in Category titles
              { "categories.title": { like: query } },
              // Optional: Search in Keywords array
              { "keywords.keyword": { like: query } },
            ],
          },
        ],
      },
    });

    // Map Payload format to your SearchResultItem interface
    const formattedResults = results.docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      slug: doc.slug,
      heroImage: doc.featuredImage,
      doc: {
        relationTo: "case-studies", // Useful if you later search multiple collections
      },
    }));

    return NextResponse.json({ docs: formattedResults });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ docs: [] }, { status: 500 });
  }
}
