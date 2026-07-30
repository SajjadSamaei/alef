export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/management/", "/payload/", "/api/"],
    },
    sitemap: "https://alef-office.ir/sitemap.xml",
  };
}
