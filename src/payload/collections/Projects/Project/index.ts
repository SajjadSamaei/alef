import { authenticated } from "@/payload/access/authenticated";
import { anyone } from "@/payload/access/anyone";
import { slugField } from "@/payload/fields/slug";

import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig<"projects"> = {
  slug: "projects",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ["title", "slug", "year"],
    group: "Projects",
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "subtitle",
      type: "text",
      localized: true,
    },
    {
      name: "year",
      type: "number",
      required: true,
      localized: true,
    },
    {
      name: "summary",
      type: "array",
      label: "Project Summary",
      localized: true,
      admin: {
        description:
          "Add multiple paragraphs for the project summary on the list view.",
      },
      fields: [
        {
          name: "paragraph",
          type: "textarea", // Textarea allows for longer text blocks
          required: true,
          localized: true,
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "projectStatus",
          type: "select",
          // required: true,
          options: [
            { label: "Concept", value: "concept" },
            { label: "In Progress", value: "in_progress" },
            { label: "Completed", value: "completed" },
          ],
          admin: {
            width: "50%",
          },
        },

        {
          name: "projectType",
          label: "Project Type",
          type: "relationship",
          admin: {
            position: "sidebar",
          },
          hasMany: true,
          relationTo: "project-type",
        },
        {
          name: "services",
          type: "array",
          localized: true,
          label: "Services",
          admin: { width: "50%" },
          fields: [
            {
              name: "service",
              localized: true,
              type: "text",
            },
          ],
        },
      ],
    },

    {
      name: "featuredImage",
      label: "Featured Image",
      type: "upload",
      relationTo: "project-media",
    },
    {
      name: "clientLogo",
      type: "upload",
      relationTo: "project-media",
      admin: {
        position: "sidebar",
        description:
          "Logo to overlay on the project image (white version recommended).",
      },
    },
    {
      name: "team",
      type: "relationship",
      admin: {
        position: "sidebar",
      },
      hasMany: true,
      relationTo: "team",
    },
    {
      name: "keyMetrics",
      label: "Key Metrics",
      localized: true,
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "yearAppointment",
              label: "Year Appointment",
              localized: true,
              type: "number",
              admin: { width: "50%" },
            },
            {
              name: "yearCompleted",
              label: "Year Completed",
              localized: true,
              type: "number",
              admin: { width: "50%" },
            },
            {
              name: "projectArea",
              label: "Project Area (sqm)",
              type: "number",
              admin: { width: "50%" },
            },
          ],
        },
      ],
    },

    {
      name: "location",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "city",
              type: "text",
              localized: true,
              required: true,
              admin: { width: "50%" },
            },
            {
              name: "province",
              type: "text",
              localized: true,

              admin: { width: "50%" },
            },
            {
              name: "country",
              type: "text",
              required: true,
              localized: true,
              admin: { width: "50%" },
            },
            {
              name: "district",
              localized: true,
              type: "text",

              admin: { width: "50%" },
            },
            {
              name: "latitude",
              type: "text",

              admin: { width: "50%" },
            },
            {
              name: "longitude",
              type: "text",

              admin: { width: "50%" },
            },
          ],
        },
      ],
    },

    // --- Fields below this point will appear in the sidebar ---
    ...slugField(),
  ],
};
