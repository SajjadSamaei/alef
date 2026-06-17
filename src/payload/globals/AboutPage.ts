import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "./revalidateGlobal";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About Page",
  admin: {
    group: "محتوای صفحات",
    description: "تصویر و محتوای اصلی صفحه درباره دفتر",
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateGlobal("about-page")],
  },
  fields: [
    {
      name: "studioImage",
      label: "Studio / Design Process Image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description:
          "A wide image that represents the office, collaboration, and design process.",
      },
    },
    {
      name: "imageCaption",
      label: "Image Caption",
      type: "text",
      localized: true,
    },
  ],
};
