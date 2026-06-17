import { getClientSideURL } from "@/payload/utilities/getURL";

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (
  url: string | null | undefined,
  cacheTag?: string | null,
): string => {
  if (!url) return "";

  const normalizedUrl = url
    .replace(
      /^https:\/\/storage\.c2\.liara\.(?:site|space)\/chegall\//,
      "https://storage.alef-office.ir/",
    )
    .replace(
      /^https:\/\/storage\.alef-office\.ir\/chegall\//,
      "https://storage.alef-office.ir/",
    );

  // Check if URL already has http/https protocol
  if (
    normalizedUrl.startsWith("http://") ||
    normalizedUrl.startsWith("https://")
  ) {
    return cacheTag ? `${normalizedUrl}?${cacheTag}` : normalizedUrl;
  }

  // Otherwise prepend client-side URL
  const baseUrl = getClientSideURL();
  return cacheTag
    ? `${baseUrl}${normalizedUrl}?${cacheTag}`
    : `${baseUrl}${normalizedUrl}`;
};
