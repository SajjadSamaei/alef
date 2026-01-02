import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

export const LandingBanner: GlobalConfig = {
  slug: "landing-banner",
  label: "Landing Page Banner",
  hooks: {
    afterChange: [
      async () => {
        revalidateTag("landing-page-banner", "max");
      },
    ],
  },
  access: {
    read: () => true, // Make it public so Next.js can fetch it
  },
  fields: [
    {
      name: "active",
      label: "Activate Banner",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "description",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "linkURL", // -> ADD THIS FIELD
      label: "Banner Link URL",
      type: "text",
      defaultValue: "#",
      required: true,
    },
    {
      name: "cta",
      label: "CTA text",
      type: "text",
      defaultValue: "Learn More",
      localized: true,
      required: true,
    },
    {
      name: "campaignSchedule",
      label: "Campaign Schedule",
      type: "group",
      fields: [
        {
          name: "campaignStartDate",
          label: "Campaign Start Date",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "dayAndTime",
            },
            description:
              "The banner will not be shown before this date. Leave blank to start immediately.",
          },
        },
        {
          name: "campaignEndDate",
          label: "Campaign End Date",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "dayAndTime",
            },
            description:
              "The banner will not be shown after this date. Leave blank for no end date.",
          },
        },
      ],
    },
  ],
};
