import { GlobalConfig } from "payload";

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: "architecture",
      type: "group",
      fields: [{ name: "image", type: "upload", relationTo: "media" }],
    },
    {
      name: "interior",
      type: "group",
      fields: [{ name: "image", type: "upload", relationTo: "media" }],
    },
    {
      name: "urban",
      type: "group",
      fields: [{ name: "image", type: "upload", relationTo: "media" }],
    },
    {
      name: "supervision",
      type: "group",
      fields: [{ name: "image", type: "upload", relationTo: "media" }],
    },
    {
      name: "restoration",
      type: "group",
      fields: [{ name: "image", type: "upload", relationTo: "media" }],
    },
  ],
};
