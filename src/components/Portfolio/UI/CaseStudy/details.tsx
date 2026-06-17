"use client";
import React, { Suspense, JSX } from "react";
import type { CaseStudy } from "@/src/payload-types";
import { FadeInStagger } from "@/components/chegall/studio/FadeIn";
import { Link } from "@/src/i18n/routing";
import { MapIcon } from "@heroicons/react/24/solid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import { AuthorImage } from "@/components/Blog/Media/BlogMedia/AuthorImage";
import ProjectLocation from "@/components/Portfolio/UI/CaseStudy/map/project-location";
import { ButtonCustomColor } from "@/components/chegall/studio/Button";
import { useTranslations, useFormatter } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";

// --- Helper Components ---

function GoolgeMapButton({
  latitude,
  longitude,
}: {
  latitude: string;
  longitude: string;
}) {
  const t = useTranslations("CaseStudy");
  return (
    <ButtonCustomColor
      target="_blank"
      rel="noopener noreferrer"
      className="dark:bg-appletextgray w-fit bg-stone-600 hover:bg-neutral-600/50 dark:hover:bg-neutral-200/50"
      href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
    >
      <span className="dark:text-appleBackgroundWhite text-appleBackgroundWhite flex flex-row-reverse items-center justify-center gap-1">
        <span>{t("google-maps")}</span>
        <span aria-hidden="true">
          <MapIcon className="text-appleBackgroundWhite top-px h-3 w-3" />
        </span>
      </span>
    </ButtonCustomColor>
  );
}

export function StatList({
  children,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof FadeInStagger>, "children"> & {
  children: React.ReactNode;
}) {
  return (
    <FadeInStagger {...props}>
      <dl className="grid grid-cols-1 gap-8 py-4 sm:grid-cols-2 xl:grid-cols-1">
        {children}
      </dl>
    </FadeInStagger>
  );
}

export function StatListItem({
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
      <dd className="mt-1 text-lg font-semibold text-neutral-900 dark:text-white">
        {value}
      </dd>
    </div>
  );
}

export function TeamMember({
  name,
  role,
  image,
  slug,
}: {
  name: string;
  role: string;
  image?: any;
  slug?: string;
}) {
  const content = (
    <>
      <div className="relative h-12 w-12 overflow-hidden rounded-sm bg-neutral-100 ring-1 ring-white/10 grayscale transition group-hover:grayscale-0">
        {image ? (
          <AuthorImage resource={image} className="object-cover" />
        ) : (
          <div className="h-full w-full bg-neutral-300" />
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-900 group-hover:underline dark:text-white">
          {name}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{role}</p>
      </div>
    </>
  );

  if (slug) {
    return (
      <Link href={`/team/${slug}`} className="group flex items-center gap-4">
        {content}
      </Link>
    );
  }

  return <div className="group flex items-center gap-4">{content}</div>;
}

// --- Main Component ---

export function Details({ post }: { post: CaseStudy }): JSX.Element {
  const t = useTranslations("CaseStudy");
  const direction = useDirection();
  const format = useFormatter();

  const {
    projectType,
    credits,
    metrics,
    location,
    client,
    yearCompleted,
    overviewDetails,
  } = post || {};

  return (
    <div className="mt-8">
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
        defaultValue="overview"
      >
        {/* 1. PROJECT DATA (Metrics) */}
        <AccordionItem
          value="overview"
          className="rounded-[32px] border border-neutral-200 bg-neutral-50 px-6 py-2 dark:border-white/10 dark:bg-white/5"
        >
          <AccordionTrigger className="text-lg font-semibold text-neutral-900 dark:text-white">
            {t("highlights")}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6">
            <StatList>
              {/* Typology */}
              {projectType && (
                <StatListItem
                  label={t("projectType")}
                  value={
                    typeof projectType === "object" ? projectType.title : "-"
                  }
                />
              )}

              {/* Location */}
              <StatListItem
                label={t("location")}
                value={
                  direction === "rtl"
                    ? `${location?.city || ""}، ${location?.country || ""}`
                    : `${location?.city || ""}, ${location?.country || ""}`
                }
              />

              {/* GFA */}
              {metrics?.gfa && (
                <StatListItem
                  label={t("gfa")}
                  value={
                    <span>
                      {format.number(metrics.gfa)}{" "}
                      <span className="text-sm font-normal text-neutral-500">
                        m²
                      </span>
                    </span>
                  }
                />
              )}

              {/* Site Area */}
              {metrics?.siteArea && (
                <StatListItem
                  label={t("siteArea")}
                  value={
                    <span>
                      {format.number(metrics.siteArea)}{" "}
                      <span className="text-sm font-normal text-neutral-500">
                        m²
                      </span>
                    </span>
                  }
                />
              )}

              {/* Year */}
              {yearCompleted && (
                <StatListItem
                  label={t("yearCompleted")}
                  value={yearCompleted}
                />
              )}

              {/* Client */}
              {client && <StatListItem label={t("client")} value={client} />}

              {overviewDetails?.map((item) =>
                item.label && item.value ? (
                  <StatListItem
                    key={item.id || `${item.label}-${item.value}`}
                    label={item.label}
                    value={item.value}
                  />
                ) : null,
              )}
            </StatList>
          </AccordionContent>
        </AccordionItem>

        {/* 3. DRAWINGS */}
        {/* {projectDrawings && projectDrawings.length > 0 && (
          <AccordionItem
            value="drawings"
            className="rounded-[32px] border border-neutral-200 bg-neutral-50 px-6 py-2 dark:border-white/10 dark:bg-white/5"
          >
            <AccordionTrigger className="text-lg font-semibold text-neutral-900 dark:text-white">
              {t("drawings")}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <div className="grid grid-cols-2 gap-4">
                {projectDrawings.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-white p-2 dark:border-white/10 dark:bg-white/5">
                      {typeof item.drawing === "object" && (
                        <ImageMedia
                          resource={item.drawing}
                          fill
                          imgClassName="object-contain"
                        />
                      )}
                    </div>
                    {item.drawingType && (
                      <p className="text-center text-xs font-medium text-neutral-500 uppercase">
                        {item.drawingType}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )} */}

        {/* 4. CREDITS (Team & Collaborators) */}
        <AccordionItem
          value="credits"
          className="rounded-[32px] border border-neutral-200 bg-neutral-50 px-6 py-2 dark:border-white/10 dark:bg-white/5"
        >
          <AccordionTrigger className="text-lg font-semibold text-neutral-900 dark:text-white">
            {t("teamAndCredits")}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6">
            {/* Internal Team */}
            {credits?.team && credits.team.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                  {t("internalTeam")}
                </h4>
                <div className="flex flex-col gap-3">
                  {credits.team.map((member: any, i: number) =>
                    typeof member === "object" ? (
                      <TeamMember
                        key={i}
                        name={member.name}
                        role={member.role}
                        image={member.profilePicture}
                        slug={member.slug}
                      />
                    ) : null,
                  )}
                </div>
              </div>
            )}

            {/* External Collaborators */}
            {credits?.collaborators && credits.collaborators.length > 0 && (
              <div>
                <h4 className="mb-3 text-xs font-bold tracking-wider text-neutral-400 uppercase">
                  {t("collaborators")}
                </h4>
                <ul className="space-y-3">
                  {credits.collaborators.map((collab, i) => (
                    <li
                      key={i}
                      className="flex flex-col border-b border-neutral-200/50 pb-2 last:border-0 sm:flex-row sm:items-center sm:justify-between dark:border-white/5"
                    >
                      <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        {collab.role}
                      </span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {collab.company}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* 5. MAP */}
        <AccordionItem
          value="map"
          className="rounded-[32px] border border-neutral-200 bg-neutral-50 px-6 py-2 dark:border-white/10 dark:bg-white/5"
        >
          <AccordionTrigger className="text-lg font-semibold text-neutral-900 dark:text-white">
            {t("locationOnMap")}
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800">
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                    Loading map...
                  </div>
                }
              >
                <ProjectLocation location={location} />
              </Suspense>
            </div>
            {/* Check if lat/long exist before rendering button */}
            {location?.latitude && location?.longitude && (
              <div className="mt-4 flex justify-center">
                <GoolgeMapButton
                  latitude={location.latitude}
                  longitude={location.longitude}
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
