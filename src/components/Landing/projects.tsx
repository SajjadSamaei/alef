import clsx from "clsx";
import { SectionIntroduction } from "@/components/chegall/studio/SectionIntro";
import { PortfolioArchive as CaseStudyArchive } from "@/components/Portfolio/UI/Archive/PortfolioArchive"; // Adjust path to where you saved the CaseStudy component
import { getTranslations } from "next-intl/server";
import { locales } from "@/src/i18n/i18n.config";
import { getPayload, TypedLocale } from "payload";
import configPromise from "@payload-config";
import { Link } from "@/src/i18n/routing";
import { ContainerCard } from "../chegall/studio/Container";
import { getDirection } from "@/utils/hooks/useDirection";
import type { LandingPage } from "@/src/payload-types";

type Locale = (typeof locales)[number];

const getButtonClasses = (invert = false) => {
  return clsx(
    "inline-flex items-center rounded-full px-4 py-1.5 text-base sm:text-sm font-semibold transition",
    invert
      ? "bg-white text-neutral-950 hover:bg-neutral-200"
      : "bg-neutral-950 text-white hover:bg-neutral-800",
  );
};

// 1. Static Params Generation
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 3. Data Fetching Functions
async function getProjects(locale: Locale) {
  const payload = await getPayload({ config: configPromise });
  const data = await payload.find({
    collection: "case-studies",
    locale: locale as TypedLocale,
    limit: 100,
    sort: "-yearAppointment",
    fallbackLocale: "en",
  });
  return data.docs;
}

type Props = {
  locale: Locale;
  content?: LandingPage["projectsCopy"];
};

// 4. Main Page Component
export default async function ProjectShowcase({ locale, content }: Props) {
  // Fetch Data in Parallel
  const [projects] = await Promise.all([getProjects(locale)]);

  const t = await getTranslations("PortfolioPage");
  const direction = getDirection(locale);

  return (
    <ContainerCard id="projects" className="mt-24 sm:mt-32 lg:mt-40">
      <SectionIntroduction
        className="mx-auto max-w-2xl text-center"
        eyebrow={content?.eyebrow || t("Projects.eyebrow")}
        title={content?.title || t("Projects.title")}
      >
        <p>{content?.description || t("Projects.description")}</p>
        <div className="mt-6 flex justify-center text-base/7 font-semibold">
          {/* Use the localized Link component */}
          <Link
            href="/portfolio"
            aria-label={content?.viewAll || t("Projects.viewAll")}
            className="text-nirvanaDarkBlue hover:text-nirvanaLightBlue rounded-full transition-colors"
          >
            {content?.viewAll || t("Projects.viewAll")}
            {/* Use 'ms-1' (margin-start) for RTL/LTR safety */}
            <span className="top-px ms-1" aria-hidden="true">
              {/* Conditionally render the arrow direction */}
              {direction === "rtl" ? "›" : "›"}
            </span>
          </Link>
        </div>
      </SectionIntroduction>

      <div className="mt-16">
        {/* Passing data to your existing component */}
        <CaseStudyArchive projects={projects} />
      </div>
    </ContainerCard>
  );
}
