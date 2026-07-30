import type { Metadata } from "next";
import { i18n } from "@/src/i18n/i18n.config";

function buildPathnameFromParams(params: Record<string, any>): string {
  const entries = Object.entries(params).filter(([key]) => key !== "locale");
  return entries.length === 0
    ? "/"
    : "/" + entries.map(([_, value]) => String(value)).join("/");
}

export async function withI18nMetadata(
  paramsOrPromise: Record<string, any> | Promise<Record<string, any>>,
): Promise<Metadata> {
  // Support both Promise and plain object
  const params =
    paramsOrPromise instanceof Promise
      ? await paramsOrPromise
      : paramsOrPromise;

  const { locales, defaultLocale, domain } = i18n;
  const locale = params.locale;

  if (!locale) {
    console.warn("withI18nMetadata: No locale found in params");
    return {};
  }

  const pathname = buildPathnameFromParams(params);

  const languages: Record<string, string> = {};

  for (const loc of locales) {
    languages[loc] = `${domain}/${loc}${pathname}`;
  }
  languages["x-default"] = `${domain}/${defaultLocale}${pathname}`;

  return {
    alternates: {
      canonical: `${domain}/${locale}${pathname}`,
      languages,
    },
  };
}
