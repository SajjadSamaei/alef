import clsx from "clsx";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { TagList, TagListItem } from "@/components/chegall/studio/TagList";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia"; // ✅ Use ImageMedia
import { GradientComponent } from "@/components/chegall/radient/gradient";
import { TypingAnimation } from "@/components/ui/magicui/typing-animation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations, useFormatter } from "next-intl";
import { notFound } from "next/navigation";
import { locales } from "@/src/i18n/i18n.config";
import { TypedLocale } from "payload";
import type { ProcessPage } from "@/src/payload-types";
import type { Media } from "@/src/payload-types";
import { getCachedGlobal } from "@/payload/utilities/getGlobals";
import { getSiteSettings, getStaticPageMetadata, requireEnabledPage } from "@/payload/utilities/siteSettings";

type Locale = (typeof locales)[number];

type Props = {
  params: Promise<{ locale: Locale }>;
};

// --- Metadata ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.Process" });
  const settings = await getSiteSettings(locale as TypedLocale);
  return getStaticPageMetadata({ settings, page: "process", fallbackTitle: t("title"), fallbackDescription: t("description") });
}

// --- Helper Type ---
type ProcessMedia = number | Media | null | undefined;
type PhaseData =
  | ProcessPage["vision"]
  | ProcessPage["design"]
  | ProcessPage["technical"]
  | ProcessPage["execution"];

const resolveParagraphs = (data: PhaseData, fallback: string[]) => {
  const paragraphs = data?.paragraphs
    ?.map((item) => item.text)
    .filter((text): text is string => Boolean(text));

  return paragraphs?.length ? paragraphs : fallback;
};

const resolveTags = (data: PhaseData, fallback: string[]) => {
  const tags = data?.tags
    ?.map((item) => item.label)
    .filter((label): label is string => Boolean(label));

  return tags?.length ? tags : fallback;
};

// --- Shared Component ---

function ProcessSection({
  title,
  subtitle,
  children,
  media, // ✅ Changed from 'image' to 'media'
  stepNumber,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  media: ProcessMedia;
  stepNumber: string;
}) {
  return (
    <Container className="group/section [counter-increment:section]">
      <div className="lg:flex lg:items-start lg:gap-16">
        {/* Left: Sticky Number & Title */}
        <div className="lg:sticky lg:top-32 lg:w-1/3">
          <FadeIn>
            <div className="flex items-center gap-4 lg:block">
              <span className="font-display text-6xl font-bold text-neutral-200 dark:text-neutral-800">
                {stepNumber}
              </span>
              <div className="lg:mt-4">
                <h2 className="font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl dark:text-white">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right: Content Card */}
        <div className="mt-12 lg:mt-0 lg:w-2/3">
          <FadeIn>
            <div className="overflow-hidden rounded-[40px] border border-neutral-200 bg-neutral-50/50 p-2 dark:border-white/10 dark:bg-white/5">
              {/* Image Container */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[32px] bg-neutral-100 dark:bg-neutral-900">
                {/* ✅ ImageMedia Implementation */}
                <ImageMedia
                  resource={media}
                  fill
                  size="large" // Request high quality for these large headers
                  imgClassName="object-cover transition-transform duration-700 group-hover/section:scale-105"
                />

                {/* Inner Shadow for depth */}
                <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-black/5 ring-inset dark:ring-white/10" />
              </div>

              {/* Text Content */}
              <div className="px-6 py-8 sm:px-8 sm:py-10">
                <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {children}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </Container>
  );
}

// --- 1. Vision & Strategy ---
function VisionPhase({ data }: { data: ProcessPage["vision"] }) {
  const t = useTranslations("Process.Sections.Vision");
  const format = useFormatter();
  const paragraphs = resolveParagraphs(data, [t("p1"), t("p2")]);
  const tags = resolveTags(data, t.raw("tags"));

  return (
    <ProcessSection
      stepNumber={format.number(1, { minimumIntegerDigits: 2 })}
      title={data.title || t("title")}
      subtitle={data.subtitle || t("subtitle")}
      media={data.image}
    >
      <div className="space-y-6">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h3 className="font-display mt-8 text-lg font-semibold text-neutral-950 dark:text-white">
        {data.detailsTitle || t("detailsTitle")}
      </h3>
      <TagList className="mt-4">
        {tags.map((tag: string) => (
          <TagListItem key={tag}>{tag}</TagListItem>
        ))}
      </TagList>
    </ProcessSection>
  );
}

// --- 2. Concept & Design ---
function DesignPhase({ data }: { data: ProcessPage["design"] }) {
  const t = useTranslations("Process.Sections.Design");
  const format = useFormatter();
  const paragraphs = resolveParagraphs(data, [t("p1")]);
  const tags = resolveTags(data, t.raw("tags"));

  return (
    <ProcessSection
      stepNumber={format.number(2, { minimumIntegerDigits: 2 })}
      title={data.title || t("title")}
      subtitle={data.subtitle || t("subtitle")}
      media={data.image}
    >
      <div className="space-y-6">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h3 className="font-display mt-8 text-lg font-semibold text-neutral-950 dark:text-white">
        {data.detailsTitle || t("detailsTitle")}
      </h3>
      <TagList className="mt-4">
        {tags.map((tag: string) => (
          <TagListItem key={tag}>{tag}</TagListItem>
        ))}
      </TagList>
    </ProcessSection>
  );
}

// --- 3. Technical Development ---
function TechnicalPhase({ data }: { data: ProcessPage["technical"] }) {
  const t = useTranslations("Process.Sections.Technical");
  const format = useFormatter();
  const paragraphs = resolveParagraphs(data, [t("p1")]);
  const tags = resolveTags(data, t.raw("tags"));

  return (
    <ProcessSection
      stepNumber={format.number(3, { minimumIntegerDigits: 2 })}
      title={data.title || t("title")}
      subtitle={data.subtitle || t("subtitle")}
      media={data.image}
    >
      <div className="space-y-6">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h3 className="font-display mt-8 text-lg font-semibold text-neutral-950 dark:text-white">
        {data.detailsTitle || t("detailsTitle")}
      </h3>
      <TagList className="mt-4">
        {tags.map((tag: string) => (
          <TagListItem key={tag}>{tag}</TagListItem>
        ))}
      </TagList>
    </ProcessSection>
  );
}

// --- 4. Execution & Supervision ---
function ExecutionPhase({ data }: { data: ProcessPage["execution"] }) {
  const t = useTranslations("Process.Sections.Execution");
  const format = useFormatter();
  const paragraphs = resolveParagraphs(data, [t("p1")]);
  const tags = resolveTags(data, t.raw("tags"));

  return (
    <ProcessSection
      stepNumber={format.number(4, { minimumIntegerDigits: 2 })}
      title={data.title || t("title")}
      subtitle={data.subtitle || t("subtitle")}
      media={data.image}
    >
      <div className="space-y-6">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <h3 className="font-display mt-8 text-lg font-semibold text-neutral-950 dark:text-white">
        {data.detailsTitle || t("detailsTitle")}
      </h3>
      <TagList className="mt-4">
        {tags.map((tag: string) => (
          <TagListItem key={tag}>{tag}</TagListItem>
        ))}
      </TagList>
    </ProcessSection>
  );
}

// --- Main Page ---

export default async function ProcessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
  await requireEnabledPage("process", locale as TypedLocale);

  // ✅ Fetch Data
  const processData = (await getCachedGlobal(
    "process-page",
    1,
    locale as TypedLocale,
  )()) as ProcessPage;
  const tHero = await getTranslations("Process.Hero");

  return (
    <>
      {/* 1. Gradient Hero */}
      <div className="section-style relative mt-10 lg:mt-10">
        <GradientComponent className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
        <Container className="relative">
          <div className="flex flex-col items-center justify-center gap-6 pt-24 pb-32 md:pt-32 md:pb-48">
            <div className="flex items-center justify-center px-4">
              <TypingAnimation className="font-display text-center text-5xl font-medium tracking-tight text-neutral-950 sm:text-7xl md:text-8xl">
                {processData.hero?.title || tHero("title")}
              </TypingAnimation>
            </div>
            <p className="max-w-xl text-center text-lg leading-relaxed text-neutral-600 sm:text-xl dark:text-neutral-400">
              {processData.hero?.description || tHero("description")}
            </p>
          </div>
        </Container>
      </div>

      {/* 2. Process Steps */}
      <div className="mt-24 space-y-24 sm:mt-32 sm:space-y-32">
        {/* ✅ Pass dynamic media */}
        <VisionPhase data={processData.vision} />
        <DesignPhase data={processData.design} />
        <TechnicalPhase data={processData.technical} />
        <ExecutionPhase data={processData.execution} />
      </div>

      <div className="section-padding" />
    </>
  );
}
