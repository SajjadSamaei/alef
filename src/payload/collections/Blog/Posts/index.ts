import { adminOnly } from "@/payload/access/adminOnly";
import { adminOrPublishedStatus } from "@/payload/access/adminOrPublishedStatus";
import { BlogCarousel } from "@/payload/blocks/BlogCarousel/config";
import { BlogMediaBlock } from "@/payload/blocks/MediaBlock/Blog/config";
import { slugField } from "@/payload/fields/slug";
import { generatePreviewPath } from "@/payload/utilities/generatePreviewPath";
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
import { populateAuthors } from "./hooks/populateAuthors";
import { revalidateDelete, revalidatePost } from "./hooks/revalidatePost";
import { calculateReadingTime } from "./hooks/calculateReadingTime";

export const Posts: CollectionConfig<"posts"> = {
  slug: "posts",
  labels: {
    singular: "Post",
    plural: "Posts",
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOrPublishedStatus,
    update: adminOnly,
  },
  admin: {
    group: "Blog",
    defaultColumns: ["title", "publishedAt"],
    useAsTitle: "title",
    livePreview: {
      url: ({ data, locale }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === "string" ? data.slug : "",
          collection: "posts",
          locale: locale.code,
        });
        return `${path}`;
      },
    },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ==============================================
        // TAB 1: CONTENT
        // ==============================================
        {
          label: "Content",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              localized: true,
              admin: { className: "text-2xl font-bold" },
            },
            {
              name: "subtitle",
              type: "textarea",
              localized: true,
              admin: {
                rows: 2,
                description: "Appears below the title on the single post page.",
              },
            },
            {
              name: "excerpt",
              type: "textarea",
              localized: true,
              admin: {
                description: "A short summary used for blog listing cards.",
              },
            },

            // ✅ RESTORED: Top-level heroImage field (Fixes frontend TS error)
            {
              name: "heroImage",
              type: "upload",
              relationTo: "blog-media",
              required: true,
              label: "Hero Image",
            },
            {
              name: "heroCaption",
              type: "text",
              localized: true,
              label: "Hero Image Caption (Optional)",
            },

            {
              name: "content",
              type: "richText",
              localized: true,
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
                  BlocksFeature({ blocks: [BlogMediaBlock, BlogCarousel] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
          ],
        },

        // ==============================================
        // TAB 2: TAXONOMY & SETTINGS
        // ==============================================
        {
          label: "Taxonomy & Settings",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "categories",
                  type: "relationship",
                  relationTo: "blog-categories",
                  hasMany: true,
                  admin: { width: "50%" },
                },
                {
                  name: "tags",
                  type: "relationship",
                  relationTo: "tags",
                  hasMany: true,
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "relatedPosts",
              type: "relationship",
              relationTo: "posts",
              hasMany: true,
              filterOptions: ({ id }) => ({ id: { not_in: [id] } }),
            },
            {
              name: "keywords",
              type: "array",
              localized: true,
              label: "Search Keywords",
              admin: {
                description: "Used for frontend related article search.",
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
        // TAB 3: SEO
        // ==============================================
        {
          name: "meta",
          label: "SEO",
          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: "blog-media" }),
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

    // ==============================================
    // SIDEBAR
    // ==============================================
    ...slugField(),
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
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
    {
      name: "authors",
      type: "relationship",
      relationTo: "authors",
      hasMany: true,
      admin: { position: "sidebar" },
    },
    {
      name: "readingTime",
      type: "number",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Auto-calculated reading time (minutes).",
      },
      hooks: {
        beforeChange: [calculateReadingTime],
      },
    },

    // Hidden populated fields
    {
      name: "populatedAuthors",
      type: "array",
      access: { update: () => false },
      admin: { disabled: true, readOnly: true, hidden: true },
      fields: [
        { name: "id", type: "text" },
        { name: "name", type: "text", localized: true },
        { name: "role", type: "text", localized: true },
        { name: "bio", type: "text", localized: true },
        { name: "twitter", type: "text" },
        { name: "linkedin", type: "text" },
        { name: "instagram", type: "text" },
        { name: "website", type: "text" },
        {
          name: "image",
          type: "relationship",
          relationTo: "media",
          admin: { disabled: true },
        },
        {
          name: "associatedTeamMember",
          type: "relationship",
          relationTo: "team",
          hasMany: false,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 5000 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
};
