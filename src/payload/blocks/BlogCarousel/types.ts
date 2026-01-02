// You must import the type for your 'blog-media' collection
import type { BlogMedia } from "@/src/payload-types";

/**
 * This represents a single item in the 'images' array
 */
export type BlogCarouselImage = {
  /**
   * 'slide-images' is hasMany: true, so it's an array of
   * 'blog-media' IDs (string[]) or populated objects (BlogMedia[]).
   */
  "slide-images": string[] | BlogMedia[];

  /**
   * 'caption' is localized: true, so its raw type is an
   * object with locale keys, e.g., { en: '...', fa: '...' }
   */
  caption?: {
    [key: string]: string;
  } | null;

  id?: string; // Payload array items have an 'id'
};

/**
 * This is the main type for your 'blog-carousel' block
 */
export type BlogCarousel = {
  title?: string | null;
  images?: BlogCarouselImage[] | null; // 'images' is an array of the type above

  // Payload adds these to all blocks
  blockType: "blog-carousel";
  blockName?: string | null;
};
