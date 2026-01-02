import { GlobalConfig } from "payload";

export const LandingPage: GlobalConfig = {
  slug: "landing-page",
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  fields: [
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
        { name: "urban", type: "upload", relationTo: "media" },
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
    {
      name: "partners",
      type: "array",
      label: "Our Partners",
      fields: [
        {
          name: "title",
          type: "text",
          localized: true,
          admin: {
            description: "Used for translation mapping (e.g., 'shouder')",
          },
        },
        { name: "logo", type: "upload", relationTo: "media" },
        { name: "url", type: "text" },
      ],
    },
    {
      name: "testimonial",
      type: "group",
      label: "Testimonial Section",
      fields: [
        {
          name: "authorImage",
          type: "upload",
          relationTo: "media",
          label: "Author Portrait",
        },
      ],
    },
    {
      name: "about",
      type: "group",
      label: "About Section",
      fields: [{ name: "image", type: "upload", relationTo: "media" }],
    },
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
              "Upload a high-res image (at least 1200x1200). We will automatically generate the Wide, Square, and Twitter versions from this.",
          },
        },
      ],
    },
  ],
};
