/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";
import path from "path";
import { fileURLToPath } from "url";

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
        hostname: "storage.c2.liara.space",
        port: "",
        pathname: "/chegall/**",
      },
    ],
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
