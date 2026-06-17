import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { searchPlugin } from "@payloadcms/plugin-search";
import { Plugin } from "payload";
import { revalidateRedirects } from "@/payload/hooks/revalidateRedirects";
import { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types";
import {
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { searchFields } from "@/payload/search/fieldOverrides";
import { beforeSyncWithSearch } from "@/payload/search/beforeSync";

import { Page, Post } from "@/src/payload-types";
import { getServerSideURL } from "@/payload/utilities/getURL";

// --- Updated generateTitle ---
const generateTitle: GenerateTitle<Post | Page> = ({ doc, locale }) => {
  const siteTitle =
    locale === "fa" ? "استودیو معماری الف" : "Alef Architecture Studio";
  return doc?.title ? `${doc.title} | ${siteTitle}` : siteTitle;
};

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL();
  return doc?.slug ? `${url}/${doc.slug}` : url;
};

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ["pages", "posts"],
    overrides: {
      admin: {
        group: { en: "Site settings", fa: "تنظیمات سایت" },
        description: {
          en: "Redirect retired or changed URLs to their new destination.",
          fa: "نشانی‌های قدیمی یا تغییرکرده را به مقصد جدید هدایت کنید.",
        },
      },
      // @ts-expect-error - This is a valid override
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ("name" in field && field.name === "from") {
            return {
              ...field,
              admin: {
                description: {
                  en: "Enter the old path, beginning with /.",
                  fa: "مسیر قدیمی را با / در ابتدای آن وارد کنید.",
                },
              },
            };
          }
          return field;
        });
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: [
      "categories",
      "blog-categories",
      "case-study-type",
      "project-type",
    ],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ""),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      admin: {
        hidden: true,
      },
    },
    formOverrides: {
      admin: {
        hidden: true,
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ("name" in field && field.name === "confirmationMessage") {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({
                      enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
                    }),
                  ];
                },
              }),
            };
          }
          return field;
        });
      },
    },
  }),
  searchPlugin({
    collections: ["posts", "projects", "case-studies", "team", "static-pages"],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: {
        hidden: true,
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields];
      },
    },
  }),
];
