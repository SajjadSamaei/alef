import clsx from "clsx";
import { SectionIntroduction } from "@/components/chegall/studio/SectionIntro";
import { PortfolioArchive as CaseStudyArchive } from "@/components/Portfolio/UI/Archive/PortfolioArchive";
import { ProjectGridSkeleton } from "@/components/Portfolio/UI/Archive/Skeleton/PostSkeleton";
import { getTranslations } from "next-intl/server";
import { locales } from "@/src/i18n/i18n.config";
import { getPayload, TypedLocale } from "payload";
import configPromise from "@payload-config";
import { Link } from "@/src/i18n/routing";
import { ContainerCard } from "../chegall/studio/Container";
import { getDirection } from "@/utils/hooks/useDirection";
import type { LandingPage } from "@/src/payload-types";

type Locale = (typeof locales)[number];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function getProjects(locale: Locale) {
  try {
    const payload = await getPayload({ config: configPromise });
    const data = await payload.find({
      collection: "case-studies",
      locale: locale as TypedLocale,
      limit: 100,
      sort: "-yearAppointment",
      fallbackLocale: "en",
      overrideAccess: true,
      draft: false,
    });
    return data.docs || [];
  } catch (error) {
    console.error("Failed to fetch case studies from DB:", error);
    return [];
  }
}

export function ProjectShowcaseSkeleton() {
  return (
    <ContainerCard id="projects-skeleton" className="py-16 sm:py-24 lg:py-28 animate-pulse">
      <div className="mx-auto max-w-2xl text-center space-y-3 mb-16">
        <div className="mx-auto h-5 w-28 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80" />
        <div className="mx-auto h-9 w-64 rounded-lg bg-neutral-300/80 dark:bg-neutral-700/80" />
        <div className="mx-auto h-4 max-w-md rounded bg-neutral-200/70 dark:bg-neutral-800/70" />
      </div>
      <ProjectGridSkeleton count={10} />
    </ContainerCard>
  );
}

type Props = {
  locale: Locale;
  content?: LandingPage["projectsCopy"];
};

export default async function ProjectShowcase({ locale, content }: Props) {
  const [projects] = await Promise.all([getProjects(locale)]);

  const t = await getTranslations("PortfolioPage");
  const direction = getDirection(locale);

  return (
    <ContainerCard id="projects" className="py-16 sm:py-24 lg:py-28">
      <SectionIntroduction
        className="mx-auto max-w-2xl text-center"
        eyebrow={content?.eyebrow || t("Projects.eyebrow")}
        title={content?.title || t("Projects.title")}
      >
        <p>{content?.description || t("Projects.description")}</p>
        <div className="mt-6 flex justify-center text-base/7 font-semibold">
          <Link
            href="/portfolio"
            aria-label={content?.viewAll || t("Projects.viewAll")}
            className="text-nirvanaDarkBlue hover:text-nirvanaLightBlue rounded-full transition-colors"
          >
            {content?.viewAll || t("Projects.viewAll")}
            <span className="top-px ms-1" aria-hidden="true">
              {direction === "rtl" ? "›" : "›"}
            </span>
          </Link>
        </div>
      </SectionIntroduction>

      <div className="mt-16">
        <CaseStudyArchive projects={projects} direction={direction} />
      </div>
    </ContainerCard>
  );
}
