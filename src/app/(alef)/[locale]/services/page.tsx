import { Container } from "@/components/chegall/studio/Container";
import { GradientComponent } from "@/components/chegall/radient/gradient";
import { TypingAnimation } from "@/components/ui/magicui/typing-animation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/src/i18n/i18n.config";
import { ServicesGrid } from "@/components/chegall/services/services-grid";
import {
  Architecture,
  InteriorDesign,
  UrbanDesign,
  Supervision,
  Restoration,
  Process,
} from "@/components/chegall/services/services-details";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { ServicesPage } from "@/src/payload-types";

type Locale = (typeof locales)[number];

type Props = {
  params: Promise<{ locale: Locale }>;
};

async function getServicesPageData(): Promise<ServicesPage> {
  const payload = await getPayload({ config: configPromise });
  return (await payload.findGlobal({
    slug: "services-page",
    depth: 1,
  })) as ServicesPage;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.Services" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function Services({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // ✅ 1. Fetch Data
  const servicesData = await getServicesPageData();
  const t = await getTranslations("ServicesPage.Hero");

  return (
    <>
      {/* 1. Gradient Hero */}
      <div className="section-style relative mt-10 lg:mt-10">
        <GradientComponent className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
        <Container className="relative">
          <div className="flex flex-col items-center justify-center gap-6 pt-24 pb-32 md:pt-32 md:pb-48">
            <div className="flex items-center justify-center px-4">
              <TypingAnimation className="font-display text-center text-5xl font-medium tracking-tight text-neutral-950 sm:text-7xl md:text-8xl">
                {t("title")}
              </TypingAnimation>
            </div>
            <p className="max-w-xl text-center text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
              {t("description")}
            </p>
          </div>
        </Container>
      </div>

      {/* 2. Bento Grid */}
      <div className="mt-16 sm:mt-24">
        <Container>
          {/* ✅ Pass Data */}
          <ServicesGrid data={servicesData} />
        </Container>
      </div>

      {/* 3. Detailed Sections */}
      <div className="mt-24 space-y-32 [counter-reset:section] sm:mt-32 sm:space-y-40 lg:mt-40 lg:space-y-64">
        {/* ✅ Pass Data */}
        <Architecture media={servicesData.architecture?.image} />
        <InteriorDesign media={servicesData.interior?.image} />
        <UrbanDesign media={servicesData.urban?.image} />
        <Supervision media={servicesData.supervision?.image} />
        <Restoration media={servicesData.restoration?.image} />
      </div>

      {/* 4. Process & Contact */}
      <Process />

      <div className="section-padding" />
    </>
  );
}
