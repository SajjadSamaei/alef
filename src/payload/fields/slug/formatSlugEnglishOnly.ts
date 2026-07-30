// src/payload/fields/slug/formatSlugEnglishOnly.ts

import type { FieldHook } from "payload";

export const formatSlug = (val: string): string =>
  val
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/[^\w\-]+/g, "") // Remove non-word chars (Removes Farsi/Arabic)
    .replace(/\-\-+/g, "-") // Multiple hyphens to single
    .replace(/^-+/, "") // Trim start
    .replace(/-+$/, ""); // Trim end

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data, req }) => {
    // 1. Gatekeeper: If we are NOT in English, DO NOT allow changes to the slug.
    if (req.locale && req.locale !== "en") {
      // Return the existing slug from the database (the English one)
      // If it's a new document and they are creating it in Farsi first,
      // this might return undefined, which is fine (wait for English title).
      return originalDoc?.slug || value;
    }

    // 2. Standard Logic (Only runs for 'en')
    if (typeof value === "string" && value.length > 0) {
      return formatSlug(value);
    }

    const fallbackData = data?.[fallback] || originalDoc?.[fallback];

    if (fallbackData && typeof fallbackData === "string") {
      return formatSlug(fallbackData);
    }

    return value;
  };
