import type { CollectionConfig } from "payload";
import { slugField } from "@/payload/fields/slug"; // Your existing slug field
import { adminOnly } from "@/payload/access/adminOnly"; // Your existing access control
import { publicAccess } from "@/payload/access/publicAccess";

export const StaticPages: CollectionConfig = {
  slug: "static-pages",
  admin: {
    useAsTitle: "title",
    group: "General",
    defaultColumns: ["title", "slug", "updatedAt"],
    description:
      "Manage static pages (About, Contact, etc) for Search and Sitemap.",
  },
  access: {
    read: publicAccess,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
      label: "Page Title",
    },
    {
      name: "path",
      type: "text",
      required: true,
      label: "Full URL Path",
      admin: {
        description:
          "The relative path for this page (e.g., '/about', '/blog/archive'). Used for navigation.",
        placeholder: "/example/path",
      },
    },
    {
      name: "searchSummary",
      type: "textarea",
      localized: true,
      label: "Search Summary / Keywords",
      admin: {
        description:
          "Enter text here to be indexed by the search bar. This won't necessarily show on the page, but allows users to find it.",
      },
    },
    {
      name: "tags",
      type: "relationship",
      admin: {
        position: "sidebar",
      },
      hasMany: true,
      relationTo: "tags",
    },
    // We use the slug to match the Next.js route (e.g. 'about', 'contact')
    ...slugField("title"),
  ],
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 50,
  },
};
