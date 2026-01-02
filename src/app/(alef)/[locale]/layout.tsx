import "../../globals.css";
import { locales } from "@/src/i18n/i18n.config";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { Locale, NextIntlClientProvider } from "next-intl";
import QueryProvider from "@/utils/stores/QueryProvider";
import GoogleAnalytics from "@/utils/analytics/GoogleAnalytics";
import MicrosoftClarity from "@/utils/analytics/Clarity";
import { IBM_Plex_Sans, Vazirmatn } from "next/font/google";
import { RootLayout as ChegallRootLayout } from "@/components/chegall/studio/RootLayout";
import { getDirection } from "@/utils/hooks/useDirection";
import { splashScreens } from "@/utils/metadata/splashScreens";
import { Suspense } from "react";

const vazir = Vazirmatn({ subsets: ["arabic"] });
const inter = IBM_Plex_Sans({ subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Args = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

// ... (Keep your generateMetadata function exactly as it is) ...
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Metadata.Home",
  });
  const ogLocale = locale === "fa" ? "fa_IR" : "en_US";

  return {
    metadataBase: new URL("https://chegall.com"),
    title: {
      template: t("titleTemplate"),
      default: t("titleDefault"),
    },
    category: "business",
    creator: "Sajjad Samaei",
    generator: "Next.js",
    keywords: t.raw("keywords"),
    description: t("description"),
    manifest: `/manifest.webmanifest`,
    openGraph: {
      title: t("og.title"),
      description: t("og.description"),
      url: `https://chegall.com/${locale === "fa" ? "" : locale}`,
      siteName: "Chegall",
      images: [
        {
          url: "https://storage.c2.liara.space/chegall/images/chegall-banner-wide.png",
          width: 1200,
          height: 628,
          alt: t("og.imageAlt"),
        },
        {
          url: "https://storage.c2.liara.space/chegall/images/chegall-banner-square.png",
          width: 1080,
          height: 1080,
          alt: t("og.imageAlt"),
        },
      ],
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitter.title"),
      description: t("twitter.description"),
      images: [
        "https://storage.c2.liara.space/chegall/images/chegall-twitter-card.png",
      ],
    },
    appleWebApp: {
      capable: true,
      title: t("appleWebApp.title"),
      statusBarStyle: "black-translucent",
      startupImage: splashScreens,
    },
    other: { "apple-mobile-web-app-capable": "yes" },
  };
}

export default async function RootLayout({ children, params }: Args) {
  const { locale } = await params;
  if (!locales.includes(locale as any)) {
    notFound();
  }
  setRequestLocale(locale);

  const direction = getDirection(locale);
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: "JsonLd.Home" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("name"),
    address: {
      "@type": "PostalAddress",
      streetAddress: t("address.streetAddress"),
      addressLocality: t("address.addressLocality"),
      postalCode: t("address.postalCode"),
      addressRegion: t("address.addressRegion"),
      addressCountry: t("address.addressCountry"),
    },
    url: "https://chegall.com",
    brand: "Chegall",
    logo: "https://chegall.com/logo/chegall-logo-white.png",
    foundingDate: "2024",
    founder: "Rasoul Dabiri",
    keywords: t("keywords"),
    skills: t("skills"),
    slogan: t("slogan"),
    foundingLocation: t("address.addressLocality"),
    ContactPoint: {
      "@type": "ContactPoint",
      telephone: "+989177609917",
      hoursAvailable: "Sat-Tue 08:00-15:00",
      availableLanguage: t("availableLanguage"),
      email: "info@chegall.com",
      contactType: "sales",
    },
    image:
      "https://storage.c2.liara.space/chegall/images/chegall-banner-square.png",
    description: t("description"),
  };

  return (
    <html
      lang={locale}
      dir={direction}
      className={locale === "fa" ? vazir.className : inter.className}
      suppressHydrationWarning
    >
      <body>
        <QueryProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ChegallRootLayout>{children}</ChegallRootLayout>
          </NextIntlClientProvider>
        </QueryProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <Suspense fallback={null}>
          <MicrosoftClarity />
        </Suspense>
      </body>
    </html>
  );
}
