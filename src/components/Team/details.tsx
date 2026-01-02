"use client";
import React, { JSX } from "react";
import type { Team, Post } from "@/src/payload-types";
import { Link } from "@/src/i18n/routing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import {
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaBehance,
  FaRegNewspaper,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

// --- Helper Components ---

function ContactRow({
  icon: Icon,
  label,
  url,
}: {
  icon: IconType;
  label: string;
  url: string | null | undefined;
}) {
  if (!url) return null;

  // --- FIX START ---
  // Detect if the string is likely a phone number (digits, plus, spaces, dashes)
  // Be careful not to trap website URLs that might have digits, so usually phone #s don't have dots or slashes
  const isPhone =
    /^[+\d\s-]+$/.test(url) && !url.includes(".") && !url.includes("/");

  let href = url;

  if (url.includes("@")) {
    href = `mailto:${url}`;
  } else if (isPhone) {
    href = `tel:${url}`; // Use tel: protocol for phones
  } else if (!url.startsWith("http")) {
    href = `https://${url}`; // Default to website
  }
  // --- FIX END ---

  // Simple display formatting
  const displayValue = url.replace(/(^\w+:|^)\/\//, "").replace("www.", "");

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // Added 'prefetch={false}' to prevent Next.js from trying to prefetch external protocols
      prefetch={false}
      className="group flex items-center justify-between border-b border-neutral-200/50 py-3 last:border-0 hover:bg-neutral-100/50 dark:border-white/5 dark:hover:bg-white/5"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-white/10 dark:text-neutral-400 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
          <Icon className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-wider text-neutral-400 uppercase">
            {label}
          </span>
          <span className="max-w-[200px] truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {displayValue}
          </span>
        </div>
      </div>
      {/* Hide the arrow for phone/email since they don't open a new tab usually */}
      {!isPhone && !url.includes("@") && (
        <FaArrowUpRightFromSquare className="size-3 text-neutral-300 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </Link>
  );
}

function StatListItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-l-2 border-neutral-200 pl-4 rtl:border-r-2 rtl:border-l-0 rtl:pr-4 rtl:pl-0 dark:border-neutral-800">
      <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </dt>
      <dd className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">
        {value}
      </dd>
    </div>
  );
}

function ArticleListItem({ label, slug }: { label: string; slug: string }) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex items-center gap-3 rounded-xl p-2 transition-all hover:bg-neutral-100 dark:hover:bg-white/5"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-white/10">
        <FaRegNewspaper className="size-4" />
      </div>
      <span className="line-clamp-2 text-sm font-medium text-neutral-700 transition-colors group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-blue-400">
        {label}
      </span>
    </Link>
  );
}

type Props = {
  post: Team;
  relatedArticles?: {
    name: string;
    posts: Post[];
  } | null;
};

// --- Main Component ---

export function Details({ post, relatedArticles }: Props): JSX.Element {
  const t = useTranslations("Team");
  const tContact = useTranslations("Team.Contacts");
  const tBlog = useTranslations("Blog");
  const direction = useDirection();

  const { contactInfo, role, credentials, skills, employmentStatus } =
    post || {};
  const hasArticles = relatedArticles && relatedArticles.posts.length > 0;

  return (
    <div className="mt-8">
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
        defaultValue="info"
      >
        {/* 1. PROFESSIONAL INFO */}
        <AccordionItem
          value="info"
          className="rounded-[32px] border border-neutral-200 bg-neutral-50 px-6 py-2 dark:border-white/10 dark:bg-white/5"
        >
          <AccordionTrigger className="text-lg font-semibold text-neutral-900 dark:text-white">
            {t("professionalInfo") || "Profile"}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6">
            <dl className="grid grid-cols-1 gap-6">
              {role && (
                <StatListItem label={t("role") || "Role"} value={role} />
              )}
              {credentials && (
                <StatListItem
                  label={t("credentials") || "Credentials"}
                  value={credentials}
                />
              )}
              {employmentStatus && (
                <StatListItem
                  label={t("status") || "Status"}
                  value={
                    employmentStatus === "active"
                      ? t("active") || "Current Team"
                      : t("alumni") || "Alumni"
                  }
                />
              )}
              {skills && skills.length > 0 && (
                <div className="border-l-2 border-neutral-200 pl-4 rtl:border-r-2 rtl:border-l-0 rtl:pr-4 rtl:pl-0 dark:border-neutral-800">
                  <dt className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {t("skills") || "Skills"}
                  </dt>
                  <dd className="flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <span
                        key={i}
                        className="inline-block rounded-md bg-white px-2 py-1 text-xs font-medium text-neutral-600 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700"
                      >
                        {s.skill}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </AccordionContent>
        </AccordionItem>

        {/* 2. CONTACT & SOCIALS */}
        <AccordionItem
          value="contact"
          className="rounded-[32px] border border-neutral-200 bg-neutral-50 px-6 py-2 dark:border-white/10 dark:bg-white/5"
        >
          <AccordionTrigger className="text-lg font-semibold text-neutral-900 dark:text-white">
            {tContact("contactMethods")}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6">
            <div className="flex flex-col">
              {contactInfo?.email && (
                <ContactRow
                  icon={FaEnvelope}
                  label={tContact("email")}
                  url={contactInfo.email}
                />
              )}
              {contactInfo?.phone && (
                <ContactRow
                  icon={FaPhone}
                  label={tContact("phone")}
                  url={contactInfo.phone}
                />
              )}
              {contactInfo?.website && (
                <ContactRow
                  icon={FaGlobe}
                  label={tContact("website")}
                  url={contactInfo.website}
                />
              )}
              {contactInfo?.linkedin && (
                <ContactRow
                  icon={FaLinkedin}
                  label={tContact("linkedin")}
                  url={contactInfo.linkedin}
                />
              )}
              {contactInfo?.behance && (
                <ContactRow
                  icon={FaBehance}
                  label="Behance"
                  url={contactInfo.behance}
                />
              )}
              {contactInfo?.instagram && (
                <ContactRow
                  icon={FaInstagram}
                  label={tContact("instagram")}
                  url={contactInfo.instagram}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3. LATEST ARTICLES */}
        {hasArticles && (
          <AccordionItem
            value="articles"
            className="rounded-[32px] border border-neutral-200 bg-neutral-50 px-6 py-2 dark:border-white/10 dark:bg-white/5"
          >
            <AccordionTrigger className="text-lg font-semibold text-neutral-900 dark:text-white">
              {tBlog("recentArticles") || "Recent Articles"}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <div className="flex flex-col gap-2">
                {relatedArticles.posts.map((article) => (
                  <ArticleListItem
                    key={article.id}
                    label={article.title || ""}
                    slug={article.slug || ""}
                  />
                ))}
              </div>
              <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-white/10">
                <Link
                  href={`/blog/archive?q=${encodeURIComponent(
                    relatedArticles.name,
                  )}`}
                  className="group flex items-center gap-2 text-sm font-semibold text-neutral-500 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {tBlog("see-all-reports") || "Read all articles"}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
