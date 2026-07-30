import localization from "@/src/i18n/localization";
import type { TypedLocale } from "payload";

export const availableLocales = localization.locales.map(
  (l) => l.code,
) as TypedLocale[];

export function isTypedLocale(locale: string): locale is TypedLocale {
  return availableLocales.includes(locale as TypedLocale);
}
