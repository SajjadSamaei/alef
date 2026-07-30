import type { Block } from "payload";

export const BlogCarousel: Block = {
  slug: "carousel-blog", // The slug for the block
  fields: [
    {
      name: "title",
      type: "text",

      label: "Title (Optional)",
    },
    {
      name: "images",
      type: "array",
      label: "Images Slides",
      minRows: 0,
      maxRows: 10,

      fields: [
        {
          name: "slideImages",
          type: "upload",
          relationTo: "blog-media", // Assuming your media collection is named 'blog-media'
        },
        {
          name: "caption",
          type: "text",
          localized: true,
          label: "Image Caption",
        },
      ],
    },
  ],
  interfaceName: "BlogCarouselBlock",
  labels: {
    plural: "BlogCarousels",
    singular: "BlogCarousel",
  },
};
