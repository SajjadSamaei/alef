"use client";

import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { Offices } from "@/components/chegall/studio/Offices";
import clsx from "clsx";
import ChegallLogo from "@/public/logos/chegall/logotype-black.svg";
import ChegallEnglish from "@/public/logos/chegall/english-typography.svg";
import {
  FaPhone,
  FaWhatsapp,
  FaInstagram,
  FaTelegramPlane,
} from "react-icons/fa";
import { useTranslations, useLocale, useFormatter } from "next-intl";
import { Link } from "@/src/i18n/routing";

const contactMethods = [
  {
    platform: "Telephone", // Used for aria-label
    icon: <FaPhone color="#ffffff" className="h-5 w-5" />,
    link: "tel:+989177609917",
  },
  {
    platform: "WhatsApp",
    icon: <FaWhatsapp color="#ffffff" className="h-6 w-6" />,
    link: "https://wa.me/989177609917",
  },
  {
    platform: "Telegram",
    icon: <FaTelegramPlane color="#ffffff" className="h-6 w-6" />,
    link: "https://t.me/rasooldabirinasab",
  },
  {
    platform: "Instagram",
    icon: <FaInstagram color="#ffffff" className="h-6 w-6" />,
    link: "https://www.instagram.com/chegall_group",
  },
];

export function ContactSection() {
  const t = useTranslations("Contact");

  return (
    <Container className="mt-24 sm:mt-32 lg:mt-40">
      <FadeIn className="-mx-6 rounded-[40px] bg-neutral-950 px-6 py-20 sm:mx-0 sm:py-32 md:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-medium [text-wrap:balance] text-white sm:text-4xl">
              {t("title")}
            </h2>
            <div className="mt-6 flex">
              <Link
                href="/contact"
                className={clsx(
                  "inline-flex items-center rounded-full px-4 py-1.5 text-base font-semibold transition sm:text-sm",
                  "bg-white text-neutral-950 hover:bg-neutral-200",
                )}
              >
                {t("buttonLabel")}
              </Link>
            </div>
            <div className="mt-10 border-t border-white/10 pt-10">
              <h3 className="font-display text-base font-semibold text-white">
                {t("officeTitle")}
              </h3>
              {/* Ensure Offices handles its own translations internally */}
              <Offices
                invert
                className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2"
              />
            </div>
          </div>
        </div>
      </FadeIn>
    </Container>
  );
}

export function ContactChegall() {
  const locale = useLocale();
  const t = useTranslations("Contact");
  const format = useFormatter();

  // Determine Logo based on locale
  const LogoComponent = locale === "en" ? ChegallEnglish : ChegallLogo;

  return (
    <FadeIn>
      <div className={clsx("section-style")}>
        <div className="bg-jarounBlack ring-jarounBlack/5 grid grid-cols-1 gap-10 rounded-[40px] px-8 py-10 shadow-2xs ring-1 sm:grid-cols-3 lg:p-12">
          {/* Text Column */}
          <div
            className={clsx(
              "sm:col-span-2",
              // Layout shift for RTL/LTR
              locale === "fa" ? "sm:col-start-1" : "sm:col-start-2",
            )}
          >
            <h2 className="font-display text-center text-3xl font-medium [text-wrap:balance] text-white sm:text-4xl lg:text-start">
              {t("title")}
            </h2>

            {/* Social Icons */}
            <div className="mt-4 flex items-center justify-center gap-2 overflow-hidden rounded-3xl lg:max-w-[15rem] lg:justify-start lg:gap-4">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={method.platform}
                  className="hover:bg-jarounGray6/30 flex items-center justify-center rounded-4xl p-3 transition-colors"
                >
                  {method.icon}
                </a>
              ))}
            </div>

            <div className="mt-10 border-t border-white/10 pt-10">
              <h3 className="font-display text-base font-semibold text-white">
                {t("officeTitle")}
              </h3>

              <address className="text-sm text-white not-italic">
                <strong className="text-white">{t("office.city")}</strong>
                <br />
                {t("office.street1")}
                <br />
                {t("office.street2", { number: format.number(5) })}
              </address>
            </div>
          </div>

          {/* Logo Column */}
          <div
            className={clsx(
              "col-span-1 flex items-center justify-center",
              "border-t border-white/10 pt-10 md:border-none md:pt-0",
              // Layout shift for RTL/LTR
              locale === "fa"
                ? "sm:col-start-3"
                : "sm:col-start-1 sm:row-start-1",
            )}
          >
            <LogoComponent className="h-36 w-36 fill-white lg:h-40 lg:w-40" />
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
