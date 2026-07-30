import { GlobalConfig } from "payload";
import { revalidateGlobal } from "./revalidateGlobal";

export const LandingPage: GlobalConfig = {
  slug: "landing-page",
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  hooks: {
    afterChange: [revalidateGlobal("landing-page")],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "hero",
              type: "group",
              fields: [
                {
                  name: "title",
                  type: "text",
                  localized: true,
                },
                {
                  name: "subtitle",
                  type: "textarea",
                  localized: true,
                },
                {
                  name: "primaryButton",
                  type: "text",
                  localized: true,
                },
                {
                  name: "secondaryButton",
                  type: "text",
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: "Projects",
          fields: [
            {
              name: "projectsCopy",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "description", type: "textarea", localized: true },
                { name: "viewAll", type: "text", localized: true },
              ],
            },
          ],
        },
        {
          label: "About",
          fields: [
            {
              name: "about",
              type: "group",
              label: "About Section",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "description", type: "textarea", localized: true },
                { name: "learnMoreLink", type: "text", localized: true },
                { name: "image", type: "upload", relationTo: "media" },
              ],
            },
          ],
        },
        {
          label: "Services",
          fields: [
            {
              name: "servicesCopy",
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", localized: true },
                { name: "title", type: "text", localized: true },
                { name: "description", type: "textarea", localized: true },
                {
                  name: "architectureTitle",
                  type: "text",
                  localized: true,
                },
                {
                  name: "interiorTitle",
                  type: "text",
                  localized: true,
                },
                { name: "urbanTitle", type: "text", localized: true },
                {
                  name: "supervisionTitle",
                  type: "text",
                  localized: true,
                },
                {
                  name: "restorationTitle",
                  type: "text",
                  localized: true,
                },
              ],
            },
            {
              name: "services",
              type: "group",
              label: "Services Grid Images",
              fields: [
                {
                  name: "architecture",
                  type: "upload",
                  relationTo: "media",
                },
                {
                  name: "interior",
                  type: "upload",
                  relationTo: "media",
                },
                {
                  name: "urban",
                  type: "upload",
                  relationTo: "media",
                },
                {
                  name: "supervision",
                  type: "upload",
                  relationTo: "media",
                },
                {
                  name: "restoration",
                  type: "upload",
                  relationTo: "media",
                },
              ],
            },
          ],
        },
        {
          label: "Partners",
          fields: [
            {
              name: "partnersTitle",
              type: "text",
              localized: true,
            },
            {
              name: "partners",
              type: "array",
              label: "Our Partners",
              fields: [
                {
                  name: "title",
                  type: "text",
                  localized: true,
                },
                { name: "logo", type: "upload", relationTo: "media" },
                { name: "url", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Testimonial",
          fields: [
            {
              name: "testimonial",
              type: "group",
              label: "Testimonial Section",
              fields: [
                { name: "quote", type: "textarea", localized: true },
                { name: "authorName", type: "text", localized: true },
                { name: "authorRole", type: "text", localized: true },
                {
                  name: "authorImage",
                  type: "upload",
                  relationTo: "media",
                  label: "Author Portrait",
                },
              ],
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "metadata",
              type: "group",
              label: "SEO & Metadata",
              fields: [
                {
                  name: "metaImage",
                  type: "upload",
                  relationTo: "media",
                  label: "Main SEO Image",
                  admin: {
                    description:
                      "Upload a high-res image (at least 1200x1200).",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
