"use client";
import { Link } from "@/src/i18n/routing"; // 1. Use locale-aware Link
import clsx from "clsx";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { Logo } from "@/components/chegall/studio/Logo";
import { useFormatter, useLocale, useTranslations } from "next-intl"; // 2. Import hooks
import { Offices } from "@/components/chegall/studio/Offices";
import JarounLogo from "@/public/logos/jaroun/logo-dark.svg";
import {
  FaPhone,
  FaWhatsapp,
  FaInstagram,
  FaTelegramPlane,
} from "react-icons/fa";

// This data is fine, as it contains no translatable text
const contactMethods = [
  {
    platform: "Tel",
    icon: <FaPhone color="#998B78" className="h-5 w-5" />,
    link: "tel:+989177609917",
  },
  {
    platform: "WhatsApp",
    icon: <FaWhatsapp color="#998B78" className="h-6 w-6" />,
    link: "https://wa.me/989177609917",
  },
  {
    platform: "Telegram",
    icon: <FaTelegramPlane color="#998B78" className="h-6 w-6" />,
    link: "https://t.me/rasooldabirinasab",
  },
  {
    platform: "Instagram",
    icon: <FaInstagram color="#998B78" className="h-6 w-6" />,
    link: "https://www.instagram.com/jaroun.building",
  },
];

// This component is not exported in the original, so it's likely a typo
// and 'ContactChegall' was intended. I've left it as is.
export function ContactJaroun() {
  const t = useTranslations("Project.Jaroun.Contact");
  const format = useFormatter();

  return (
    <FadeIn>
      <div className="section-style pb-24">
        <div className="lg:grid-col-3 bg-jarounGray7 ring-jarounBlack/5 grid grid-cols-1 gap-10 rounded-4xl px-8 py-10 shadow-2xs ring-1 sm:grid-cols-3 lg:p-12">
          <div className="sm:col-span-2">
            <h2 className="font-display text-3xl font-medium [text-wrap:balance] text-white sm:text-4xl">
              {t("title")}
            </h2>

            <div className="mt-4 flex justify-start gap-2 lg:gap-4">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-jarounGray6/30 flex items-center justify-center rounded-4xl p-3 transition-colors"
                >
                  <span>{method.icon}</span>
                </a>
              ))}
            </div>
            <div className="mt-10 border-t border-white/10 pt-10">
              <h3 className="font-display text-base font-semibold text-white">
                {t("office.title")}
              </h3>
              <address className="text-jarounVeryLight text-sm not-italic">
                <strong className="text-white">{t("office.city")}</strong>
                <br />
                {t("office.street1")}
                <br />
                {t("office.street2", { number: format.number(5) })}
              </address>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// 3. Fix prop types
export function JarounContactCTA({
  className,
  ...props
}: {
  className?: string;
  [key: string]: any;
}) {
  const t = useTranslations("Project.Jaroun.Contact");
  const format = useFormatter();

  return (
    <FadeIn {...props}>
      <div className={clsx("section-style", className)}>
        <div className="lg:grid-col-3 bg-jarounBlack ring-jarounBlack/5 grid grid-cols-1 gap-10 rounded-4xl px-8 py-10 shadow-2xs ring-1 sm:grid-cols-3 lg:p-12">
          <div className="sm:col-span-2">
            <h2 className="font-display text-center text-3xl font-medium [text-wrap:balance] text-white sm:text-4xl lg:text-start">
              {/* 4. Use logical property 'text-start' */}
              {t("linksTitle")}
            </h2>
            <div className="bg-appleTextBlack mt-4 flex items-center justify-center gap-2 overflow-hidden rounded-3xl lg:max-w-[15rem] lg:justify-start lg:gap-4">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-jarounGray6/30 flex items-center justify-center rounded-4xl p-3 transition-colors"
                >
                  <span>{method.icon}</span>
                </a>
              ))}
            </div>

            <div className="mt-10 border-t border-white/10 pt-10">
              <h3 className="font-display text-base font-semibold text-white">
                {t("office.title")}
              </h3>
              <address className="text-jarounVeryLight text-sm not-italic">
                <strong className="text-white">{t("office.city")}</strong>
                <br />
                {t("office.street1")}
                <br />
                {/* 5. Use formatter for numbers */}
                {t("office.street2", { number: format.number(5) })}
              </address>
            </div>
          </div>
          <div
            className={clsx(
              "col-span-1 flex items-center justify-center",
              "border-t border-white/10 pt-10 sm:border-none sm:pt-0",
            )}
          >
            <JarounLogo className="h-28 w-28 fill-[#998B78] sm:h-36 sm:w-36 lg:h-40 lg:w-40" />
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
