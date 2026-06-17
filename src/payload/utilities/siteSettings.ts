import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { TypedLocale } from "payload";
import type { Media, SiteSetting } from "@/src/payload-types";
import { getCachedGlobal } from "./getGlobals";

export type PublicPage =
  | "portfolio"
  | "services"
  | "process"
  | "about"
  | "blog"
  | "contact"
  | "team";

export async function getSiteSettings(locale?: TypedLocale) {
  return getCachedGlobal("site-settings", 1, locale)() as Promise<SiteSetting>;
}

export async function requireEnabledPage(
  page: PublicPage,
  locale?: TypedLocale,
) {
  const settings = await getSiteSettings(locale);
  if (settings.pages?.[page] === false) notFound();
  return settings;
}

const mediaURL = (media?: number | Media | null) =>
  typeof media === "object" && media?.url ? media.url : undefined;

export function getStaticPageMetadata({
  settings,
  page,
  fallbackTitle,
  fallbackDescription,
}: {
  settings: SiteSetting;
  page:
    | "home"
    | "portfolio"
    | "services"
    | "process"
    | "about"
    | "blog"
    | "contact";
  fallbackTitle: string;
  fallbackDescription: string;
}): Metadata {
  const pageSEO = settings.seo?.[page];
  const title = pageSEO?.title || fallbackTitle;
  const description =
    pageSEO?.description ||
    settings.seo?.defaultDescription ||
    fallbackDescription;
  const image =
    mediaURL(pageSEO?.image) || mediaURL(settings.seo?.defaultImage);
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
