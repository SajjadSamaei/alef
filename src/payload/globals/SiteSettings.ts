import type { Field, GlobalConfig, StaticLabel } from "payload";
import { revalidateGlobal } from "./revalidateGlobal";

const label = (en: string, fa: string): StaticLabel => ({ en, fa });

const pageToggle = (name: string, en: string, fa: string): Field => ({
  name,
  type: "checkbox",
  defaultValue: true,
  label: label(en, fa),
});

const seoFields = (name: string, en: string, fa: string): Field => ({
  name,
  type: "group",
  label: label(en, fa),
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      label: label("SEO title", "عنوان سئو"),
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      label: label("SEO description", "توضیح سئو"),
      maxLength: 180,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: label("Social sharing image", "تصویر اشتراک‌گذاری"),
    },
  ],
});

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: label("Site settings", "تنظیمات اصلی سایت"),
  admin: {
    group: label("Site settings", "تنظیمات سایت"),
    description: label(
      "Manage contact details, page availability, social profiles, and default SEO.",
      "اطلاعات تماس، نمایش صفحات، شبکه‌های اجتماعی و سئوی عمومی سایت را مدیریت کنید.",
    ),
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateGlobal("site-settings")],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: label("Contact and office", "تماس و دفتر"),
          fields: [
            {
              name: "contact",
              type: "group",
              label: label("Contact details", "اطلاعات تماس"),
              fields: [
                {
                  name: "email",
                  type: "email",
                  required: true,
                  label: label("Public email", "ایمیل عمومی"),
                },
                {
                  name: "phone",
                  type: "text",
                  required: true,
                  label: label("Phone number", "شماره تلفن"),
                  admin: {
                    description: label(
                      "Use international format, for example +98912...",
                      "با قالب بین‌المللی وارد کنید؛ مانند ‎+98912...",
                    ),
                  },
                },
                {
                  name: "officeName",
                  type: "text",
                  localized: true,
                  label: label("Office name", "نام دفتر"),
                },
                {
                  name: "addressLine1",
                  type: "text",
                  localized: true,
                  label: label("Address line 1", "نشانی، خط اول"),
                },
                {
                  name: "addressLine2",
                  type: "text",
                  localized: true,
                  label: label("Address line 2", "نشانی، خط دوم"),
                },
                {
                  name: "workingHours",
                  type: "text",
                  localized: true,
                  label: label("Working hours", "ساعات کاری"),
                },
              ],
            },
            {
              name: "social",
              type: "group",
              label: label("Social profiles", "شبکه‌های اجتماعی"),
              fields: [
                { name: "whatsapp", type: "text", label: "WhatsApp" },
                { name: "telegram", type: "text", label: "Telegram" },
                { name: "instagram", type: "text", label: "Instagram" },
                { name: "linkedin", type: "text", label: "LinkedIn" },
                { name: "facebook", type: "text", label: "Facebook" },
                { name: "x", type: "text", label: "X" },
              ],
            },
          ],
        },
        {
          label: label("Page availability", "نمایش صفحات"),
          fields: [
            {
              name: "pages",
              type: "group",
              label: label("Enabled pages", "صفحات فعال"),
              admin: {
                description: label(
                  "Disabled pages are removed from navigation and return a 404 response.",
                  "صفحات غیرفعال از منو حذف می‌شوند و پاسخ ۴۰۴ نمایش می‌دهند.",
                ),
              },
              fields: [
                pageToggle("portfolio", "Portfolio", "پورتفولیو"),
                pageToggle("services", "Services", "خدمات"),
                pageToggle("process", "Design process", "فرآیند طراحی"),
                pageToggle("about", "About", "درباره ما"),
                pageToggle("blog", "Blog", "وبلاگ"),
                pageToggle("contact", "Contact", "تماس و همکاری"),
                pageToggle("team", "Team profiles", "پروفایل اعضای تیم"),
              ],
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              type: "group",
              label: label("SEO defaults", "تنظیمات پیش‌فرض سئو"),
              fields: [
                {
                  name: "siteName",
                  type: "text",
                  localized: true,
                  label: label("Site name", "نام سایت"),
                },
                {
                  name: "titleTemplate",
                  type: "text",
                  localized: true,
                  label: label("Title template", "الگوی عنوان"),
                  admin: {
                    description: label(
                      "Use %s where the page title should appear.",
                      "برای محل عنوان صفحه از ‎%s استفاده کنید.",
                    ),
                  },
                },
                {
                  name: "defaultDescription",
                  type: "textarea",
                  localized: true,
                  label: label("Default description", "توضیح پیش‌فرض"),
                },
                {
                  name: "defaultImage",
                  type: "upload",
                  relationTo: "media",
                  label: label("Default social image", "تصویر پیش‌فرض اشتراک‌گذاری"),
                },
                seoFields("home", "Home page", "صفحه اصلی"),
                seoFields("portfolio", "Portfolio page", "صفحه پورتفولیو"),
                seoFields("services", "Services page", "صفحه خدمات"),
                seoFields("process", "Process page", "صفحه فرآیند"),
                seoFields("about", "About page", "صفحه درباره ما"),
                seoFields("blog", "Blog page", "صفحه وبلاگ"),
                seoFields("contact", "Contact page", "صفحه تماس"),
              ],
            },
          ],
        },
      ],
    },
  ],
};
