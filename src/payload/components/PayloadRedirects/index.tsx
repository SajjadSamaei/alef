// src/utilities/PayloadRedirects.tsx
import type React from "react";
// 1. Import all the types you might redirect to
import type { Page, Post } from "@/src/payload-types";
import { getCachedRedirects } from "@/payload/utilities/getRedirects";
import { notFound, redirect } from "next/navigation";
// 2. Import your i18n config to get the default locale
import localization from "@/src/i18n/localization";

interface Props {
  disableNotFound?: boolean;
  pathname: string; // e.g., /fa/old-page
  locale: string; // e.g., 'fa'
}

/**
 * Defines the URL prefix for each collection.
 * An empty string means no prefix (e.g., for 'pages').
 */
const collectionPrefixes: Record<string, string> = {
  pages: "",
  posts: "/blog", // Use /blog prefix for 'posts'
  products: "/products",
};

const defaultLocale = localization.defaultLocale || "fa";

/**
 * This is an async Server Component used to handle redirects from Payload.
 * It should be used in your 'not-found.tsx' file or a root layout.
 *
 * It assumes `getCachedRedirects` fetches redirects with `depth: 1`
 * so that `redirectItem.to.reference.value` is a populated document.
 */
export const PayloadRedirects: React.FC<Props> = async ({
  disableNotFound,
  pathname,
  locale,
}) => {
  const redirects = await getCachedRedirects()();

  // 1. Try to find a redirect matching the full pathname (e.g., /fa/old-page)
  let redirectItem = redirects.find((r) => r.from === pathname);

  // 2. If not found, try to find a redirect matching the path *without* the locale prefix
  // (e.g., /old-page), but only if we're not on the default locale.
  if (!redirectItem && locale !== defaultLocale) {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");
    redirectItem = redirects.find((r) => r.from === pathWithoutLocale);
  }

  if (redirectItem) {
    // --- Handle External Redirect ---
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url);
    }

    // --- Handle Internal Redirect ---
    let redirectUrl: string | null = null;
    const reference = redirectItem.to?.reference;

    // Check if the reference is populated (depth: 1)
    if (
      reference &&
      typeof reference.value === "object" &&
      reference.value?.slug
    ) {
      const collection = reference.relationTo;
      const slug = reference.value.slug;

      // 3. Get the collection prefix (e.g., /blog) from our map
      const prefix = collectionPrefixes[collection];

      if (prefix !== undefined) {
        // 4. Construct the new, localized URL
        const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
        redirectUrl = `${localePrefix}${prefix}/${slug}`;
      } else {
        // Log an error if a redirect is set for an unknown collection
        console.warn(
          `PayloadRedirects: No URL prefix found for collection "${collection}".`,
        );
      }
    }

    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }

  // No redirect was found
  if (disableNotFound) return null;

  // If we're not disabling it, trigger a 404 page
  notFound();
};
