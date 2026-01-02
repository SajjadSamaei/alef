// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/src/i18n/routing";

export default createMiddleware({
  ...routing,
  localeDetection: false,
});

export const config = {
  matcher: [
    "/",
    "/(fa|en)/:path*",
    "/((?!_next|_static|_vercel|api|payload|.*\\..*).*)",
    "/(.*)/manifest.webmanifest",
  ],
};
