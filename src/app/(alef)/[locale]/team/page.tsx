import { redirect } from "@/src/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { requireEnabledPage } from "@/payload/utilities/siteSettings";
import type { TypedLocale } from "payload";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TeamIndex({ params }: Props) {
  const { locale } = await params;
  await requireEnabledPage("team", locale as TypedLocale);
  setRequestLocale(locale);
  redirect({ href: "/about/", locale: locale });
}
