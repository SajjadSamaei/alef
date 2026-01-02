import { redirect } from "@/src/i18n/routing";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TeamIndex({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({ href: "/about/", locale: locale });
}
