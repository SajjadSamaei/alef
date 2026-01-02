import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";
import { revalidatePath, revalidateTag } from "next/cache";
import type { CaseStudy, Config } from "@/src/payload-types";

export const revalidateProject: CollectionAfterChangeHook<CaseStudy> = ({
  doc,
  previousDoc,
  req: { payload, context, locale }, // 1. Destructure 'locale' from request
}) => {
  // 2. Handle fallback if locale is missing (e.g. API calls)
  let targetLocale = locale;
  if (!targetLocale && payload.config.localization) {
    targetLocale = payload.config.localization.defaultLocale as any;
  }

  if (!context.disableRevalidate) {
    if (doc._status === "published") {
      // 3. Construct path using the variable, not the hook
      // Note: Ensure you have a leading slash '/'
      const path = `/${targetLocale}/projects/${doc.slug}`;

      payload.logger.info(`Revalidating project at path: ${path}`);

      revalidatePath(path);
      revalidateTag("projects-sitemap", "max"); // revalidateTag only takes one argument
    }

    // If the post was previously published, revalidate the old path
    if (previousDoc._status === "published" && doc._status !== "published") {
      const oldPath = `/${targetLocale}/projects/${previousDoc.slug}`;

      payload.logger.info(`Revalidating old project at path: ${oldPath}`);

      revalidatePath(oldPath);
      revalidateTag("projects-sitemap", "max");
    }
  }
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<CaseStudy> = ({
  doc,
  req: { payload, context, locale }, // 1. Destructure 'locale'
}) => {
  let targetLocale = locale;
  if (!targetLocale && payload.config.localization) {
    targetLocale = payload.config.localization.defaultLocale as any;
  }

  if (!context.disableRevalidate) {
    const path = `/${targetLocale}/projects/${doc?.slug}`;

    revalidatePath(path);
    revalidateTag("projects-sitemap", "max");
  }

  return doc;
};
