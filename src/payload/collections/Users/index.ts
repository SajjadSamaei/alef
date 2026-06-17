import type { CollectionConfig } from "payload";
import { adminOnly } from "@/payload/access/adminOnly";
import { adminOnlyFieldAccess } from "@/payload/access/adminOnlyFieldAccess";
import { adminOrSelf } from "@/payload/access/adminOrSelf";
import { checkRole } from "@/payload/access/utilities";
import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    admin: ({ req: { user } }) =>
      checkRole(["admin", "management"], user),
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  labels: {
    singular: "کاربر",
    plural: "کاربران پنل",
  },
  admin: {
    group: "مدیریت",
    defaultColumns: ["name", "email", "roles"],
    hidden: ({ user }) => !user?.roles?.includes("admin"),
    useAsTitle: "name",
    description:
      "حساب‌های ورود به پنل مدیریت. نقش کاربران فقط توسط مدیر اصلی قابل تغییر است.",
  },
  auth: {
    tokenExpiration: 1209600,
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: true,
      requireUsername: true,
    },
  },
  fields: [
    {
      name: "name",
      label: "نام و نام خانوادگی",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "roles",
      label: "سطح دسترسی",
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
          label: "مدیر اصلی",
          value: "admin",
        },
        {
          label: "ویرایشگر",
          value: "editor",
        },
        {
          label: "مدیریت شرکت",
          value: "management",
        },
      ],
      admin: {
        description:
          "مدیریت شرکت به محتوای سایت دسترسی دارد؛ تغییر حساب‌ها و نقش‌ها در اختیار مدیر اصلی است.",
      },
    },
  ],
};
