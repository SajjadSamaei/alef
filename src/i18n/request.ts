import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import fa from "./messages/fa.json"; // base type reference

type Messages = typeof fa;

declare global {
  interface IntlMessages extends Messages {}
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale: locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
