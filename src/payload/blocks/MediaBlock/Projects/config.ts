import type { Block } from "payload";

export const ProjectMediaBlock: Block = {
  slug: "projectMediaBlock",
  interfaceName: "ProjectMediaBlock",
  fields: [
    {
      name: "media",
      type: "upload",
      relationTo: "case-study-media",
      required: true,
    },
  ],
};
