import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

import { revalidatePath, revalidateTag } from "next/cache";

import type { Config, Post } from "@/src/payload-types";

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, locale },
}) => {
  if (!locale && payload.config.localization) {
    locale = payload.config.localization.defaultLocale as Config["locale"];
  }

  if (doc._status === "published") {
    const path = `/${locale}/blog/${doc.slug}`;

    payload.logger.info(`Revalidating post at path: ${path}`);

    revalidatePath(path);
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc._status === "published" && doc._status !== "published") {
    const oldPath = `/${locale}/blog/${previousDoc.slug}`;

    payload.logger.info(`Revalidating old post at path: ${oldPath}`);

    revalidatePath(oldPath);
    revalidateTag("posts-sitemap", "max");
    payload.logger.info(`Revalidating reports cache`);
    revalidateTag("reports", "max");

    if (locale) {
       revalidateTag(`reports-${locale}`, "max");
    }
  }

  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { context, payload, locale },
}) => {
  if (!locale && payload.config.localization) {
    locale = payload.config.localization.defaultLocale as Config["locale"];
  }
  if (!context.disableRevalidate) {
    const path = `/${locale}/blog/${doc?.slug}`;

    revalidatePath(path);
    revalidateTag("posts-sitemap", "max");
  }

  return doc;
};
