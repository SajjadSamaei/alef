"use client";

import React, { Suspense, JSX } from "react";
import type { CaseStudy } from "@/src/payload-types";
import { FadeInStagger } from "@/components/chegall/studio/FadeIn";
import { Link } from "@/src/i18n/routing";
import { MapIcon } from "@heroicons/react/24/solid";
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
      className="dark:bg-appletextgray w-fit bg-stone-600 hover:bg-neutral-600/50 dark:hover:bg-neutral-200/50 text-xs py-1.5 px-3"
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
      <dl className="grid grid-cols-1 gap-3.5 py-1 sm:grid-cols-2 xl:grid-cols-1">
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
    <div className="border-l-2 border-neutral-200 pl-3 rtl:border-r-2 rtl:border-l-0 rtl:pr-3 rtl:pl-0 dark:border-neutral-800">
      <dt className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-semibold text-neutral-900 dark:text-white">
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
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200 grayscale transition group-hover:grayscale-0 dark:ring-white/10">
        {image ? (
          <AuthorImage resource={image} className="object-cover" />
        ) : (
          <div className="h-full w-full bg-neutral-300 dark:bg-neutral-700" />
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-neutral-900 group-hover:underline dark:text-white">
          {name}
        </p>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{role}</p>
      </div>
    </>
  );

  if (slug) {
    return (
      <Link href={`/team/${slug}`} className="group flex items-center gap-2.5">
        {content}
      </Link>
    );
  }

  return <div className="group flex items-center gap-2.5">{content}</div>;
}

// --- Main Single Card Component ---

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

  const hasTeamOrCollaborators =
    (credits?.team && credits.team.length > 0) ||
    (credits?.collaborators && credits.collaborators.length > 0);

  const hasMapLocation =
    location?.latitude || location?.longitude || location?.city;

  const formattedLocation = location?.city && location?.country
    ? `${location.city}، ${location.country}`
    : location?.city || location?.country || null;

  return (
    <div className="mt-6 rounded-3xl border border-neutral-200/80 bg-neutral-50/70 p-5 sm:p-6 dark:border-white/10 dark:bg-neutral-900/60 shadow-xs backdrop-blur-sm space-y-5">
      {/* 1. PROJECT HIGHLIGHTS */}
      <div>
        <h3 className="mb-3 text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
          {t("highlights")}
        </h3>
        <StatList>
          {projectType && (
            <StatListItem
              label={t("projectType")}
              value={typeof projectType === "object" ? projectType.title : "-"}
            />
          )}

          {formattedLocation && (
            <StatListItem
              label={t("location")}
              value={formattedLocation}
            />
          )}

          {metrics?.gfa && (
            <StatListItem
              label={t("gfa")}
              value={
                <span>
                  {format.number(metrics.gfa)}{" "}
                  <span className="text-xs font-normal text-neutral-500">
                    m²
                  </span>
                </span>
              }
            />
          )}

          {metrics?.siteArea && (
            <StatListItem
              label={t("siteArea")}
              value={
                <span>
                  {format.number(metrics.siteArea)}{" "}
                  <span className="text-xs font-normal text-neutral-500">
                    m²
                  </span>
                </span>
              }
            />
          )}

          {yearCompleted && (
            <StatListItem label={t("yearCompleted")} value={yearCompleted} />
          )}

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
      </div>

      {/* 2. TEAM & CREDITS */}
      {hasTeamOrCollaborators && (
        <>
          <hr className="border-neutral-200/80 dark:border-neutral-800" />
          <div>
            <h3 className="mb-3 text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
              {t("teamAndCredits")}
            </h3>

            {/* Internal Team */}
            {credits?.team && credits.team.length > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                  {t("internalTeam")}
                </h4>
                <div className="flex flex-col gap-2.5">
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
                <h4 className="mb-2 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                  {t("collaborators")}
                </h4>
                <ul className="space-y-2">
                  {credits.collaborators.map((collab, i) => (
                    <li
                      key={i}
                      className="flex flex-col border-b border-neutral-200/50 pb-1.5 last:border-0 sm:flex-row sm:items-center sm:justify-between dark:border-white/5"
                    >
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        {collab.role}
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        {collab.company}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      {/* 3. LOCATION ON MAP */}
      {hasMapLocation && (
        <>
          <hr className="border-neutral-200/80 dark:border-neutral-800" />
          <div>
            <h3 className="mb-3 text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
              {t("locationOnMap")}
            </h3>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
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
            {location?.latitude && location?.longitude && (
              <div className="mt-3 flex justify-center">
                <GoolgeMapButton
                  latitude={location.latitude}
                  longitude={location.longitude}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
