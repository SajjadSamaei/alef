import type { CollectionConfig } from "payload";
import { adminOnly } from "@/payload/access/adminOnly";
import { publicAccess } from "@/payload/access/publicAccess";
import { z } from "zod";

const optionalUrlSchema = z.union([
  z.literal(""), // Allow empty string
  z.string().url({ message: "Please enter a valid URL (e.g., https://...)" }),
]);

const zodUrlValidator = (value: string | null | undefined) => {
  if (!value) {
    return true; // Valid if empty, null, or undefined
  }

  const result = optionalUrlSchema.safeParse(value);

  if (result.success) {
    return true; // Validation passed
  } else {
    // Extract the error message
    return result.error.issues[0].message;
  }
};

export const Authors: CollectionConfig = {
  slug: "authors",
  // 👇 Make this collection publicy readable
  access: {
    read: publicAccess,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: "name",
    group: "Blog",
  },
  fields: [
    {
      name: "name", // Public name
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "role", // Public role
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "bio", // Public bio
      type: "text",
      localized: true,
      admin: {
        description:
          "This is a short bio for the user. It will be displayed below a blog post.",
      },
    },
    {
      name: "image", // Public image
      type: "upload",
      relationTo: "media",
    },
    // 👇 This is the crucial link back to the private User
    {
      name: "userAccount",
      type: "relationship",
      relationTo: "users",
      unique: true, // Enforce one-to-one relationship
      // 👇 Hide this link from the public API
      access: {
        read: ({ req }) => req.user?.roles?.includes("admin") || false,
      },
      admin: {
        position: "sidebar",
        description:
          "Link this public author profile to its private user account for login.",
      },
    },
    {
      name: "associatedTeamMember",
      type: "relationship",
      relationTo: "team", // Must match the slug of your Team collection
      hasMany: false,
      admin: {
        position: "sidebar",
        description:
          "If this author is a team member, select their profile here. The website will link to their Team page instead of a generic Author page.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Social Media",
          fields: [
            {
              name: "twitter",
              label: "Twitter URL",
              type: "text",
              validate: zodUrlValidator,
            },
            {
              name: "linkedin",
              label: "LinkedIn URL",
              type: "text",
              validate: zodUrlValidator,
            },
            {
              name: "instagram",
              label: "Instagram URL",
              type: "text",
              validate: zodUrlValidator,
              admin: {
                description:
                  "Enter the full URL of the user's Insagram profile.",
              },
            },
            {
              name: "website",
              label: "Website URL",
              type: "text",
              validate: zodUrlValidator,
              admin: {
                description: "Enter the full URL of the user's website.",
              },
            },
          ],
        },
      ],
    },
  ],
};
