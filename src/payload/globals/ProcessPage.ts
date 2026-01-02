import { GlobalConfig } from "payload";

export const ProcessPage: GlobalConfig = {
  slug: "process-page",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "vision",
      label: "Step 1: Vision & Strategy",
      type: "group",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
    {
      name: "design",
      label: "Step 2: Concept & Design",
      type: "group",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
    {
      name: "technical",
      label: "Step 3: Technical Development",
      type: "group",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
    {
      name: "execution",
      label: "Step 4: Execution & Supervision",
      type: "group",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
  ],
};
