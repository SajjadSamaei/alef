import { useLocale } from "next-intl";
import localization from "@/src/i18n/localization";

export function useDirection() {
  const locale = useLocale();

  // Find the config for the current locale
  const localeConfig = localization.locales.find((l) => l.code === locale);

  // Return 'rtl' if rtl: true, otherwise 'ltr'
  return localeConfig?.rtl ? "rtl" : "ltr";
}

export function getDirection(locale: string): "rtl" | "ltr" {
  const localeConfig = localization.locales.find((l) => l.code === locale);

  // Return 'rtl' if the locale is found AND its 'rtl' property is true
  return localeConfig?.rtl ? "rtl" : "ltr";
}
