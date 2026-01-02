import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Footer } from "@/components/chegall/studio/Footer";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import { AboutUs } from "@/components/Landing/About";
import { Partners } from "@/components/Landing/Partners";
import Hero from "@/components/Landing/hero";
import { Testimonial } from "@/components/Landing/Testimonial";
import ProjectShowcase from "@/components/Landing/projects";
import BlogSpotlight from "@/components/Blog/UI/Spotlight/blog-spotlight";
import { withI18nMetadata } from "@/src/i18n/i18nMetadata";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales, defaultLocale } from "@/src/i18n/i18n.config";
import { Suspense } from "react";
import { ServicesGrid } from "@/components/Landing/ServicesGrid";
import { Media, LandingPage } from "@/src/payload-types";

type Locale = (typeof locales)[number];

type Props = {
  params: Promise<{ locale: Locale }>;
};

type MediaSize = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
};

// 2. Updated getUrl function
const getUrl = (
  media: number | Media | undefined | null,
  size?: keyof NonNullable<Media["sizes"]>,
) => {
  // 1. Basic validation
  if (!media || typeof media !== "object" || !media.url) return "";

  // 2. Check if specific size exists
  if (size && media.sizes) {
    // Cast to Record to allow dynamic access with [size]
    const sizes = media.sizes as Record<string, MediaSize | undefined>;
    const requestedSize = sizes[size];

    if (requestedSize?.url) {
      return requestedSize.url;
    }
  }

  // 3. Fallback to original
  return media.url;
};

async function getLandingPageData(): Promise<LandingPage> {
  const payload = await getPayload({ config: configPromise });

  // Cast the result to LandingPage type
  return (await payload.findGlobal({
    slug: "landing-page",
    depth: 1, // Depth 1 is required to get image URLs
  })) as LandingPage;
}

// 1. Generate static params for 'en' and 'fa'
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 2. Generate dynamic, localized metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Metadata.Home" });
  const ogLocale = locale === "fa" ? "fa_IR" : "en_US";
  const i18nMeta = await withI18nMetadata(params);
  const landingData = await getLandingPageData();

  const masterImage = landingData.metadata?.metaImage;

  return {
    title: {
      absolute: t("title"),
    },
    category: "business",
    creator: "Sajjad Samaei",
    generator: "Next.js",
    keywords: t.raw("keywords"),
    description: t("description"),
    ...i18nMeta,
    openGraph: {
      title: t("title"),
      description: t("description"),
      url:
        locale === defaultLocale
          ? "https://chegall.com"
          : `https://chegall.com/${locale}`,
      siteName: "Chegall",
      images: [
        {
          url: getUrl(masterImage, "og"),
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
      title: t("title"),
      description: t("description"),
      images: [getUrl(masterImage, "twitter")],
    },
    appleWebApp: {
      capable: true,
      title: t("appleWebAppTitle"),
      statusBarStyle: "black-translucent",
    },
    other: { "apple-mobile-web-app-capable": "yes" },
  };
}

// 3. 👇 Update the component to be Async and accept Params
export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const payload = await getPayload({ config: configPromise });
  const landingData = await payload.findGlobal({
    slug: "landing-page",
    depth: 1, // Ensure we get media objects, not just IDs
  });

  return (
    <div className="overflow-hidden bg-white">
      <Hero />
      {/* <LandingBanner /> */}
      <div className="section-padding" />
      <FadeIn>
        <Suspense>
          <ProjectShowcase locale={locale as any} />
        </Suspense>
      </FadeIn>

      <div className="section-padding" />
      <Suspense>
        <AboutUs image={landingData?.about?.image} />
      </Suspense>
      <div className="section-padding-xl" />

      <Suspense>
        <Container>
          <ServicesGrid data={landingData.services} />
        </Container>
      </Suspense>

      <Suspense>
        <Container>
          <Partners data={landingData.partners} />
        </Container>
      </Suspense>

      <Suspense>
        <BlogSpotlight />
      </Suspense>

      <Suspense>
        <Testimonial data={landingData.testimonial} />
      </Suspense>
      <div className="section-padding" />

      <Footer />
    </div>
  );
}
