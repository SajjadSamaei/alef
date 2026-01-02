import React from "react";
import { Link } from "@/src/i18n/routing";
import { useTranslations, useFormatter } from "next-intl";
import { RecentWorks } from "@/components/Layout/Footer/RecentWorks";

// --- Design System Imports ---
import {
  PlusGrid,
  PlusGridItem,
  PlusGridRow,
} from "@/components/chegall/radient/plus-grid";
import { ButtonCustomColor } from "@/components/ui/button";
import { Container } from "@/components/chegall/studio/Container";
import { Gradient } from "@/components/chegall/radient/gradient";
import { Logo } from "@/components/chegall/radient/logo";

function SocialIconX(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M12.6 0h2.454l-5.36 6.778L16 16h-4.937l-3.867-5.594L2.771 16H.316l5.733-7.25L0 0h5.063l3.495 5.114L12.6 0zm-.86 14.376h1.36L4.323 1.539H2.865l8.875 12.837z" />
    </svg>
  );
}

function SocialIconFacebook(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 8.05C16 3.603 12.418 0 8 0S0 3.604 0 8.05c0 4.016 2.926 7.346 6.75 7.95v-5.624H4.718V8.05H6.75V6.276c0-2.017 1.194-3.131 3.022-3.131.875 0 1.79.157 1.79.157v1.98h-1.008c-.994 0-1.304.62-1.304 1.257v1.51h2.219l-.355 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.95z"
      />
    </svg>
  );
}

function SocialIconLinkedIn(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M14.82 0H1.18A1.169 1.169 0 000 1.154v13.694A1.168 1.168 0 001.18 16h13.64A1.17 1.17 0 0016 14.845V1.15A1.171 1.171 0 0014.82 0zM4.744 13.64H2.369V5.996h2.375v7.644zm-1.18-8.684a1.377 1.377 0 11.52-.106 1.377 1.377 0 01-.527.103l.007.003zm10.075 8.683h-2.375V9.921c0-.885-.015-2.025-1.234-2.025-1.218 0-1.425.966-1.425 1.968v3.775H6.233V5.997H8.51v1.05h.032c.317-.601 1.09-1.235 2.246-1.235 2.405-.005 2.851 1.578 2.851 3.63v4.197z" />
    </svg>
  );
}

function SocialLinks() {
  const t = useTranslations("Footer.Navigation.social");

  return (
    <>
      <Link
        href="https://facebook.com"
        target="_blank"
        aria-label={t("facebook")}
        className="text-gray-950 transition-opacity hover:opacity-75 data-hover:text-gray-950/75"
      >
        <SocialIconFacebook className="size-4" />
      </Link>
      <Link
        href="https://x.com"
        target="_blank"
        aria-label={t("twitter")}
        className="text-gray-950 transition-opacity hover:opacity-75 data-hover:text-gray-950/75"
      >
        <SocialIconX className="size-4" />
      </Link>
      <Link
        href="https://linkedin.com"
        target="_blank"
        aria-label={t("instagram")}
        className="text-gray-950 transition-opacity hover:opacity-75 data-hover:text-gray-950/75"
      >
        <SocialIconLinkedIn className="size-4" />
      </Link>
    </>
  );
}

function CallToAction() {
  const t = useTranslations("Footer.CTA");

  return (
    <div className="relative pt-20 pb-16 text-center sm:py-24">
      <hgroup>
        <p className="eyebrow-style">{t("subheading")}</p>
        <p className="mt-6 text-3xl font-medium tracking-tight text-gray-950 sm:text-5xl">
          {t("title")}
        </p>
      </hgroup>
      <p className="mx-auto mt-6 max-w-xs text-sm/6 text-gray-500">
        {t("heading")}
      </p>
      <div className="mt-6">
        <div className="mt-10 flex justify-center">
          <Link
            href="/contact"
            className="rounded-full px-8 py-3 text-sm font-semibold text-neutral-950 bg-blend-multiply transition hover:bg-neutral-200"
          >
            {t("button")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function SitemapHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm/6 font-medium text-gray-950/50">{children}</h3>;
}

function SitemapLinksWrapper({ children }: { children: React.ReactNode }) {
  return <ul className="mt-6 space-y-4 text-sm/6">{children}</ul>;
}

function SitemapLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="font-medium text-gray-950 transition-colors hover:text-gray-700 data-hover:text-gray-950/75"
      >
        {children}
      </Link>
    </li>
  );
}

function Sitemap() {
  const t = useTranslations("Footer.Navigation");

  return (
    <>
      {/* 1. Projects Column (Dynamic) */}
      <div>
        <SitemapHeading>{t("projects.title")}</SitemapHeading>
        <RecentWorks />
      </div>

      {/* 2. Company Column (Static) */}
      <div>
        <SitemapHeading>{t("chegall.title")}</SitemapHeading>
        <SitemapLinksWrapper>
          <SitemapLink href="/about">{t("chegall.links.about")}</SitemapLink>
          <SitemapLink href="/process">
            {t("chegall.links.process")}
          </SitemapLink>
          <SitemapLink href="/blog">{t("chegall.links.blog")}</SitemapLink>
          <SitemapLink href="/contact">
            {t("chegall.links.contact")}
          </SitemapLink>
        </SitemapLinksWrapper>
      </div>

      {/* 3. Social Column (Static) */}
      <div>
        <SitemapHeading>{t("social.title")}</SitemapHeading>
        <SitemapLinksWrapper>
          <li>
            <a
              href="tel:+989177609917"
              className="font-medium text-gray-950 transition-colors hover:text-gray-700"
            >
              {t("social.phone")}
            </a>
          </li>
          <li>
            <a
              href="https://wa.me/989177609917"
              className="font-medium text-gray-950 transition-colors hover:text-gray-700"
            >
              {t("social.whatsapp")}
            </a>
          </li>
          <li>
            <a
              href="https://t.me/rasooldabirinasab"
              className="font-medium text-gray-950 transition-colors hover:text-gray-700"
            >
              {t("social.telegram")}
            </a>
          </li>
        </SitemapLinksWrapper>
      </div>
    </>
  );
}

const BUILD_TIME_DATE = new Date();

function Copyright() {
  const t = useTranslations("Footer");
  const format = useFormatter();
  const currentYear = format.dateTime(BUILD_TIME_DATE, { year: "numeric" });

  return (
    <div className="text-sm/6 text-gray-950">
      {t("copyright", { year: currentYear })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. MAIN FOOTER COMPONENT                                                   */
/* -------------------------------------------------------------------------- */

export function Footer() {
  return (
    <footer>
      <Gradient className="relative">
        <div className="absolute inset-2 rounded-4xl bg-white/80" />

        <Container>
          <CallToAction />

          <div className="pb-16">
            <PlusGrid>
              <PlusGridRow>
                <div className="grid grid-cols-2 gap-y-10 pb-6 lg:grid-cols-6 lg:gap-8">
                  {/* Logo */}
                  <div className="col-span-2 flex">
                    <PlusGridItem className="pt-6 lg:pb-6">
                      <Logo className="h-9" />
                    </PlusGridItem>
                  </div>

                  {/* Sitemaps */}
                  <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-12 lg:col-span-4 lg:grid-cols-subgrid lg:pt-6">
                    <Sitemap />
                  </div>
                </div>
              </PlusGridRow>

              {/* Bottom Row */}
              <PlusGridRow className="flex justify-between">
                <div>
                  <PlusGridItem className="py-3">
                    <Copyright />
                  </PlusGridItem>
                </div>
                <div className="flex">
                  <PlusGridItem className="flex items-center gap-8 py-3">
                    <SocialLinks />
                  </PlusGridItem>
                </div>
              </PlusGridRow>
            </PlusGrid>
          </div>
        </Container>
      </Gradient>
    </footer>
  );
}
