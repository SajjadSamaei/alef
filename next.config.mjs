/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin({
  experimental: {
    // Provide the path to the messages that you're using in `AppConfig`
    createMessagesDeclaration: "./src/i18n/messages/en.json",
  },
  // ...
});

const nextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  experimental: {
    globalNotFound: true,
    turbopackFileSystemCacheForDev: true,
    viewTransition: true,
    webVitalsAttribution: ["CLS", "LCP"],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.alef-office.ir",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.c2.liara.site",
        port: "",
        pathname: "/chegall/**",
      },
      {
        protocol: "https",
        hostname: "storage.c2.liara.space",
        port: "",
        pathname: "/chegall/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
    ];
  },
  async redirects() {
    if (!process.env.POSTGRES_URL) return [];

    const client = new pg.Client({ connectionString: process.env.POSTGRES_URL });
    try {
      await client.connect();
      const { rows } = await client.query(`
        SELECT
          r."from" AS source,
          COALESCE(
            r.to_url,
            CASE
              WHEN rr.posts_id IS NOT NULL THEN '/blog/' || p.slug
              WHEN rr.pages_id IS NOT NULL THEN '/' || pg.slug
            END
          ) AS destination
        FROM redirects r
        LEFT JOIN redirects_rels rr
          ON rr.parent_id = r.id AND rr.path = 'to.reference'
        LEFT JOIN posts p ON p.id = rr.posts_id
        LEFT JOIN pages pg ON pg.id = rr.pages_id
      `);

      return rows
        .filter(({ source, destination }) => source && destination)
        .map(({ source, destination }) => ({
          source,
          destination,
          permanent: true,
        }));
    } catch (error) {
      console.warn("Could not load Payload redirects during build.", error);
      return [];
    } finally {
      await client.end().catch(() => undefined);
    }
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"], // Adds support for importing SVGs as React components
    });
    return config;
  },
  sassOptions: {
    // 1. Fix: Add specific Payload SCSS paths to help PNPM resolution
    includePaths: [
      path.join(__dirname, "node_modules"),
      path.join(__dirname, "node_modules/@payloadcms/ui/dist/scss"),
      path.join(__dirname, "node_modules/@payloadcms/ui/scss"),
    ],
    silenceDeprecations: ["legacy-js-api", "import"], // Add "import" to silence the warning
  },
};

export default withPayload(withNextIntl(nextConfig));
