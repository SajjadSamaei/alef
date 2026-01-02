import type { CollectionConfig } from "payload";
import { slugField } from "@/payload/fields/slug";
import { publicAccess } from "@/payload/access/publicAccess";
import { adminOnly } from "@/payload/access/adminOnly";
export const Tags: CollectionConfig = {
  slug: "tags",

  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "updatedAt"],
    group: "General",
  },
  access: {
    create: adminOnly,
    read: publicAccess,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: "name",
      type: "text",
      localized: true,
      required: true,
      unique: true,
    },
    // The slug is generated automatically from the name
    ...slugField("name"),
  ],
};
