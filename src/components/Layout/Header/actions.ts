"use server";

import configPromise from "@payload-config";
import { getPayload, TypedLocale } from "payload";
import { cacheTag, cacheLife } from "next/cache";

export async function getLatestReports(locale: TypedLocale) {
  "use cache";
  
  cacheTag("reports", `reports-${locale}`);
  cacheLife("hours");
  const payload = await getPayload({ config: configPromise });

  try {
    const results = await payload.find({
      collection: "posts",
      locale,
      fallbackLocale: "en",
      depth: 1,
      limit: 3,
      sort: "-publishedAt",
      overrideAccess: false,
      select: {
        title: true,
        subtitle: true,
        slug: true,
        publishedAt: true,
      },
      where: {
        and: [
          { _status: { equals: "published" } },
          { "categories.slug": { equals: "reports" } },
        ],
      },
    });

    return results.docs; // <— return only the docs array
  } catch (error) {
    console.error("Search API Error:", error);
    return [];
  }
}
