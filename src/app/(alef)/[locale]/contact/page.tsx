import { Suspense } from "react";
import Link from "next/link";
import ChegallLocationMap from "@/components/chegall/map/chegall-location";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { Offices } from "@/components/chegall/studio/Offices";
import { SocialMedia } from "@/components/chegall/studio/SocialMedia";
import { Container } from "@/components/chegall/studio/Container";
import { Border } from "@/components/chegall/studio/Border";
import { GradientComponent } from "@/components/chegall/radient/gradient";
import { TypingAnimation } from "@/components/ui/magicui/typing-animation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/src/i18n/i18n.config";
import { getSiteSettings, getStaticPageMetadata, requireEnabledPage } from "@/payload/utilities/siteSettings";
import type { TypedLocale } from "payload";
import type { PublicSiteSettings } from "@/src/types/site-settings";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdEmail, MdLocalPhone } from "react-icons/md";

type Locale = (typeof locales)[number];

type Props = {
  params: Promise<{ locale: Locale }>;
};

// 1. Static Generation
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 2. Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.Contact" });
  const settings = await getSiteSettings(locale as TypedLocale);
  return getStaticPageMetadata({ settings, page: "contact", fallbackTitle: t("title"), fallbackDescription: t("description") });
}

// --- Server Components ---

const digitsOnly = (value?: string | null) => value?.replace(/\D/g, "") || "";
const toPersianDigits = (value: string) =>
  value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

const localizedContactValue = (value: string, locale: Locale) =>
  locale === "fa" ? toPersianDigits(value) : value;

const toWhatsAppHref = (value?: string | null) => {
  if (!value) return "";
  if (/^https?:\/\//.test(value)) return value;
  const digits = digitsOnly(value);
  return digits ? `https://wa.me/${digits.replace(/^0/, "98")}` : value;
};

async function DirectContactActions({ locale, settings }: { locale: Locale; settings: PublicSiteSettings }) {
  const t = await getTranslations("Contact.Direct");
  const email = settings.contact?.email;
  const officePhone = settings.contact?.phone;
  const mobilePhones = settings.contact?.mobilePhones?.filter((item) => item?.number) || [];
  const whatsapp = settings.social?.whatsapp || mobilePhones[0]?.number;
  const instagram = settings.social?.instagram;

  const cards = [
    email && {
      label: t("email"),
      value: email,
      displayValue: email,
      href: `mailto:${email}`,
      icon: MdEmail,
    },
    officePhone && {
      label: t("officePhone"),
      value: officePhone,
      displayValue: localizedContactValue(officePhone, locale),
      href: `tel:${digitsOnly(officePhone) || officePhone}`,
      icon: MdLocalPhone,
    },
    ...mobilePhones.map((item) => ({
      label: t("mobile"),
      value: item.number || "",
      displayValue: localizedContactValue(item.number || "", locale),
      href: `tel:${digitsOnly(item.number) || item.number}`,
      icon: MdLocalPhone,
    })),
    whatsapp && {
      label: t("whatsapp"),
      value: whatsapp.replace(/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//, ""),
      displayValue: localizedContactValue(
        whatsapp.replace(/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//, ""),
        locale,
      ),
      href: toWhatsAppHref(whatsapp),
      icon: FaWhatsapp,
    },
    instagram && {
      label: t("instagram"),
      value: instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, ""),
      displayValue: instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, ""),
      href: instagram.startsWith("http") ? instagram : `https://www.instagram.com/${instagram.replace(/^@/, "")}`,
      icon: FaInstagram,
    },
  ].filter(Boolean);

  return (
    <FadeIn>
      <section className="rounded-[32px] border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:p-10 dark:border-white/10 dark:bg-neutral-950">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t("description")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cards.map((card, index) => {
            if (!card) return null;
            const Icon = card.icon;
            return (
              <Link
                key={`${card.label}-${index}`}
                href={card.href}
                className="group flex min-h-28 items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-950 dark:border-white/10 dark:bg-neutral-900 dark:hover:border-white"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {card.label}
                  </span>
                  <span className="mt-1 block break-words text-base font-semibold text-neutral-950 dark:text-white">
                    {card.displayValue}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </FadeIn>
  );
}

// This component fetches its own data. This is valid and efficient in RSC.
async function ContactDetails({ locale, settings }: { locale: Locale; settings: PublicSiteSettings }) {
  const t = await getTranslations({ locale, namespace: "Contact.Details" });

  return (
    <div className="flex flex-col gap-10">
      <FadeIn>
        <h2 className="font-display text-lg font-semibold text-neutral-950 dark:text-white">
          {t("ourOffice")}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
          {t("officeDescription")}
        </p>
        <Offices settings={settings} className="mt-8 grid grid-cols-1 gap-8" />
      </FadeIn>

      <Border position="top" className="pt-10">
        <FadeIn>
          <h2 className="font-display text-lg font-semibold text-neutral-950 dark:text-white">
            {t("emailTitle")}
          </h2>
          <dl className="mt-4 grid grid-cols-1 gap-8 text-sm">
            <div>
              <dt className="sr-only">Email</dt>
              <dd>
                <Link
                  href={`mailto:${settings.contact?.email}`}
                  className="font-medium text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                >
                  {settings.contact?.email}
                </Link>
              </dd>
            </div>
          </dl>
        </FadeIn>
      </Border>

      <Border position="top" className="pt-10">
        <FadeIn>
          <h2 className="font-display text-lg font-semibold text-neutral-950 dark:text-white">
            {t("followTitle")}
          </h2>
          <SocialMedia settings={settings} className="mt-4" />
        </FadeIn>
      </Border>
    </div>
  );
}

function CinematicMap({ tLoading }: { tLoading: string }) {
  return (
    <FadeIn>
      <div className="group relative h-96 w-full overflow-hidden rounded-[40px] shadow-2xl ring-1 shadow-neutral-950/5 ring-neutral-950/5 sm:h-[32rem] lg:h-[40rem] dark:ring-white/10">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              {tLoading}
            </div>
          }
        >
          <ChegallLocationMap />
        </Suspense>
        {/* Subtle Vignette Overlay for Cinema Look */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
    </FadeIn>
  );
}

// --- Page ---

export default async function Contact({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [tHero, settings] = await Promise.all([
    getTranslations("Contact.Hero"),
    requireEnabledPage("contact", locale as TypedLocale),
  ]);

  return (
    <>
      {/* 1. Hero */}
      <div className="section-style relative mt-10 lg:mt-10">
        <GradientComponent className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
        <Container className="relative">
          <div className="flex flex-col items-center justify-center gap-6 pt-24 pb-32 md:pt-32 md:pb-48">
            <div className="flex items-center justify-center px-4">
              <TypingAnimation className="font-display text-center text-5xl font-medium tracking-tight text-neutral-950 sm:text-7xl md:text-8xl">
                {tHero("title")}
              </TypingAnimation>
            </div>
            <p className="max-w-xl text-center text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
              {tHero("description")}
            </p>
          </div>
        </Container>
      </div>

      <Container className="mt-20 lg:mt-32">
        {/* 2. Content Grid */}
        <div className="grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <DirectContactActions locale={locale} settings={settings} />
          </div>

          {/* Details (Minor Column - Sticky) */}
          <div className="lg:col-span-5 lg:pl-8 xl:col-span-4">
            <div className="lg:sticky lg:top-12">
              <ContactDetails locale={locale} settings={settings} />
            </div>
          </div>
        </div>

        {/* 3. Cinematic Map */}
        <div className="mt-32 mb-24">
          <div className="mb-10 px-2">
            <h2 className="font-display text-2xl font-semibold text-neutral-950 dark:text-white">
              {tHero("mapTitle")}{" "}
              {/* Ensure you add this key to your translation file */}
            </h2>
          </div>
          <CinematicMap tLoading={tHero("loadingMap")} />
        </div>
      </Container>
    </>
  );
}
