// src/utilities/formatAuthors.ts
import type { Post } from "@/src/payload-types";

// Get the specific type for a single populated author
type PopulatedAuthor = NonNullable<Post["populatedAuthors"]>[number];

/**
 * Formats an array of authors into a localized list.
 *
 * @param authors - The populatedAuthors array from a Post.
 * @param locale - The current locale (e.g., 'en', 'fa').
 * @returns A localized string, e.g., "John and Jane" or "جان و جین".
 */
export const formatAuthors = (authors: PopulatedAuthor[], locale: string) => {
  // Ensure we don't have any authors without a name
  const authorNames = authors
    .map((author) => author.name)
    .filter(Boolean) as string[];

  if (authorNames.length === 0) return "";

  // Use the built-in Intl.ListFormat to handle conjunctions for any language
  const formatter = new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction", // "and" in English, "و" in Farsi
  });

  return formatter.format(authorNames);
};
