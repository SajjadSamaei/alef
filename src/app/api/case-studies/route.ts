import { getPayload } from "payload";
import configPromise from "@payload-config";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  try {
    const payload = await getPayload({ config: configPromise });
    const data = await payload.find({
      collection: "case-studies",
      locale: locale as any,
      limit: 3,
      sort: "-publishedAt",
      select: {
        title: true,
        slug: true,
      },
    });

    // Cache this API response for 1 hour (3600s)
    return NextResponse.json(data.docs, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
