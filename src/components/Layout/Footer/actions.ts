"use server";

import configPromise from "@payload-config";
import { getPayload, TypedLocale } from "payload";
import { cacheTag, cacheLife } from "next/cache";

export async function getLatestCaseStudies(locale: TypedLocale) {
  "use cache"; // Enable Next.js 15 caching

  cacheTag("case-studies", `case-studies-${locale}`);
  cacheLife("hours"); // Cache for hours

  const payload = await getPayload({ config: configPromise });

  try {
    const results = await payload.find({
      collection: "case-studies",
      locale,
      fallbackLocale: "en",
      depth: 0,
      limit: 3,
      sort: "-publishedAt",
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
      },
    });

    return results.docs;
  } catch (error) {
    console.error("Footer Case Studies API Error:", error);
    return [];
  }
}
