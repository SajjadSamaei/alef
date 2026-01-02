import type { FieldHook } from "payload";

/**
 * Creates a slug from a string, preserving both English and Farsi characters.
 */
export const formatSlug = (val: string): string =>
  val
    .toString()
    .toLowerCase() // Lowercase any English characters
    .replace(/\s+/g, "-") // Replace spaces with a single hyphen

    // --- THIS IS THE FIX ---
    // Remove all characters that are NOT:
    //   \w (English letters, numbers, underscore)
    //   - (hyphen)
    //   \p{Script=Arabic} (all characters from the Arabic script, including Farsi)
    // The 'u' flag is for Unicode, 'g' is for global.
    .replace(/[^\w\-\p{Script=Arabic}]+/gu, "")
    // ---

    .replace(/\-\-+/g, "-") // Replace multiple hyphens with one
    .replace(/^-+/, "") // Trim hyphen from start
    .replace(/-+$/, ""); // Trim hyphen from end

/**
 * A field hook to automatically generate a slug from a fallback field.
 */
export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    // If a slug is manually provided, slugify it
    if (typeof value === "string") {
      return formatSlug(value);
    }

    // If creating a new doc or the slug is empty,
    // use the fallback field's data
    if (operation === "create" || !data?.slug) {
      const fallbackData = data?.[fallback]; // Get data from the fallback field (e.g., 'title')

      if (fallbackData && typeof fallbackData === "string") {
        return formatSlug(fallbackData);
      }
    }

    return value;
  };
