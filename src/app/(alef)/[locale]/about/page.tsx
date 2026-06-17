import { Border } from "@/components/chegall/studio/Border";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import { GridPattern } from "@/components/chegall/studio/GridPattern";
import { GridList, GridListItem } from "@/components/chegall/studio/GridList";
import { SectionIntroduction } from "@/components/chegall/studio/SectionIntro";
import { Team as TeamList } from "@/components/Team/List"; // Import your Team List component
import { TypingAnimation } from "@/components/ui/magicui/typing-animation";
import { GradientComponent } from "@/components/chegall/radient/gradient";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/src/i18n/i18n.config";
import clsx from "clsx";
import type { Metadata } from "next";
import configPromise from "@payload-config";
import { getPayload, TypedLocale } from "payload";
import type { Team as Teams } from "@/src/payload-types";
import type { AboutPage as AboutPageData } from "@/src/payload-types";
import { getCachedGlobal } from "@/payload/utilities/getGlobals";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import { getSiteSettings, getStaticPageMetadata, requireEnabledPage } from "@/payload/utilities/siteSettings";

// --- Types ---
type TeamGroup = {
  title: string;
  people: Teams[];
};

type Locale = (typeof locales)[number];

type Props = {
  params: Promise<{ locale: Locale }>;
};

// --- Helper Functions ---

async function getGroupedTeamMembers({ locale }: { locale: TypedLocale }) {
  const payload = await getPayload({ config: configPromise });
  const t = (await getTranslations("Team.orgRoles")) as (key: string) => string;

  try {
    const { docs: teamMembers } = await payload.find({
      collection: "team",
      locale: locale as TypedLocale,
      fallbackLocale: "en",
      depth: 2,
      overrideAccess: false,
      pagination: false,
      where: {
        employmentStatus: {
          equals: "active",
        },
      },
    });

    const groupedData: TeamGroup[] = [
      { title: t("leadership"), people: [] },
      { title: t("associate"), people: [] },
      { title: t("team"), people: [] },
      { title: t("admin"), people: [] },
      { title: t("contractor"), people: [] },
    ];

    teamMembers.forEach((member) => {
      // 1. Initialize an empty string array
      let roles: string[] = [];

      // 2. Safely populate it based on whatever data type exists (Array, String, or Null)
      if (Array.isArray(member.orgRoles)) {
        // It's already an array, filter out any nulls just in case
        roles = member.orgRoles.filter(
          (
            r,
          ): r is
            | "leadership"
            | "associate"
            | "team"
            | "admin"
            | "contractor" => typeof r === "string",
        );
      } else if (typeof member.orgRoles === "string") {
        // It's a single string (legacy data or hasMany: false)
        roles = [member.orgRoles];
      }
      // If null/undefined, roles remains []

      // 3. Now .includes() works safely because roles is strictly string[]
      if (roles.includes("leadership")) {
        groupedData[0].people.push(member);
      }
      if (roles.includes("associate")) {
        groupedData[1].people.push(member);
      }
      if (roles.includes("team")) {
        groupedData[2].people.push(member);
      }
      if (roles.includes("admin")) {
        groupedData[3].people.push(member);
      }
      if (roles.includes("contractor")) {
        groupedData[4].people.push(member);
      }
    });

    return groupedData.filter((group) => group.people.length > 0);
  } catch (error) {
    console.error("Failed to fetch or group team members:", error);
    return [];
  }
}

// --- Sub-Components ---

function Impact() {
  const t = useTranslations("About.Impact");

  return (
    <div className="mt-12 sm:mt-18 lg:mt-20">
      <Container>
        <FadeIn>
          {/* Header Section - Clean & Minimal */}
          <div className="max-w-2xl">
            <h2 className="eyebrow-style text-neutral-950 uppercase dark:text-white">
              {t("eyebrow")}
            </h2>
            <p className="title-style mt-6 text-neutral-950 dark:text-neutral-100">
              {t("title")}
            </p>
            <p className="paragraph-style mt-6 text-neutral-600 dark:text-neutral-400">
              {t("description")}
            </p>
          </div>
        </FadeIn>

        {/* Stats Grid - "Ribbon-Like" Cards */}
        <div className="mt-16 sm:mt-20">
          <FadeInStagger>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((itemIndex) => (
                <FadeIn key={itemIndex}>
                  <div
                    className={clsx(
                      "group relative flex flex-col justify-between overflow-hidden p-8 transition-all duration-300",
                      // Shape & Border
                      "rounded-[32px] border border-neutral-200 dark:border-white/10",
                      // Background & Blur (Matches Ribbon Logic)
                      "bg-neutral-50/50 backdrop-blur-sm dark:bg-white/5",
                      // Hover State (Elevation)
                      "hover:-translate-y-1 hover:bg-neutral-100 hover:shadow-lg hover:shadow-black/5",
                      "dark:hover:bg-white/10 dark:hover:shadow-none",
                    )}
                  >
                    {/* Metric Value */}
                    <dd className="font-display text-5xl font-semibold tracking-tight text-neutral-950 sm:text-6xl dark:text-white">
                      {t(`stats.item${itemIndex}.value`)}
                    </dd>

                    {/* Label with decorative indicator */}
                    <dt className="mt-4 flex items-center gap-3">
                      <span
                        className={clsx(
                          "h-px w-8 bg-neutral-300 transition-all duration-300 group-hover:w-12 group-hover:bg-neutral-950",
                          "dark:bg-neutral-700 dark:group-hover:bg-white",
                        )}
                      />
                      <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase transition-colors group-hover:text-neutral-950 dark:text-neutral-400 dark:group-hover:text-white">
                        {t(`stats.item${itemIndex}.label`)}
                      </span>
                    </dt>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </Container>
    </div>
  );
}

function Culture() {
  const t = useTranslations("About.Culture");
  return (
    <div
      id="culture"
      className="section-style relative mt-24 sm:mt-32 lg:mt-40"
    >
      {/* Updated Background: Gradient Component */}
      <GradientComponent
        variant="cool"
        className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset"
      />

      {/* Content Wrapper */}
      <div className="relative py-16 sm:py-24">
        <SectionIntroduction eyebrow={t("eyebrow")} title={t("title")}>
          <p className="sub-paragraph-style">{t("description")}</p>
          <span className="sr-only">{t("srOnly")}</span>
        </SectionIntroduction>

        {/* Adjusted spacing to fit inside the card */}
        <Container className="mt-16">
          <GridList>
            <GridListItem title={t("item1.title")}>
              {t("item1.description")}
            </GridListItem>
            <GridListItem title={t("item2.title")}>
              {t("item2.description")}
            </GridListItem>
            <GridListItem title={t("item3.title")}>
              {t("item3.description")}
            </GridListItem>
          </GridList>
        </Container>
      </div>
    </div>
  );
}

function Values() {
  const t = useTranslations("About.Values");
  return (
    <div id="values" className="section-style relative mt-24 sm:mt-32 lg:mt-40">
      {/* Updated Background: Gradient Component */}
      <GradientComponent
        variant="earth"
        className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset"
      />

      {/* Content Wrapper */}
      <div className="relative py-16 sm:py-24">
        <SectionIntroduction eyebrow={t("eyebrow")} title={t("title")}>
          <p className="sub-paragraph-style">{t("description")}</p>
        </SectionIntroduction>

        <Container as="div" className="mt-16">
          <GridList>
            <GridListItem title={t("item1.title")}>
              {t("item1.description")}
            </GridListItem>
            <GridListItem title={t("item2.title")}>
              {t("item2.description")}
            </GridListItem>
            <GridListItem title={t("item3.title")}>
              {t("item3.description")}
            </GridListItem>
            <GridListItem title={t("item4.title")}>
              {t("item4.description")}
            </GridListItem>
          </GridList>
        </Container>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.About" });
  const settings = await getSiteSettings(locale as TypedLocale);
  return getStaticPageMetadata({ settings, page: "about", fallbackTitle: t("title"), fallbackDescription: t("description") });
}

export default async function About({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireEnabledPage("about", locale as TypedLocale);

  // Parallel data fetching for performance
  const [tHero, tTeam, groupedTeamMembers, aboutData] = await Promise.all([
    getTranslations("About.Hero"),
    getTranslations("About.Team"),
    getGroupedTeamMembers({ locale: locale as TypedLocale }),
    getCachedGlobal("about-page", 1, locale as TypedLocale)() as Promise<AboutPageData>,
  ]);

  return (
    <>
      <div className="section-style relative mt-10 lg:mt-10">
        <GradientComponent className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
        <Container className="relative">
          <div className="flex flex-col items-center justify-center gap-4 pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
            <div className="flex items-center justify-center">
              <TypingAnimation className="font-display text-center! text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
                {tHero("title")}
              </TypingAnimation>
            </div>
            <p className="mt-8 max-w-lg text-center text-xl/7 font-medium text-gray-950/75 sm:max-w-xl sm:text-2xl/8">
              {tHero("description")}
            </p>
          </div>
        </Container>
      </div>
      <Container className="mt-12 sm:mt-16">
        <FadeIn>
          <figure>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[32px] bg-neutral-100 dark:bg-neutral-900">
              <ImageMedia
                resource={aboutData.studioImage}
                fill
                size="large"
                imgClassName="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-black/10 ring-inset dark:ring-white/10" />
            </div>
            {aboutData.imageCaption && (
              <figcaption className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                {aboutData.imageCaption}
              </figcaption>
            )}
          </figure>
        </FadeIn>
      </Container>
      <Impact />
      <Values />

      {/* Dynamic Team Section */}
      <Container as="div" className="mt-24 sm:mt-32 lg:mt-40">
        <div id="team" className="section-padding">
          <FadeIn>
            <h2 className="eyebrow-style text-neutral-950 xl:mb-2">
              {tTeam("eyebrow")}
            </h2>
            <p className="title-style text-neutral-950">{tTeam("title")}</p>
            <p className="paragraph-style subsection-padding max-w-xl text-neutral-950 md:max-w-5xl">
              {tTeam("description")}
            </p>
          </FadeIn>
        </div>
        <div className="mt-16">
          <TeamList data={groupedTeamMembers} />
        </div>
      </Container>

      <Culture />

      <div className="section-padding" />
    </>
  );
}
