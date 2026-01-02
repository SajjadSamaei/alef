import type { CollectionConfig, CollectionBeforeChangeHook } from "payload";
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { placeholderFromBuffer } from "@/payload/utilities/placeholderImages";
import { publicAccess } from "@/payload/access/publicAccess";
import { adminOnly } from "@/payload/access/adminOnly";

export const generatePlaceholder: CollectionBeforeChangeHook = async ({
  req,
  data,
}) => {
  // Check if there is a file being uploaded
  if (req.file && req.file.data) {
    try {
      // req.file.data is the buffer of the uploaded file
      const placeholder = await placeholderFromBuffer(req.file.data);
      // Add the placeholder to the data that will be saved
      return { ...data, placeholder };
    } catch (e) {
      req.payload.logger.error(
        `Error generating placeholder: ${(e as Error).message}`,
      );
    }
  }

  // If no file, return data as is
  return data;
};

export const Media: CollectionConfig = {
  admin: {
    group: "General",
  },
  slug: "media",
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicAccess,
    update: adminOnly,
  },
  hooks: {
    beforeChange: [generatePlaceholder],
  },

  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "richText",
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
    },
    {
      name: "placeholder",
      type: "text",
      admin: {
        readOnly: true,
        description: "Low-res base64 placeholder for the image.",
      },
    },
  ],
  upload: {
    mimeTypes: ["image/*", "video/*"],
    focalPoint: true,
    imageSizes: [
      {
        name: "thumbnail",
        width: 300,
        position: "centre",
        formatOptions: {
          format: "webp",
        },
      },
      {
        name: "small",
        width: 600,
        position: "centre",
        formatOptions: {
          format: "webp",
        },
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
        formatOptions: {
          format: "webp",
        },
      },
      {
        name: "medium",
        width: 900,
        formatOptions: {
          format: "webp",
        },
      },
      {
        name: "square",
        width: 1080,
        height: 1080,
        formatOptions: {
          format: "webp",
        },
      },

      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
        formatOptions: {
          format: "webp",
        },
      },

      {
        name: "og",
        width: 1200,
        height: 630,
        crop: "center",
        formatOptions: {
          format: "webp",
        },
      },
      {
        name: "twitter",
        width: 1200,
        height: 600,
        crop: "center",
        formatOptions: {
          format: "webp",
        },
      },
      {
        name: "large",
        width: 1400,
        crop: "center",
        formatOptions: {
          format: "webp",
        },
      },
    ],
    formatOptions: {
      format: "webp",
      options: {
        quality: 75, // Set WebP quality to 75%
      },
    },
    disableLocalStorage: true,
  },
};
