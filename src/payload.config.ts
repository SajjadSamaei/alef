import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import path from "path";
import {
  buildConfig,
  type CollectionConfig,
  type GlobalConfig,
  type StaticLabel,
  PayloadRequest,
} from "payload";
import { fileURLToPath } from "url";
import { Users } from "@/payload/collections/Users";
import { AlefInquiries } from "@/payload/collections/Inquiries/Chegall-Inquiries";
import { BlogMedia } from "@/payload/collections/Blog/BlogMedia";
import { BlogCategories } from "@/payload/collections/Blog/BlogCategories";
import { ProjectMedia } from "@/payload/collections/Projects/ProjectMedia";
import { Projects } from "@/payload/collections/Projects/Project";
import { TeamMedia } from "@/payload/collections/Team/Media/TeamMedia";
import { Team } from "@/payload/collections/Team/Team";
import { ProjectType } from "@/payload/collections/Projects/ProjectType";
import { CaseStudies } from "@/payload/collections/CaseStudies/CaseStudy";
import { CaseStudyMedia } from "@/payload/collections/CaseStudies/CaseStudyMedia";
import { CaseStudyType } from "@/payload/collections/CaseStudies/CaseStudyType";
import { Categories } from "@/payload/collections/Categories";
import { Tags } from "@/payload/collections/Tags";
import { StaticPages } from "@/payload/collections/StaticPages";
import { Media } from "@/payload/collections/Media";
import { Pages } from "@/payload/collections/Pages";
import { Posts } from "@/payload/collections/Blog/Posts";
import { Documents } from "@/payload/collections/Documents";
import { Authors } from "@/payload/collections/Blog/Authors";
import { LandingBanner } from "@/payload/collections/Announcements/Banner";
import { Footer } from "@/payload/Footer/config";
import { Header } from "@/payload/Header/config";
import { plugins } from "@/payload/plugins";
import { defaultLexical } from "@/payload/fields/defaultLexical";
import { getServerSideURL } from "@/payload/utilities/getURL";
import { LandingPage } from "@/payload/globals/LandingPage";
import { ProcessPage } from "@/payload/globals/ProcessPage";
import { ServicesPage } from "@/payload/globals/ServicesPage";
import { AboutPage } from "@/payload/globals/AboutPage";
import { SiteSettings } from "@/payload/globals/SiteSettings";

import { fa } from "@payloadcms/translations/languages/fa";
import { en } from "@payloadcms/translations/languages/en";
import { resendAdapter } from "@payloadcms/email-resend";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const signingEndpoint = process.env.S3_ENDPOINT || "";
const publicStorageURL =
  process.env.S3_PUBLIC_URL || process.env.NEXT_PUBLIC_S3_ENDPOINT || signingEndpoint;
const storageEndpoint = Object.assign(async () => signingEndpoint, {
  toString: () => publicStorageURL,
}) as any;
const generatePublicFileURL = ({
  filename,
  prefix = "",
}: {
  filename: string;
  prefix?: string;
}) => {
  const cleanPrefix = prefix.replace(/^\/+|\/+$/g, "");
  const encodedFilename = encodeURIComponent(filename);
  return `${publicStorageURL}/${cleanPrefix ? `${cleanPrefix}/` : ""}${encodedFilename}`;
};

const label = (en: string, fa: string): StaticLabel => ({ en, fa });

const hideCollection = (collection: CollectionConfig): CollectionConfig => ({
  ...collection,
  admin: {
    ...collection.admin,
    hidden: true,
  },
});

const organizeCollection = (
  collection: CollectionConfig,
  {
    group,
    singular,
    plural,
    description,
  }: {
    group: StaticLabel;
    singular: StaticLabel;
    plural: StaticLabel;
    description: StaticLabel;
  },
): CollectionConfig => ({
  ...collection,
  labels: { singular, plural },
  admin: {
    ...collection.admin,
    group,
    description,
  },
});

const organizeGlobal = (
  global: GlobalConfig,
  group: StaticLabel,
  globalLabel: StaticLabel,
  description: StaticLabel,
): GlobalConfig => ({
  ...global,
  label: globalLabel,
  admin: {
    ...global.admin,
    group,
    description,
  },
});

export default buildConfig({
  routes: {
    admin: "/payload",
  },
  localization: {
    locales: ["en", "fa"], // required
    defaultLocale: "en", // required
  },
  i18n: {
    supportedLanguages: { en, fa },
    fallbackLanguage: "fa",
    translations: {
      fa: {
        "plugin-redirects": {
          customUrl: "نشانی سفارشی",
          documentToRedirect: "صفحه مقصد",
          fromUrl: "نشانی مبدأ",
          internalLink: "پیوند داخلی",
          redirectType: "نوع تغییر مسیر",
          toUrlType: "نوع نشانی مقصد",
        },
      },
    },
  },

  admin: {
    components: {
      beforeDashboard: ["@/payload/components/AdminGuide"],
    },
    suppressHydrationWarning: false,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  // db: vercelPostgresAdapter({
  //   pool: {
  //     connectionString: process.env.POSTGRES_URL || "",
  //   },
  // }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || "",
    },
  }),
  collections: [
    organizeCollection(CaseStudies, {
      group: label("Projects and team", "پروژه‌ها و تیم"),
      singular: label("Project", "پروژه"),
      plural: label("Projects", "پروژه‌ها"),
      description: label(
        "Manage portfolio projects, specifications, images, copy, and SEO.",
        "پروژه‌های منتشرشده در پورتفولیو را همراه با مشخصات، تصاویر، متن و سئو مدیریت کنید.",
      ),
    }),
    organizeCollection(CaseStudyType, {
      group: label("Projects and team", "پروژه‌ها و تیم"),
      singular: label("Project type", "نوع پروژه"),
      plural: label("Project types", "انواع پروژه"),
      description: label(
        "Categories such as residential, commercial, renovation, and urban design.",
        "دسته‌بندی پروژه‌ها مانند مسکونی، اداری، بازسازی و طراحی شهری.",
      ),
    }),
    organizeCollection(Team, {
      group: label("Projects and team", "پروژه‌ها و تیم"),
      singular: label("Team member", "عضو تیم"),
      plural: label("Team members", "اعضای تیم"),
      description: label(
        "Manage profiles, roles, biographies, portraits, and employment status.",
        "پروفایل اعضای دفتر، سمت، سوابق، تصویر و وضعیت همکاری را مدیریت کنید.",
      ),
    }),
    organizeCollection(Posts, {
      group: label("Magazine", "مجله و مطالب"),
      singular: label("Post", "مطلب"),
      plural: label("Blog posts", "مطالب وبلاگ"),
      description: label(
        "Persian and English articles, authors, categories, imagery, and SEO.",
        "مقالات فارسی و انگلیسی، تصویر شاخص، نویسنده، دسته‌بندی و اطلاعات سئو.",
      ),
    }),
    organizeCollection(Authors, {
      group: label("Magazine", "مجله و مطالب"),
      singular: label("Author", "نویسنده"),
      plural: label("Authors", "نویسندگان"),
      description: label("Manage blog author profiles.", "مشخصات نویسندگان مطالب وبلاگ را مدیریت کنید."),
    }),
    organizeCollection(Categories, {
      group: label("Magazine", "مجله و مطالب"),
      singular: label("Post category", "دسته‌بندی مطلب"),
      plural: label("Post categories", "دسته‌بندی‌های مطالب"),
      description: label("Primary blog archive categories.", "دسته‌بندی اصلی مطالب برای آرشیو و جست‌وجوی وبلاگ."),
    }),
    organizeCollection(BlogCategories, {
      group: label("Magazine", "مجله و مطالب"),
      singular: label("Blog topic", "موضوع وبلاگ"),
      plural: label("Blog topics", "موضوعات وبلاگ"),
      description: label("Additional topics for organizing posts.", "موضوعات تکمیلی برای مرتب‌سازی مطالب وبلاگ."),
    }),
    organizeCollection(Tags, {
      group: label("Magazine", "مجله و مطالب"),
      singular: label("Tag", "برچسب"),
      plural: label("Tags", "برچسب‌ها"),
      description: label("Keywords used for search and related content.", "کلیدواژه‌های مرتبط با مطالب برای جست‌وجو و ارتباط محتوا."),
    }),
    organizeCollection(CaseStudyMedia, {
      group: label("Media", "رسانه‌ها"),
      singular: label("Project media", "رسانه پروژه"),
      plural: label("Project images", "تصاویر پروژه‌ها"),
      description: label("Project imagery and galleries. Always provide accurate alt text.", "تصاویر اصلی پروژه‌ها. برای هر فایل متن جایگزین دقیق وارد کنید."),
    }),
    organizeCollection(Media, {
      group: label("Media", "رسانه‌ها"),
      singular: label("General media", "رسانه عمومی"),
      plural: label("General images", "تصاویر عمومی"),
      description: label("Images for pages, services, process, logos, and shared content.", "تصاویر صفحات اصلی، خدمات، فرآیند طراحی، لوگوها و محتوای عمومی سایت."),
    }),
    organizeCollection(BlogMedia, {
      group: label("Media", "رسانه‌ها"),
      singular: label("Blog image", "تصویر وبلاگ"),
      plural: label("Blog images", "تصاویر وبلاگ"),
      description: label("Featured and inline blog imagery.", "تصاویر شاخص و داخل مطالب وبلاگ."),
    }),
    organizeCollection(TeamMedia, {
      group: label("Media", "رسانه‌ها"),
      singular: label("Team image", "تصویر عضو تیم"),
      plural: label("Team images", "تصاویر اعضای تیم"),
      description: label("Portraits and team-related imagery.", "پرتره‌ها و تصاویر مرتبط با اعضای دفتر."),
    }),
    organizeCollection(AlefInquiries, {
      group: label("Audience communication", "ارتباط با مخاطبان"),
      singular: label("Inquiry", "درخواست همکاری"),
      plural: label("Received inquiries", "درخواست‌های دریافتی"),
      description: label("Messages submitted through the website contact form.", "پیام‌ها و درخواست‌های ثبت‌شده از فرم تماس سایت. اطلاعات تماس را پیش از پاسخ بررسی کنید."),
    }),
    organizeCollection(Users, {
      group: label("Administration", "مدیریت"),
      singular: label("User", "کاربر"),
      plural: label("Admin users", "کاربران پنل"),
      description: label("Admin accounts. Only administrators can manage roles.", "حساب‌های ورود به پنل. تغییر نقش و ساخت حساب جدید فقط برای مدیر اصلی مجاز است."),
    }),
    hideCollection(Documents),
    hideCollection(Pages),
    hideCollection(StaticPages),
    hideCollection(Projects),
    hideCollection(ProjectMedia),
    hideCollection(ProjectType),
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [
    organizeGlobal(
      LandingPage,
      label("Page content", "محتوای صفحات"),
      label("Home page", "صفحه اصلی"),
      label("Homepage copy, images, services, clients, and sections.", "متن‌ها، تصاویر، خدمات، مشتریان و بخش‌های صفحه اصلی."),
    ),
    organizeGlobal(
      AboutPage,
      label("Page content", "محتوای صفحات"),
      label("About page", "صفحه درباره ما"),
      label("Studio imagery and supporting about-page content.", "تصویر استودیو و توضیحات تکمیلی صفحه درباره دفتر."),
    ),
    organizeGlobal(
      ServicesPage,
      label("Page content", "محتوای صفحات"),
      label("Services page", "صفحه خدمات"),
      label("Architecture, interior, urban, supervision, and renovation services.", "معرفی خدمات معماری، داخلی، شهری، نظارت و بازسازی."),
    ),
    organizeGlobal(
      ProcessPage,
      label("Page content", "محتوای صفحات"),
      label("Design process page", "صفحه فرآیند طراحی"),
      label("Design stages from discovery through execution and supervision.", "مراحل طراحی از شناخت مسئله تا اجرا و نظارت."),
    ),
    organizeGlobal(
      Header,
      label("Site settings", "تنظیمات سایت"),
      label("Header and menu", "سربرگ و منو"),
      label("Main website navigation links.", "پیوندهای منوی اصلی سایت."),
    ),
    organizeGlobal(
      Footer,
      label("Site settings", "تنظیمات سایت"),
      label("Footer", "پابرگ سایت"),
      label("Footer navigation links.", "پیوندهای انتهای صفحات."),
    ),
    organizeGlobal(
      LandingBanner,
      label("Site settings", "تنظیمات سایت"),
      label("Site announcement", "اعلان سایت"),
      label("Optional temporary announcement displayed on the site.", "پیام یا اعلان موقت قابل نمایش در سایت."),
    ),
    SiteSettings,
  ],
  plugins: [
    s3Storage({
      collections: {
        documents: {
          prefix: "alef-cms/documents/public",
          disablePayloadAccessControl: true,
          generateFileURL: generatePublicFileURL,
        },
        "blog-media": {
          prefix: "alef-cms/blog",
          disablePayloadAccessControl: true,
          generateFileURL: generatePublicFileURL,
        },
        "project-media": {
          prefix: "alef-cms/projects/",
          disablePayloadAccessControl: true,
          generateFileURL: generatePublicFileURL,
        },
        "case-study-media": {
          prefix: "alef-cms/case-studies/",
          disablePayloadAccessControl: true,
          generateFileURL: generatePublicFileURL,
        },
        "team-media": {
          prefix: "alef-cms/team",
          disablePayloadAccessControl: true,
          generateFileURL: generatePublicFileURL,
        },
        media: {
          // You can use a prefix to keep files organized
          prefix: "alef-cms/general-media",
          disablePayloadAccessControl: true,
          generateFileURL: generatePublicFileURL,
        },
      },
      bucket: process.env.S3_BUCKET || "",

      config: {
        endpoint: storageEndpoint,
        forcePathStyle: true,

        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        region: process.env.S3_REGION,

        // ... Other S3 configuration
      },
    }),
    // betterLocalizedFields(),

    ...plugins,
  ],
  email: resendAdapter({
    defaultFromAddress: "info@alef-office.ir",
    defaultFromName: "Alef Architecture Office",
    apiKey: process.env.RESEND_API_KEY || "",
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  sharp,
  typescript: {
    // declare: false,
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true;

        const authHeader = req.headers.get("authorization");
        return authHeader === `Bearer ${process.env.CRON_SECRET}`;
      },
    },
    tasks: [],
  },
});
