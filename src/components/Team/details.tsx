"use client";
import React, { JSX } from "react";
import type { Team } from "@/src/payload-types";
import { Link } from "@/src/i18n/routing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import { useTranslations } from "next-intl";

// --- Helper Components ---

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

type Props = {
  post: Team;
};

// --- Main Component ---

export function Details({ post }: Props): JSX.Element {
  const t = useTranslations("Team");

  const { role, credentials, skills, employmentStatus } = post || {};

  return (
    <div className="mt-8">
      <Accordion type="single" className="w-full space-y-4" defaultValue="info">
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
      </Accordion>
    </div>
  );
}
