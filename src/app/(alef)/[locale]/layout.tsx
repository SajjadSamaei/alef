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
import { PWARegistration } from "@/components/PWARegistration";
import type { Viewport } from "next";
import { getSiteSettings } from "@/payload/utilities/siteSettings";
import type { TypedLocale } from "payload";

const vazir = Vazirmatn({ subsets: ["arabic"] });
const inter = IBM_Plex_Sans({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#ffffff" },
  ],
  colorScheme: "light dark",
  viewportFit: "cover", // <--- THIS IS REQUIRED FOR TRANSLUCENT STATUS BARS
};

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
    metadataBase: new URL("https://alef-office.ir"),
    title: {
      template: t("titleTemplate"),
      default: t("titleDefault"),
    },
    category: "business",
    creator: "Alef Architecture Office",
    generator: "Next.js",
    keywords: t.raw("keywords"),
    description: t("description"),
    manifest: `/manifest.webmanifest`,
    openGraph: {
      title: t("og.title"),
      description: t("og.description"),
      url: `https://alef-office.ir/${locale === "fa" ? "" : locale}`,
      siteName: "Alef Architecture Office",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitter.title"),
      description: t("twitter.description"),
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
  const [messages, t, siteSettings] = await Promise.all([
    getMessages({ locale }),
    getTranslations({ locale, namespace: "JsonLd.Home" }),
    getSiteSettings(locale as TypedLocale),
  ]);

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
    url: "https://alef-office.ir",
    brand: "Alef Architecture Office",
    logo: "https://alef-office.ir/logos/app/app-logo.png",
    founder: "Homayoun Hosseinzadeh",
    keywords: t("keywords"),
    skills: t("skills"),
    slogan: t("slogan"),
    foundingLocation: t("address.addressLocality"),
    ContactPoint: {
      "@type": "ContactPoint",
      telephone: siteSettings.contact?.phone,
      hoursAvailable: siteSettings.contact?.workingHours,
      availableLanguage: t("availableLanguage"),
      email: siteSettings.contact?.email,
      contactType: "project inquiries",
    },
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
        <PWARegistration />
        <QueryProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ChegallRootLayout settings={siteSettings}>
              {children}
            </ChegallRootLayout>
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
