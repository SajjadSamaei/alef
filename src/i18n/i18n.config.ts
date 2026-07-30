// src/i18n.config.ts
export const locales = ["fa", "en"] as const;
export const defaultLocale = "fa" as const; // <-- Set Farsi as default
export const localePrefix = "as-needed" as const; // <-- Use 'as-needed'

export const ogLocaleMap: Record<string, string> = {
  en: "en_US",
  fa: "fa_IR",
  es: "es_ES", // Example: Spanish
  ar: "ar_AE", // Example: Arabic
  de: "de_DE", // Example: German
  // Add all other locales you plan to support
};

export const localization = {
  locales: [
    { code: "en", name: "English" },
    { code: "fa", name: "فارسی" },
    { code: "es", name: "Español" },
    { code: "ar", name: "العربية" },
    { code: "de", name: "Deutsch" },
  ],
  defaultLocale: "en",
};

export const defaultOgLocale = "en_US";

export const i18n = {
  locales: ["en", "fa"],
  defaultLocale: "fa",
  domain: process.env.NEXT_PUBLIC_SITE_URL || "https://alef-office.ir",
};
