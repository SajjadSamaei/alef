import { useLocale } from "next-intl";
import localization from "@/src/i18n/localization";
import type { TypedLocale } from "payload"; // Or your i18n.config type

export function useDirection() {
  const locale = useLocale() as TypedLocale; // Get current locale

  // Find the config for the current locale
  const localeConfig = localization.locales.find((l) => l.code === locale);

  // Return 'rtl' if rtl: true, otherwise 'ltr'
  return localeConfig?.rtl ? "rtl" : "ltr";
}
