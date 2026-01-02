import type { CollectionConfig } from "payload";
// import { checkRole } from "@/payload/access/checkRole";
import { authenticated } from "@/payload/access/authenticated";
import { isUserAdmin } from "@/payload/access/whoHasAccess";
import { adminOnly } from "@/payload/access/adminOnly";
import { adminOnlyFieldAccess } from "@/payload/access/adminOnlyFieldAccess";
import { publicAccess } from "@/payload/access/publicAccess";
import { adminOrSelf } from "@/payload/access/adminOrSelf";
import { checkRole } from "@/payload/access/utilities";
import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    admin: ({ req: { user } }) => checkRole(["admin"], user),
    create: publicAccess,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    group: "General",
    defaultColumns: ["name", "email", "roles"],
    useAsTitle: "name",
  },
  auth: {
    tokenExpiration: 1209600,
  },
  fields: [
    {
      name: "name",
      type: "text",
      localized: true,
    },
    {
      name: "roles",
      type: "select",
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ["editor"],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: "admin",
          value: "admin",
        },
        {
          label: "editor",
          value: "editor",
        },
        {
          label: "management",
          value: "management",
        },
      ],
    },
  ],
};
