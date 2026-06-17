import { GlobalConfig } from "payload";
import { revalidateGlobal } from "./revalidateGlobal";

const serviceFields = () => [
  { name: "title", type: "text" as const, localized: true },
  { name: "subtitle", type: "text" as const, localized: true },
  { name: "description", type: "textarea" as const, localized: true },
  { name: "quote", type: "textarea" as const, localized: true },
  { name: "detailsTitle", type: "text" as const, localized: true },
  {
    name: "tags",
    type: "array" as const,
    localized: true,
    fields: [{ name: "label", type: "text" as const }],
  },
  { name: "image", type: "upload" as const, relationTo: "media" as const },
];

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  hooks: {
    afterChange: [revalidateGlobal("services-page")],
  },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
      ],
    },
    {
      name: "architecture",
      type: "group",
      fields: serviceFields(),
    },
    {
      name: "interior",
      type: "group",
      fields: serviceFields(),
    },
    {
      name: "urban",
      type: "group",
      fields: serviceFields(),
    },
    {
      name: "supervision",
      type: "group",
      fields: serviceFields(),
    },
    {
      name: "restoration",
      type: "group",
      fields: serviceFields(),
    },
    {
      name: "process",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", localized: true },
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
        { name: "buttonLabel", type: "text", localized: true },
      ],
    },
  ],
};
