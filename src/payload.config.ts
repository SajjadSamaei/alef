import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import path from "path";
import { buildConfig, PayloadRequest } from "payload";
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

import { fa } from "@payloadcms/translations/languages/fa";
import { en } from "@payloadcms/translations/languages/en";
import { resendAdapter } from "@payloadcms/email-resend";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
    fallbackLanguage: "en", // default
  },

  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      // beforeLogin: ["@/payload/components/BeforeLogin"],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      // beforeDashboard: [
      //   "@/payload/components/BeforeDashboard",
      //   "@/payload/components/Inquiries/UnreadChegallInquiries",
      // ],
      // views: {
      //   login: {
      //     Component: "@/payload/components/CustomLogin", // Custom login component
      //   },
      // },
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
    Users,
    Documents,
    Authors,
    Tags,
    Pages,
    StaticPages,
    Posts,
    Categories,
    Media,
    BlogMedia,
    BlogCategories,
    CaseStudies,
    CaseStudyType,
    CaseStudyMedia,
    Projects,
    ProjectMedia,
    ProjectType,
    TeamMedia,
    Team,
    AlefInquiries,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [
    LandingPage,
    ServicesPage,
    ProcessPage,
    Header,
    Footer,
    LandingBanner,
  ],
  plugins: [
    s3Storage({
      collections: {
        documents: {
          prefix: "alef-cms/documents/public",
          disablePayloadAccessControl: true,
        },
        "blog-media": {
          prefix: "alef-cms/blog",
          disablePayloadAccessControl: true,
        },
        "project-media": {
          prefix: "alef-cms/projects/",
          disablePayloadAccessControl: true,
        },
        "case-study-media": {
          prefix: "alef-cms/case-studies/",
          disablePayloadAccessControl: true,
        },
        "team-media": {
          prefix: "alef-cms/team",
          disablePayloadAccessControl: true,
        },
        media: {
          // You can use a prefix to keep files organized
          prefix: "alef-cms/general-media",
          disablePayloadAccessControl: true,
        },
      },
      bucket: process.env.S3_BUCKET || "",

      config: {
        endpoint: process.env.S3_ENDPOINT || "",
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
    defaultFromAddress: "info@alef.com",
    defaultFromName: "Alef",
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
