import type { Config } from "@/src/payload-types";

import configPromise from "@payload-config";
import { getPayload, type TypedLocale } from "payload";
import { unstable_cache } from "next/cache";

type Global = keyof Config["globals"];

async function getGlobal(
  slug: Global,
  depth = 0,
  locale?: TypedLocale,
) {
  const payload = await getPayload({ config: configPromise });

  const global = await payload.findGlobal({
    slug,
    depth,
    locale,
    fallbackLocale: "en",
  });

  return global;
}

/**
 * Returns a cached global reader scoped by slug and locale.
 */
export const getCachedGlobal = (
  slug: Global,
  depth = 0,
  locale?: TypedLocale,
) => {
  const localeKey = locale ?? "default";

  return unstable_cache(
    async () => getGlobal(slug, depth, locale),
    ["global-v3", slug, localeKey, String(depth)],
    {
      tags: [`global_${slug}`, `global_${slug}_${localeKey}`],
    },
  );
};
