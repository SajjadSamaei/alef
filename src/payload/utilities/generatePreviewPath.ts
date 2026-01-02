import { CollectionSlug } from "payload";

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  // 1. FIX: Map 'posts' to '/blog' so the final URL is correct
  posts: "/blog",
  pages: "",
};

type Props = {
  collection: keyof typeof collectionPrefixMap;
  slug: string;
  locale: string;
};

export const generatePreviewPath = ({ collection, slug, locale }: Props) => {
  if (!slug) {
    return null;
  }

  // 2. FIX: Construct the final destination path (e.g. /en/blog/my-post)
  const prefix = collectionPrefixMap[collection];
  const targetPath = `${prefix}/${slug}`;

  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: targetPath, // This is where Next.js will redirect to
    previewSecret: process.env.PREVIEW_SECRET || "",
  });

  // 3. FIX: Return the Handler URL, not just the params
  // Payload loads this URL -> Next.js sets cookies -> Redirects to targetPath
  // return `/next/preview?${encodedParams.toString()}`;
  return targetPath;
};
