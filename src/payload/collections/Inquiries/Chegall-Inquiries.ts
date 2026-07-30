import type { CollectionConfig } from "payload";

export const AlefInquiries: CollectionConfig = {
  slug: "alef-inquiries", // Make sure this matches the slug used in your Server Action
  admin: {
    group: "Alef",
    useAsTitle: "name",
    defaultColumns: ["type", "name", "email", "createdAt", "read"],
    description:
      "Submissions from the general and architectural project forms.",
  },
  fields: [
    {
      name: "read",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "type",
      type: "radio",
      options: [
        { label: "Architectural Project", value: "project" }, // Updated Label
        { label: "General Inquiry", value: "general" },
      ],
      required: true,
      defaultValue: "project",
      admin: {
        layout: "horizontal",
      },
    },

    // --- Common Fields ---
    {
      type: "row", // Group common fields in a row for cleaner admin UI
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          admin: { width: "50%" },
        },
        {
          name: "email",
          type: "email",
          required: true,
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "phone",
      type: "text",
      required: true,
    },

    // --- General Inquiry Fields ---
    {
      name: "company",
      type: "text",
      admin: {
        condition: (data) => data?.type === "general",
      },
    },
    {
      name: "message",
      type: "textarea",
      admin: {
        condition: (data) => data?.type === "general",
      },
    },
    {
      name: "source",
      type: "select",
      options: [
        "google",
        "social_media",
        "publication",
        "referral",
        "advertisement",
        "other",
      ],
      admin: {
        condition: (data) => data?.type === "general",
      },
    },

    // --- NEW: Architectural Project Fields ---
    {
      name: "projectType",
      type: "select",
      options: [
        "residential",
        "commercial",
        "cultural",
        "hospitality",
        "renovation",
        "masterplan",
      ],
      admin: {
        condition: (data) => data?.type === "project",
        width: "50%",
      },
    },
    {
      type: "row",
      admin: {
        condition: (data) => data?.type === "project",
      },
      fields: [
        {
          name: "location",
          type: "text",
          admin: { width: "50%" },
        },
        {
          name: "area",
          type: "text",
          label: "Approx. Area",
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "services",
      label: "Services Requested",
      type: "group",
      admin: {
        condition: (data) => data?.type === "project",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "architecture",
              type: "checkbox",
              label: "Architecture",
            },
            {
              name: "interior",
              type: "checkbox",
              label: "Interior Design",
            },
            {
              name: "supervision",
              type: "checkbox",
              label: "Construction Supervision",
            },
            {
              name: "consultancy",
              type: "checkbox",
              label: "Consultancy",
            },
          ],
        },
      ],
    },
    {
      name: "project_message",
      label: "Project Details / Message",
      type: "textarea",
      admin: {
        condition: (data) => data?.type === "project",
      },
    },
  ],
};
