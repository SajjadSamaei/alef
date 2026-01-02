import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alef",
    short_name: "Alef",
    description:
      "Alef, more than an architectural studio, offers a new perspective on 'designing for life'",
    start_url: "/",
    display: "standalone",

    background_color: "#ffcba3",
    theme_color: "#ffcba3",

    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
