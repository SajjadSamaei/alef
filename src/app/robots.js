export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/management/", "/manifest.webmanifest", "/admin"],
    },
    sitemap: "https://chegall.com/sitemap.xml",
  };
}
