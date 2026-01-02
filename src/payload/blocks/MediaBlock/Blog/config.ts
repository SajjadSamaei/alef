import type { Block } from "payload";

export const BlogMediaBlock: Block = {
  slug: "blogMediaBlock",
  interfaceName: "BlogMediaBlock",
  fields: [
    {
      name: "media",
      type: "upload",
      relationTo: "blog-media",
      required: true,
    },
  ],
};
