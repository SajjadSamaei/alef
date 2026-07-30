"use client";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ButtonCustomColor } from "@/components/chegall/studio/Button";
import { Link, usePathname } from "@/src/i18n/routing";
import { useState, useRef } from "react";
import { TypedLocale, PaginatedDocs } from "payload";

import { getLatestReports } from "./actions";
import {
  formatGregorianRelativeDate,
  formatPersianRelativeDate,
} from "@/payload/utilities/formatDateTime";
import { ClockIcon } from "@heroicons/react/24/outline";
import { EmptyContent } from "@/components/ui/empty";

function ReportsSkeleton() {
  return (
    <div className="animate-pulse items-center space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative">
          <div className="mb-2 h-3 w-1/4 rounded bg-white/10" /> {/* Date */}
          <div className="h-4 w-3/4 rounded bg-white/20" /> {/* Title */}
        </div>
      ))}
    </div>
  );
}

// --- TYPES ---
type ReportItem = {
  id: string | number;
  title: string;
  subtitle: string;
  href: string;
  date: string;
  datetime: string;
};

export function BlogButton({ invert }: { invert: boolean }) {
  const href = "/blog";
  const pathname = usePathname();
  const isActive = pathname?.startsWith(href);
  const t = useTranslations("Navigation");
  const tBlog = useTranslations("Blog");
  const tSearch = useTranslations("Search");
  const locale = useLocale();
  const direction = useDirection();

  const [isOpen, setIsOpen] = useState(false);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Handle Opening + Lazy Loading
  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    // Only fetch if opening, haven't loaded yet, and not currently loading
    if (open && !hasLoaded && !isLoading) {
      setIsLoading(true);
      try {
        const data = await getLatestReports(locale as TypedLocale);

        const mapped: ReportItem[] = data.map((p) => ({
          id: p.id,
          title: p.title ?? "",
          subtitle: p.subtitle ?? "",
          href: `/blog/${p.slug}`,
          date: new Date(p.publishedAt!).toLocaleDateString(
            locale === "fa" ? "fa-IR" : "en-US",
            {
              month: "long",
              day: "numeric",
              year: "numeric",
            },
          ),
          datetime: p.publishedAt!,
        }));

        setReports(mapped);
        setHasLoaded(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resources = [
    {
      name: tBlog("latest"),
      description: tBlog("latestDescription"),
      href: "/blog/",
    },
    {
      name: tBlog("archive"),
      description: tBlog("archiveDescription"),
      href: "/blog/archive",
    },
  ];

  const EmptyState = () => {
    return (
      <EmptyContent>
        <p className="text-appleBackgroundWhite/80 px-6 py-4 text-center font-semibold">
          {tSearch("noArticlesAvailable")}
        </p>
      </EmptyContent>
    );
  };

  return (
    <HoverCard openDelay={1000} open={isOpen} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <ButtonCustomColor
          className={clsx(
            invert ? "text-white" : "text-neutral-950",
            "bg-transparent",

            isActive ? "font-black!" : "hover:bg-neutral-200/50",
          )}
          href={href}
        >
          {t("blog")}
        </ButtonCustomColor>
      </HoverCardTrigger>

      <HoverCardContent className="w-screen max-w-xs rounded-[40px] bg-neutral-950/60 px-4 text-sm leading-6 shadow-lg ring-1 ring-white/10 backdrop-blur-lg transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
        {/* --- Latest Reports --- */}
        <div className="px-2 py-4">
          {resources.map((item) => (
            <div
              key={item.name}
              className="group relative flex gap-x-6 rounded-3xl hover:bg-neutral-800/50"
            >
              <div className="px-6 py-4">
                <Link
                  href={item.href}
                  className="text-appleBackgroundWhite font-semibold"
                >
                  {item.name}
                  <span className="absolute inset-0" />
                </Link>
                <p className="text-appleBackgroundWhite/60 mt-1 text-xs">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-2 py-4">
          <div className="flex items-center justify-between px-6">
            <h3 className="text-appleBackgroundWhite font-semibold">
              {tBlog("recentReports")}
            </h3>
            <div className="flex justify-start">
              <Link
                href="/blog/archive/reports"
                className="z-50 rounded-full p-2 text-sm font-semibold text-neutral-100 transition-colors hover:bg-neutral-600"
              >
                {tBlog("see-all-reports")}
                {/* 5. Conditionally render arrow */}
                <span aria-hidden="true">
                  {direction === "rtl" ? " ←" : " →"}
                </span>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <ReportsSkeleton />
          ) : !isLoading && reports.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-1">
              {reports.map((post) => (
                <li
                  key={post.id}
                  className="bg-appleBackgorundGray/20 relative rounded-3xl px-6 py-4 hover:bg-neutral-600/50"
                >
                  <time
                    dateTime={post.datetime}
                    className="text-appleBackgroundWhite/60 block text-xs"
                  >
                    <div className="flex items-center justify-start gap-1 text-xs">
                      <ClockIcon className="w-4" />{" "}
                      <time dateTime={post.date}>
                        {locale === "fa"
                          ? formatPersianRelativeDate(post.datetime)
                          : formatGregorianRelativeDate(post.datetime)}
                      </time>
                    </div>
                  </time>

                  <Link
                    href={post.href}
                    className="text-appleBackgroundWhite block truncate text-sm font-semibold"
                  >
                    {post.title}
                    <span className="absolute inset-0" />
                  </Link>
                  {/* <p className="mt-1 text-xs truncate text-appleBackgroundWhite/60"> {post.subtitle}</p> */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function AboutButton({ invert }: { invert: boolean }) {
  const href = "/about";
  let isActive = usePathname() === href;
  const t = useTranslations("Navigation");
  const tAbout = useTranslations("About");

  const resources = [
    {
      name: `${tAbout("Hero.history")}`,
      description: `${tAbout("Hero.title")}`,
      href: "/about",
    },
    {
      name: `${tAbout("Culture.eyebrow")}`,
      description: `${tAbout("Culture.title")}`,
      href: "/about#culture",
    },
    {
      name: `${tAbout("Values.eyebrow")}`,
      description: `${tAbout("Values.title")}`,
      href: "/about#values",
    },
  ];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <ButtonCustomColor
          className={clsx(
            invert ? "text-white" : "text-neutral-950",
            "bg-transparent",

            isActive ? "font-black!" : "hover:bg-neutral-200/50",
          )}
          href={href}
        >
          {t("aboutUs")}
        </ButtonCustomColor>
      </HoverCardTrigger>
      <HoverCardContent className="w-screen max-w-xs rounded-[40px] bg-neutral-950/60 px-4 text-sm leading-6 shadow-lg ring-1 ring-white/10 backdrop-blur-lg transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
        <div className="px-2 py-4">
          {resources.map((item) => (
            <div
              key={item.name}
              className="group relative flex gap-x-6 rounded-3xl hover:bg-neutral-800/50"
            >
              <div className="px-6 py-4">
                <Link
                  href={item.href}
                  className="text-appleBackgroundWhite font-semibold"
                >
                  {item.name}
                  <span className="absolute inset-0" />
                </Link>
                <p className="text-appleBackgroundWhite/60 mt-1 text-xs">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function ServicesButton({ invert }: { invert: boolean }) {
  const href = "/services";
  let isActive = usePathname() === href;
  const t = useTranslations("Navigation");
  const tServices = useTranslations("ServicesPage");
  const tTile = useTranslations("Services.Grid");

  const resources = [
    {
      name: `${tTile("management.title")}`,
      description: `${tTile("management.subtitle")}`,
      href: `/services#${tServices("ProjectManagement.id")}`,
    },
    {
      name: `${tTile("architecture.title")}`,
      description: `${tTile("architecture.subtitle")}`,
      href: `/services#${tServices("ExteriorDesign.id")}`,
    },
    {
      name: `${tTile("interiorDesign.title")}`,
      description: `${tTile("interiorDesign.subtitle")}`,
      href: `/services#${tServices("InteriorDesign.id")}`,
    },
    {
      name: `${tTile("consultation.title")}`,
      description: `${tTile("consultation.subtitle")}`,
      href: `/services#${tServices("Consultation.id")}`,
    },
    {
      name: `${tTile("renovation.title")}`,
      description: `${tTile("renovation.subtitle")}`,
      href: `/services#${tServices("Renovation.id")}`,
    },
    {
      name: `${tTile("branding.title")}`,
      description: `${tTile("branding.subtitle")}`,
      href: `/services#${tServices("Branding.id")}`,
    },
    {
      name: `${tTile("investment.title")}`,
      description: `${tTile("investment.subtitle")}`,
      href: `/services#${tServices("Investment.id")}`,
    },
  ];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <ButtonCustomColor
          className={clsx(
            invert ? "text-white" : "text-neutral-950",
            "bg-transparent",

            isActive ? "font-black!" : "hover:bg-neutral-200/50",
          )}
          href={href}
        >
          {t("services")}
        </ButtonCustomColor>
      </HoverCardTrigger>
      <HoverCardContent className="w-screen max-w-xs rounded-[40px] bg-neutral-950/60 px-4 text-sm leading-6 shadow-lg ring-1 ring-white/10 backdrop-blur-lg transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
        <div className="px-2 py-4">
          {resources.map((item) => (
            <div
              key={item.name}
              className="group relative flex gap-x-6 rounded-3xl hover:bg-neutral-800/50"
            >
              <div className="px-6 py-4">
                <Link
                  href={item.href}
                  className="text-appleBackgroundWhite font-semibold"
                >
                  {item.name}
                  <span className="absolute inset-0" />
                </Link>
                <p className="text-appleBackgroundWhite/60 mt-1 text-xs">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function TeamButton({ invert }: { invert: boolean }) {
  const href = "/team";
  let isActive = usePathname() === href;
  const tOrg = useTranslations("Team.orgRoles");
  const t = useTranslations("Navigation");
  const tTeam = useTranslations("Team.orgDescription");

  const resources = [
    {
      name: `${tOrg("leadership")}`,
      description: `${tTeam("leadership")}`,
      href: "/team#leadership",
    },
    {
      name: `${tOrg("representative")}`,
      description: `${tTeam("representative")}`,
      href: "/team#representative",
    },
    {
      name: `${tOrg("team")}`,
      description: `${tTeam("team")}`,
      href: "/team#team",
    },
    {
      name: `${tOrg("contractor")}`,
      description: `${tTeam("contractor")}`,
      href: "/team#contractor",
    },
  ];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <ButtonCustomColor
          className={clsx(
            invert ? "text-white" : "text-neutral-950",
            "bg-transparent",

            isActive ? "font-black!" : "hover:bg-neutral-200/50",
          )}
          href={href}
        >
          {t("team")}
        </ButtonCustomColor>
      </HoverCardTrigger>
      <HoverCardContent className="w-screen max-w-xs rounded-[40px] bg-neutral-950/60 px-4 text-sm leading-6 shadow-lg ring-1 ring-white/10 backdrop-blur-lg transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
        <div className="px-2 py-4">
          {resources.map((item) => (
            <div
              key={item.name}
              className="group relative flex gap-x-6 rounded-3xl hover:bg-neutral-800/50"
            >
              <div className="px-6 py-4">
                <Link
                  href={item.href}
                  className="text-appleBackgroundWhite font-semibold"
                >
                  {item.name}
                  <span className="absolute inset-0" />
                </Link>
                <p className="text-appleBackgroundWhite/60 mt-1 text-xs">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function PortfolioButton({ invert }: { invert: boolean }) {
  const href = "/portfolio";
  let isActive = usePathname() === href;
  const t = useTranslations("Navigation");

  const resources = [
    {
      name: `${t("projects")}`,
      description: `${t("Work.projectsDesc")}`,
      href: "/portfolio#projects",
    },
    {
      name: `${t("case-study")}`,
      description: `${t("Work.caseStudiesDesc")}`,
      href: "/portfolio#case-studies",
    },
  ];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <ButtonCustomColor
          className={clsx(
            invert ? "text-white!" : "text-neutral-950!",
            "bg-transparent",

            isActive ? "font-black!" : "hover:bg-neutral-200/50",
          )}
          href={href}
        >
          {t("portfolio")}
        </ButtonCustomColor>
      </HoverCardTrigger>
      <HoverCardContent className="w-screen max-w-xs rounded-[40px] bg-neutral-950/60 px-4 text-sm leading-6 shadow-lg ring-1 ring-white/10 backdrop-blur-lg transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
        <div className="px-2 py-4">
          {resources.map((item) => (
            <div
              key={item.name}
              className="group relative flex gap-x-6 rounded-3xl hover:bg-neutral-800/50"
            >
              <div className="px-6 py-4">
                <Link
                  href={item.href}
                  className="text-appleBackgroundWhite font-semibold"
                >
                  {item.name}
                  <span className="absolute inset-0" />
                </Link>
                <p className="text-appleBackgroundWhite/60 mt-1 text-xs">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
