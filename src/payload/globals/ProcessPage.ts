import { GlobalConfig } from "payload";
import { revalidateGlobal } from "./revalidateGlobal";

const phaseFields = () => [
  { name: "title", type: "text" as const, localized: true },
  { name: "subtitle", type: "text" as const, localized: true },
  {
    name: "paragraphs",
    type: "array" as const,
    localized: true,
    fields: [{ name: "text", type: "textarea" as const }],
  },
  { name: "detailsTitle", type: "text" as const, localized: true },
  {
    name: "tags",
    type: "array" as const,
    localized: true,
    fields: [{ name: "label", type: "text" as const }],
  },
  { name: "image", type: "upload" as const, relationTo: "media" as const, required: true },
];

export const ProcessPage: GlobalConfig = {
  slug: "process-page",
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [revalidateGlobal("process-page")],
  },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "description", type: "textarea", localized: true },
      ],
    },
    {
      name: "vision",
      label: "Step 1: Vision & Strategy",
      type: "group",
      fields: phaseFields(),
    },
    {
      name: "design",
      label: "Step 2: Concept & Design",
      type: "group",
      fields: phaseFields(),
    },
    {
      name: "technical",
      label: "Step 3: Technical Development",
      type: "group",
      fields: phaseFields(),
    },
    {
      name: "execution",
      label: "Step 4: Execution & Supervision",
      type: "group",
      fields: phaseFields(),
    },
  ],
};
