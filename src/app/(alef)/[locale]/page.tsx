import { TypedLocale } from "payload";
import { Footer } from "@/components/chegall/studio/Footer";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { AboutUs } from "@/components/Landing/About";
import { Partners } from "@/components/Landing/Partners";
import Hero from "@/components/Landing/hero";
import { Testimonial } from "@/components/Landing/Testimonial";
import ProjectShowcase, { ProjectShowcaseSkeleton } from "@/components/Landing/projects";
import { withI18nMetadata } from "@/src/i18n/i18nMetadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales, defaultLocale } from "@/src/i18n/i18n.config";
import { Suspense } from "react";
import { Media, LandingPage } from "@/src/payload-types";
import { getCachedGlobal } from "@/payload/utilities/getGlobals";
import {
  getSiteSettings,
  getStaticPageMetadata,
} from "@/payload/utilities/siteSettings";

type Locale = (typeof locales)[number];

type Props = {
  params: Promise<{ locale: Locale }>;
};

type MediaSize = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
};

const getUrl = (
  media: number | Media | undefined | null,
  size?: keyof NonNullable<Media["sizes"]>,
) => {
  if (!media || typeof media !== "object" || !media.url) return "";

  if (size && media.sizes) {
    const sizes = media.sizes as Record<string, MediaSize | undefined>;
    const requestedSize = sizes[size];

    if (requestedSize?.url) {
      return requestedSize.url;
    }
  }

  return media.url;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Metadata.Home" });
  const ogLocale = locale === "fa" ? "fa_IR" : "en_US";
  const i18nMeta = await withI18nMetadata(params);
  const [landingData, siteSettings] = await Promise.all([
    getCachedGlobal("landing-page", 1, locale as TypedLocale)() as Promise<LandingPage>,
    getSiteSettings(locale as TypedLocale),
  ]);

  const masterImage = landingData.metadata?.metaImage;
  const managedMetadata = getStaticPageMetadata({
    settings: siteSettings,
    page: "home",
    fallbackTitle: t("title"),
    fallbackDescription: t("description"),
  });
  const managedTitle =
    typeof managedMetadata.title === "string"
      ? managedMetadata.title
      : t("title");
  const managedDescription =
    managedMetadata.description || t("description");
  const managedImage =
    managedMetadata.openGraph &&
    "images" in managedMetadata.openGraph &&
    Array.isArray(managedMetadata.openGraph.images)
      ? managedMetadata.openGraph.images[0]
      : undefined;
  const managedImageURL =
    typeof managedImage === "string"
      ? managedImage
      : managedImage && "url" in managedImage
        ? managedImage.url
        : undefined;

  return {
    title: {
      absolute: managedTitle,
    },
    category: "business",
    creator: "Alef Architecture Office",
    generator: "Next.js",
    keywords: t.raw("keywords"),
    description: managedDescription,
    ...i18nMeta,
    openGraph: {
      title: managedTitle,
      description: managedDescription,
      url:
        locale === defaultLocale
          ? "https://alef-office.ir"
          : `https://alef-office.ir/${locale}`,
      siteName: siteSettings.seo?.siteName || "Alef Architecture Office",
      images: [
        {
          url: managedImageURL || getUrl(masterImage, "og"),
          width: 1200,
          height: 630,
          alt: t("imageAlt"),
        },
        {
          url: getUrl(masterImage, "square"),
          width: 1080,
          height: 1080,
          alt: t("imageAlt"),
        },
      ],
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: managedTitle,
      description: managedDescription,
      images: [managedImageURL || getUrl(masterImage, "twitter")],
    },
    appleWebApp: {
      capable: true,
      title: t("appleWebAppTitle"),
      statusBarStyle: "black-translucent",
    },
    other: { "apple-mobile-web-app-capable": "yes" },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [landingData, siteSettings] = await Promise.all([
    getCachedGlobal("landing-page", 1, locale as TypedLocale)() as Promise<LandingPage>,
    getSiteSettings(locale as TypedLocale),
  ]);

  return (
    <div className="overflow-hidden bg-white">
      <Hero content={landingData.hero} settings={siteSettings} />
      
      <FadeIn>
        <Suspense fallback={<ProjectShowcaseSkeleton />}>
          <ProjectShowcase
            locale={locale as any}
            content={landingData.projectsCopy}
          />
        </Suspense>
      </FadeIn>

      <Suspense>
        <AboutUs data={landingData.about} />
      </Suspense>

      <Suspense>
        <Container>
          <Partners
            data={landingData.partners}
            title={landingData.partnersTitle}
          />
        </Container>
      </Suspense>

      <Suspense>
        <Testimonial data={landingData.testimonial} />
      </Suspense>

      <Footer settings={siteSettings} />
    </div>
  );
}
