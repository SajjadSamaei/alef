"use client";

import clsx from "clsx";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { GridPattern } from "@/components/chegall/studio/GridPattern";
import { Link } from "@/src/i18n/routing";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia"; // ✅ Use ImageMedia
import { TagList, TagListItem } from "@/components/chegall/studio/TagList";
import { useTranslations } from "next-intl";
import { GradientComponent } from "@/components/chegall/radient/gradient";
import type { Media, ServicesPage } from "@/src/payload-types";

type ServiceContent =
  | ServicesPage["architecture"]
  | ServicesPage["interior"]
  | ServicesPage["urban"]
  | ServicesPage["supervision"]
  | ServicesPage["restoration"];

const resolveTags = (content: ServiceContent, fallback: string[]) => {
  const tags = content?.tags
    ?.map((item) => item.label)
    .filter((label): label is string => Boolean(label));

  return tags?.length ? tags : fallback;
};

// ✅ 1. Update ServiceSection to accept 'media' instead of 'image' props
function ServiceSection({
  id,
  title,
  subtitle,
  media,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  media: number | Media | null | undefined;
  children: React.ReactNode;
}) {
  return (
    <Container
      id={id}
      className="group/section scroll-mt-24 [counter-increment:section]"
    >
      <div className="lg:flex lg:items-start lg:gap-16">
        {/* Left: Sticky Header */}
        <div className="lg:sticky lg:top-32 lg:w-1/3">
          <FadeIn>
            <div className="flex items-center gap-4 lg:block">
              <div className="mb-4 hidden h-px w-12 bg-neutral-200 lg:block dark:bg-neutral-800" />
              <div>
                <h2 className="font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl dark:text-white">
                  {title}
                </h2>
                <p className="mt-2 text-lg font-medium text-neutral-400 dark:text-neutral-500">
                  {subtitle}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right: Glass Card Content */}
        <div className="mt-12 lg:mt-0 lg:w-2/3">
          <FadeIn>
            <div className="overflow-hidden rounded-[40px] border border-neutral-200 bg-neutral-50/50 p-2 dark:border-white/10 dark:bg-white/5">
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] bg-neutral-100 dark:bg-neutral-900">
                {/* ✅ ImageMedia with Square/Card size */}
                <ImageMedia
                  resource={media}
                  fill
                  size="card"
                  imgClassName="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-black/5 ring-inset dark:ring-white/10" />
              </div>

              {/* Content */}
              <div className="px-6 py-8 sm:px-8 sm:py-10">{children}</div>
            </div>
          </FadeIn>
        </div>
      </div>
    </Container>
  );
}

// ✅ 2. Update Components to accept data prop

export function Architecture({
  media,
  content,
}: {
  media: number | Media | null | undefined;
  content?: ServicesPage["architecture"];
}) {
  const t = useTranslations("ServicesPage.Architecture");
  const tags = resolveTags(content, t.raw("tags"));
  return (
    <ServiceSection
      id={t("id")}
      title={content?.title || t("title")}
      subtitle={content?.subtitle || t("subtitle")}
      media={media}
    >
      <div className="sub-paragraph-style space-y-6 text-base text-neutral-600 dark:text-neutral-400">
        <p>{content?.description || t("description")}</p>
      </div>
      <h3 className="font-display mt-8 text-lg font-semibold text-neutral-950 dark:text-white">
        {content?.detailsTitle || t("detailsTitle")}
      </h3>
      <TagList className="mt-4">
        {tags.map((tag: string) => (
          <TagListItem key={tag}>{tag}</TagListItem>
        ))}
      </TagList>
    </ServiceSection>
  );
}

export function InteriorDesign({
  media,
  content,
}: {
  media: number | Media | null | undefined;
  content?: ServicesPage["interior"];
}) {
  const t = useTranslations("ServicesPage.InteriorDesign");
  const tags = resolveTags(content, t.raw("tags"));
  return (
    <ServiceSection
      id={t("id")}
      title={content?.title || t("title")}
      subtitle={content?.subtitle || t("subtitle")}
      media={media}
    >
      <div className="sub-paragraph-style space-y-6 text-base text-neutral-600 dark:text-neutral-400">
        <p>{content?.description || t("description")}</p>
      </div>
      <h3 className="font-display mt-8 text-lg font-semibold text-neutral-950 dark:text-white">
        {content?.detailsTitle || t("detailsTitle")}
      </h3>
      <TagList className="mt-4">
        {tags.map((tag: string) => (
          <TagListItem key={tag}>{tag}</TagListItem>
        ))}
      </TagList>
    </ServiceSection>
  );
}

export function UrbanDesign({
  media,
  content,
}: {
  media: number | Media | null | undefined;
  content?: ServicesPage["urban"];
}) {
  const t = useTranslations("ServicesPage.UrbanDesign");
  const tags = resolveTags(content, t.raw("tags"));
  return (
    <ServiceSection
      id={t("id")}
      title={content?.title || t("title")}
      subtitle={content?.subtitle || t("subtitle")}
      media={media}
    >
      <div className="sub-paragraph-style space-y-6 text-base text-neutral-600 dark:text-neutral-400">
        <p>{content?.description || t("description")}</p>
      </div>
      <h3 className="font-display mt-8 text-lg font-semibold text-neutral-950 dark:text-white">
        {content?.detailsTitle || t("detailsTitle")}
      </h3>
      <TagList className="mt-4">
        {tags.map((tag: string) => (
          <TagListItem key={tag}>{tag}</TagListItem>
        ))}
      </TagList>
    </ServiceSection>
  );
}

export function Supervision({
  media,
  content,
}: {
  media: number | Media | null | undefined;
  content?: ServicesPage["supervision"];
}) {
  const t = useTranslations("ServicesPage.Supervision");
  const tags = resolveTags(content, t.raw("tags"));
  return (
    <ServiceSection
      id={t("id")}
      title={content?.title || t("title")}
      subtitle={content?.subtitle || t("subtitle")}
      media={media}
    >
      <div className="sub-paragraph-style space-y-6 text-base text-neutral-600 dark:text-neutral-400">
        <p>{content?.description || t("description")}</p>
      </div>
      <h3 className="font-display mt-8 text-lg font-semibold text-neutral-950 dark:text-white">
        {content?.detailsTitle || t("detailsTitle")}
      </h3>
      <TagList className="mt-4">
        {tags.map((tag: string) => (
          <TagListItem key={tag}>{tag}</TagListItem>
        ))}
      </TagList>
    </ServiceSection>
  );
}

export function Restoration({
  media,
  content,
}: {
  media: number | Media | null | undefined;
  content?: ServicesPage["restoration"];
}) {
  const t = useTranslations("ServicesPage.Restoration");
  const tags = resolveTags(content, t.raw("tags"));
  return (
    <ServiceSection
      id={t("id")}
      title={content?.title || t("title")}
      subtitle={content?.subtitle || t("subtitle")}
      media={media}
    >
      <div className="sub-paragraph-style space-y-6 text-base text-neutral-600 dark:text-neutral-400">
        <p>{content?.description || t("description")}</p>
      </div>
      <h3 className="font-display mt-8 text-lg font-semibold text-neutral-950 dark:text-white">
        {content?.detailsTitle || t("detailsTitle")}
      </h3>
      <TagList className="mt-4">
        {tags.map((tag: string) => (
          <TagListItem key={tag}>{tag}</TagListItem>
        ))}
      </TagList>
    </ServiceSection>
  );
}

export function Process({ content }: { content?: ServicesPage["process"] }) {
  const t = useTranslations("ServicesPage.Process");

  return (
    <div className="section-style relative mt-24 sm:mt-32 lg:mt-40">
      <div className="absolute inset-x-2 top-0 bottom-0 overflow-hidden rounded-[40px] bg-neutral-100 ring-1 ring-neutral-950/5 dark:bg-neutral-900 dark:ring-white/10">
        <GradientComponent
          variant="earth"
          className="absolute inset-0 h-full w-full opacity-30 transition-opacity duration-500 group-hover:opacity-50"
        />

        <GridPattern
          width={60}
          height={60}
          x={-1}
          y={-1}
          className={clsx(
            "absolute inset-0 h-full w-full",
            "[mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]",
            "fill-neutral-100 stroke-neutral-950/5 dark:fill-neutral-800 dark:stroke-white/5",
          )}
          interactive={true}
        />
      </div>

      <div className="relative py-24 sm:py-32">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl dark:text-white">
                {content?.title || t("title")}
              </h3>
              <p className="mt-6 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                {content?.description || t("description")}
              </p>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/process"
                  aria-label={t("ariaLabel")}
                  className={clsx(
                    "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300",
                    "bg-neutral-950 text-white hover:scale-105 hover:bg-neutral-800",
                    "dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200",
                  )}
                >
                  {content?.buttonLabel || t("buttonLabel")}
                </Link>
              </div>
            </div>
          </FadeIn>
        </Container>
      </div>
    </div>
  );
}
