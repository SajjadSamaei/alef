import { authenticated } from "@/payload/access/authenticated";
import { authenticatedOrPublished } from "@/payload/access/authenticatedOrPublished";
import { ProjectMediaBlock } from "@/payload/blocks/MediaBlock/Projects/config";
import { ProjectCarousel } from "@/payload/blocks/BlogCarousel/Projects/config";
import { slugField } from "@/payload/fields/slug";
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";
import { revalidateProject, revalidateDelete } from "./hooks/revalidateProject";
import { generatePreviewPath } from "@/payload/utilities/generatePreviewPath";

const isCustomSection = (
  _: unknown,
  siblingData: Partial<{ sectionType: string }>,
) => siblingData.sectionType === "custom";

export const CaseStudies: CollectionConfig<"case-studies"> = {
  slug: "case-studies",
  labels: {
    singular: "Project",
    plural: "Projects",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ["title", "projectStatus", "publishedAt"],
    group: "پروژه‌ها و تیم",
    useAsTitle: "title",
    livePreview: {
      url: ({ data, locale }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === "string" ? data.slug : "",
          collection: "posts",
          locale: locale.code,
        });
        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`;
      },
    },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ==============================================
        // TAB 1: OVERVIEW (The "Hook")
        // ==============================================
        {
          label: "معرفی پروژه",
          fields: [
            {
              name: "title",
              label: "Project Name",
              type: "text",
              localized: true,
              required: true,
            },
            {
              name: "subtitle",
              label: "One-line Concept / Tagline",
              type: "text",
              localized: true,
              admin: {
                description: "e.g. 'A brutalist approach to urban living'",
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "projectType",
                  label: "Typology",
                  type: "relationship",
                  relationTo: "case-study-type",
                  required: true,
                  admin: { width: "50%" },
                },
                {
                  name: "projectStatus",
                  type: "select",
                  admin: { width: "50%" },
                  options: [
                    { label: "Competition / Concept", value: "concept" },
                    { label: "Schematic Design", value: "schematic" },
                    { label: "Under Construction", value: "construction" },
                    { label: "Built / Completed", value: "built" },
                  ],
                },
              ],
            },
            {
              name: "projectBrief",
              label: "Project Brief / Abstract",
              type: "textarea",
              localized: true,
              admin: {
                description:
                  "A short paragraph summarizing the project challenge and solution (appears in listings).",
              },
            },
            {
              name: "featuredImage",
              label: "Hero Image",
              type: "upload",
              relationTo: "case-study-media",
              required: true,
            },
            {
              name: "keywords",
              type: "array",
              localized: true,
              label: "Architectural Tags",
              admin: {
                description: "e.g. Adaptive Reuse, Minimalist, Timber",
              },
              fields: [
                {
                  name: "keyword",
                  type: "text",
                  localized: true,
                },
              ],
            },
          ],
        },

        // ==============================================
        // TAB 2: NARRATIVE & MEDIA (The "Story")
        // ==============================================
        {
          label: "روایت و تصاویر",
          fields: [
            {
              name: "details",
              label: "Design Narrative",
              type: "richText",
              localized: true,
              required: true,
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
            {
              name: "projectGallery",
              label: "Photography Gallery",
              type: "array",
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "case-study-media",
                },
                {
                  name: "caption",
                  type: "text",
                  localized: true,
                },
              ],
            },
            //

            // Architects separate technical drawings from pretty photos
            {
              name: "projectDrawings",
              label: "Technical Drawings",
              labels: {
                singular: "Drawing",
                plural: "Drawings",
              },
              type: "array",
              admin: {
                description:
                  "Upload Plans, Sections, Elevations, and Axonometrics here.",
              },
              fields: [
                {
                  name: "drawing",
                  type: "upload",
                  relationTo: "case-study-media",
                },
                {
                  name: "drawingType",
                  type: "select",
                  options: [
                    { label: "Floor Plan", value: "plan" },
                    { label: "Section", value: "section" },
                    { label: "Elevation", value: "elevation" },
                    { label: "Diagram/Axo", value: "diagram" },
                    { label: "Detail", value: "detail" },
                  ],
                },
                {
                  name: "caption",
                  type: "text",
                  localized: true,
                },
              ],
            },
          ],
        },

        // ==============================================
        // TAB 3: SPECS & CREDITS (The "Facts")
        // ==============================================
        {
          label: "مشخصات و عوامل",
          fields: [
            // --- Location & Client ---
            {
              type: "row",
              fields: [
                {
                  name: "client",
                  localized: true,
                  type: "text",
                  admin: { width: "50%" },
                },
                {
                  name: "yearCompleted",
                  label: "Year",
                  type: "number",
                  admin: { width: "50%" },
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
                      type: "row",
                      fields: [
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
              ],
            },
            // --- Metrics (Architects use GFA/Site Area) ---
            {
              name: "metrics",
              type: "group",
              label: "Project Metrics",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "gfa",
                      label: "Gross Floor Area (sqm)",
                      type: "number",
                      admin: { width: "33%" },
                    },
                    {
                      name: "siteArea",
                      label: "Site Area (sqm)",
                      type: "number",
                      admin: { width: "33%" },
                    },
                    {
                      name: "budget",
                      label: "Budget (Hidden/Internal)",
                      type: "text",
                      admin: { width: "33%", description: "Optional" },
                    },
                  ],
                },
              ],
            },
            {
              name: "overviewDetails",
              label: {
                en: "Additional overview information",
                fa: "اطلاعات تکمیلی معرفی پروژه",
              },
              labels: {
                singular: {
                  en: "Additional item",
                  fa: "اطلاعات تکمیلی",
                },
                plural: {
                  en: "Additional items",
                  fa: "اطلاعات تکمیلی",
                },
              },
              type: "array",
              admin: {
                description: {
                  en: "Optional label and value rows shown inside Project Highlights.",
                  fa: "اختیاری؛ برای افزودن اطلاعات دلخواه به بخش نکات برجسته پروژه، مانند تعداد طبقات یا وضعیت اجرا.",
                },
              },
              fields: [
                {
                  name: "label",
                  label: {
                    en: "Label",
                    fa: "عنوان",
                  },
                  type: "text",
                  localized: true,
                  required: true,
                },
                {
                  name: "value",
                  label: {
                    en: "Value",
                    fa: "مقدار یا توضیح",
                  },
                  type: "text",
                  localized: true,
                  required: true,
                },
              ],
            },
            {
              name: "technicalSpecs",
              label: "Materiality & Systems",
              type: "group",
              admin: {
                hidden: true,
              },
              fields: [
                {
                  name: "materials",
                  label: "Key Materials",
                  type: "array",
                  localized: true,
                  admin: {
                    description:
                      "e.g. Exposed Concrete, White Oak, Corten Steel",
                  },
                  fields: [{ name: "material", type: "text" }],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "structureSystem",
                      label: "Structural System",
                      type: "text",
                      localized: true,
                      admin: {
                        width: "50%",
                        description: "e.g. CLT, Reinforced Concrete",
                      },
                    },
                    {
                      name: "sustainability",
                      label: "Sustainability / Certification",
                      type: "text",
                      localized: true,
                      admin: {
                        width: "50%",
                        description: "e.g. LEED Platinum, Passive House",
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: "featuresBySection",
              type: "array",
              label: "Detailed Schedules / Features Table",
              dbName: "proj_feat_sec",
              admin: {
                hidden: true,
              },
              fields: [
                {
                  name: "sectionType",
                  label: "Section Title",
                  type: "select",
                  options: [
                    { label: "General Features", value: "primary_features" },
                    { label: "Unit Amenities", value: "amenities" },
                    {
                      label: "Building Amenities",
                      value: "building_amenities",
                    },
                    { label: "Custom Title", value: "custom" },
                  ],
                  defaultValue: "primary_features",
                },
                {
                  name: "customSectionName",
                  label: "Custom Name",
                  type: "text",
                  localized: true,
                  admin: {
                    condition: isCustomSection,
                  },
                },
                {
                  name: "features",
                  label: "Rows / Items",
                  type: "array",
                  dbName: "proj_feat_rows",
                  fields: [
                    {
                      name: "name",
                      label: "Item Name",
                      type: "text",
                      required: true,
                      localized: true,
                    },
                    {
                      name: "valueType",
                      label: "Type",
                      type: "select",
                      defaultValue: "text",
                      dbName: "val_type",
                      options: [
                        { label: "Text", value: "text" },
                        { label: "Boolean (Check/Cross)", value: "boolean" },
                        { label: "Number", value: "number" },
                        { label: "Area (m²)", value: "sqm" },
                      ],
                    },
                    {
                      name: "textValue",
                      label: "Value",
                      type: "text",
                      localized: true,
                      admin: {
                        condition: (_, sibling) => sibling.valueType === "text",
                      },
                    },
                    {
                      name: "booleanValue",
                      label: "Is Available?",
                      type: "checkbox",
                      admin: {
                        condition: (_, sibling) =>
                          sibling.valueType === "boolean",
                      },
                    },
                    {
                      name: "numberValue",
                      label: "Value",
                      type: "number",
                      admin: {
                        condition: (_, sibling) =>
                          sibling.valueType === "number" ||
                          sibling.valueType === "sqm",
                      },
                    },
                  ],
                },
              ],
            },
            // --- Credits (Crucial for Architecture) ---
            {
              name: "credits",
              label: "Project Credits",
              type: "group",
              fields: [
                {
                  name: "team", // Internal Team
                  label: "Internal Design Team",
                  type: "relationship",
                  hasMany: true,
                  relationTo: "team",
                },
                {
                  name: "collaborators", // External Consultants
                  label: "External Collaborators / Consultants",
                  type: "array",
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "role",
                          label: "Role",
                          type: "text",
                          required: true,
                          localized: true,
                          admin: {
                            width: "40%",
                            description:
                              "e.g. Structural Engineer, Lighting, Contractor",
                          },
                        },
                        {
                          name: "company",
                          label: "Company / Person",
                          type: "text",
                          required: true,
                          localized: true,
                          admin: { width: "60%" },
                        },
                      ],
                    },
                    {
                      name: "website",
                      label: "Website URL (Optional)",
                      type: "text",
                    },
                  ],
                },
                {
                  name: "photographers",
                  label: "Photography Credits",
                  type: "array",
                  fields: [
                    { name: "name", type: "text", required: true },
                    { name: "website", type: "text" },
                  ],
                },
              ],
            },
            // --- Awards ---
            {
              name: "awards",
              type: "array",
              localized: true,
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "year", type: "text", admin: { width: "20%" } },
                    {
                      name: "award",
                      localized: true,
                      type: "text",
                      admin: { width: "80%" },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ==============================================
        // TAB 4: SEO
        // ==============================================
        {
          name: "meta",
          label: "سئو و انتشار",
          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: "case-study-media",
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: "meta.title",
              descriptionPath: "meta.description",
            }),
          ],
        },
      ],
    },
    // --- Sidebar ---
    ...slugField(),
    {
      name: "publishedAt",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
  ],
  hooks: {
    afterChange: [revalidateProject],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000,
      },
      schedulePublish: false,
    },
    maxPerDoc: 50,
  },
};
