import { redirect } from "@/src/i18n/routing";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CaseStudiesIndex({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({ href: "/portfolio/", locale: locale });
}
