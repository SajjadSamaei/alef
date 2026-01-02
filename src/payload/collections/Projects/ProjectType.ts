import type { CollectionConfig } from "payload";
import { publicAccess } from "@/payload/access/publicAccess";
import { adminOnly } from "@/payload/access/adminOnly";
import { slugField } from "@/payload/fields/slug";

export const ProjectType: CollectionConfig = {
  slug: "project-type",
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicAccess,
    update: adminOnly,
  },
  admin: {
    useAsTitle: "title",
    group: "Projects",
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    ...slugField(),
  ],
};
