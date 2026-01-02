import { CollectionConfig } from "payload";
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { ProjectMediaBlock } from "@/payload/blocks/MediaBlock/Projects/config";
import { ProjectCarousel } from "@/payload/blocks/BlogCarousel/Projects/config";
import { slugField } from "@/payload/fields/slug";
import { z } from "zod";

// --- Validation Logic ---
const optionalUrlSchema = z.union([
  z.literal(""), // Allow empty string
  z.string().url({ message: "Please enter a valid URL (e.g., https://...)" }),
]);

const zodUrlValidator = (value: string | null | undefined) => {
  if (!value) {
    return true; // Valid if empty, null, or undefined
  }
  const result = optionalUrlSchema.safeParse(value);
  return result.success ? true : result.error.issues[0].message;
};

// --- Collection Config ---
export const Team: CollectionConfig = {
  slug: "team",
  admin: {
    group: "Agency", // Grouping under Agency feels more professional
    useAsTitle: "name",
    description: "Manage current staff and alumni architects/designers.",
    defaultColumns: ["name", "role", "employmentStatus", "updatedAt"],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Profile",
          fields: [
            {
              name: "name",
              type: "text",
              label: "Full Name",
              required: true,
              localized: true,
            },
            {
              type: "row",
              fields: [
                {
                  name: "role",
                  type: "text",
                  localized: true,
                  label: "Role / Title",
                  required: true,
                  admin: {
                    width: "50%",
                    description:
                      "e.g. Senior Architect, Interior Designer, Draftsperson",
                  },
                },
                {
                  name: "credentials",
                  type: "text",

                  label: "Accreditations / Credentials",

                  admin: {
                    width: "50%",
                    description: "e.g. AIA, LEED AP, RIBA, OAA",
                  },
                },
              ],
            },
            {
              name: "profilePicture",
              type: "upload",
              relationTo: "team-media",
              required: true,
            },
            {
              name: "bio",
              localized: true,
              type: "textarea", // Changed to textarea for better UI
              label: "Short Biography",
            },
            {
              name: "skills",
              label: "Specializations / Skills",
              type: "array",
              localized: true,
              admin: {
                description:
                  "e.g. 3D Rendering, Sustainable Design, Urban Planning",
              },
              fields: [
                {
                  name: "skill",
                  type: "text",
                  localized: true,
                },
              ],
            },
            {
              name: "details",
              label: "Rich Text Details / Portfolio",
              type: "richText",
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({
                      enabledHeadingSizes: ["h2", "h3", "h4"],
                    }),
                    BlocksFeature({
                      blocks: [ProjectMediaBlock, ProjectCarousel],
                    }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ];
                },
              }),
            },
          ],
        },
        {
          label: "Contact & Socials",
          fields: [
            {
              name: "contactInfo",
              type: "group",
              label: "Contact Information",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "email",
                      type: "email",
                      label: "Email Address",
                      admin: { width: "50%" },
                    },
                    {
                      name: "phone",
                      type: "text",
                      label: "Phone Number",
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "linkedin",
                      label: "LinkedIn",
                      type: "text",
                      validate: zodUrlValidator,
                      admin: { width: "50%" },
                    },
                    {
                      name: "website",
                      label: "Personal Website",
                      type: "text",
                      validate: zodUrlValidator,
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "behance",
                      label: "Behance (Portfolio)",
                      type: "text",
                      validate: zodUrlValidator,
                      admin: { width: "50%" },
                    },
                    {
                      name: "instagram",
                      label: "Instagram",
                      type: "text",
                      validate: zodUrlValidator,
                      admin: { width: "50%" },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    // --- Sidebar / Admin Fields ---
    {
      name: "employmentStatus",
      type: "select",
      label: "Employment Status",
      defaultValue: "active",
      required: true,
      options: [
        { label: "Current Employee", value: "active" },
        { label: "Alumni / Past Employee", value: "alumni" },
      ],
      admin: {
        position: "sidebar",
        description:
          "Set to 'Alumni' to keep them linked to projects but hidden from the main Team page.",
      },
    },
    {
      name: "yearsActive",
      type: "group",
      admin: { position: "sidebar" },
      fields: [
        {
          name: "startDate",
          type: "date",
          label: "Date Joined",
          admin: { date: { pickerAppearance: "monthOnly" } },
        },
        {
          name: "endDate",
          type: "date",
          label: "Date Left",
          admin: {
            date: { pickerAppearance: "monthOnly" },
            condition: (data) => data?.employmentStatus === "alumni",
          },
        },
      ],
    },
    {
      name: "orgRoles",
      type: "select",
      label: "Organizational Level",
      hasMany: true, // Allow multiple roles (e.g., Leadership AND Architect)
      admin: {
        position: "sidebar",
      },
      options: [
        { label: "Leadership / Principal", value: "leadership" },
        { label: "Associate", value: "associate" },
        { label: "Architect / Designer", value: "team" },
        { label: "Admin / Support", value: "admin" },
        { label: "External Contractor", value: "contractor" },
      ],
    },
    ...slugField("name"),
  ],
};
