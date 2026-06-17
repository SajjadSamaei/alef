import configPromise from "@payload-config";
import { getPayload, TypedLocale } from "payload";
import { draftMode } from "next/headers";
import { cache } from "react";
import { LivePreviewListener } from "@/payload/components/LivePreviewListener";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImagesGrid } from "@/components/Portfolio/UI/CaseStudy/images-grid";
import { Details } from "@/components/Portfolio/UI/CaseStudy/details";
import RichText from "@/components/RichText/ProjectRichText";
import { Title } from "@/components/Portfolio/UI/CaseStudy/title";
import { getTranslations, getLocale } from "next-intl/server";
import localization from "@/src/i18n/localization";
import clsx from "clsx";
import { getDirection } from "@/utils/hooks/useDirection";
import { CaseStudy } from "@/src/payload-types";
import { FallbackToastNotifier } from "@/components/Blog/UI/FallbackToastNotifier";
import { requireEnabledPage } from "@/payload/utilities/siteSettings";

const { BASE_URL } = process.env;
const DEFAULT_LOCALE = localization.defaultLocale || "en";

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });

  const posts = await payload.find({
    collection: "case-studies",
    locale: DEFAULT_LOCALE as TypedLocale,
    draft: false,
    limit: 1000,
    pagination: false,
    overrideAccess: false,
    select: { slug: true },
  });

  const results = localization.locales.flatMap((locale) => {
    return posts.docs.map(({ slug }) => ({
      slug,
      locale: locale.code,
    }));
  });

  return results;
}

type Args = {
  params: Promise<{
    slug: string;
    locale: TypedLocale;
  }>;
};

export default async function CaseStudies({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = "", locale } = await paramsPromise;
  await requireEnabledPage("portfolio", locale);
  const siteLocale = await getLocale();
  const t = await getTranslations("Blog");
  const tGlobal = await getTranslations("Global");
  const post = await queryPostBySlug({ slug, locale });
  const direction = getDirection(locale);
  const isFallback = siteLocale !== locale;

  const getLanguageName = (langCode: string) => {
    try {
      return tGlobal(`lang_${langCode}`);
    } catch (e) {
      return langCode.toUpperCase();
    }
  };

  if (!post) {
    notFound();
  }
  return (
    <article dir={direction} className="section-style mt-6">
      {draft && <LivePreviewListener />}
      {isFallback && (
        <FallbackToastNotifier
          title={t("fallbackNoticeTitle", {
            requestedLang: getLanguageName(locale),
          })}
          description={t("fallbackNoticeDescription", {
            actualLang: getLanguageName(post.locale || "en"),
          })}
        />
      )}

      <ImagesGrid post={post} />

      {/* LAYOUT FIX: 
         1. Changed gap-12 to 'gap-3' to matches ImagesGrid exactly.
         2. Added 'mt-3' instead of 'mt-12' to keep vertical rhythm tight like the grid above.
      */}
      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3 xl:items-start">
        {/* --- STICKY SIDEBAR --- */}
        <div
          className={clsx(
            "xl:col-span-1",
            "xl:sticky xl:top-4",
            "xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto",
            // Visual Container
            "xl:rounded-[32px] xl:border xl:border-neutral-200/60 xl:bg-neutral-50/50 xl:p-6",
            "xl:dark:border-white/10 xl:dark:bg-white/5",
            "xl:pr-4",
          )}
        >
          <div className="-mt-4">
            <Title post={post} />
          </div>
          <Details post={post} />
        </div>

        {/* --- MAIN CONTENT --- */}
        <div
          className={clsx(
            "sm:col-span-1",
            "xl:col-span-2",
            // Removed rounded-tl logic that might look weird with the gap change
            // Added padding to separate text from the grid edges visually
            "xl:px-8 xl:py-2",
          )}
        >
          <div className="container px-0">
            <RichText
              className="mx-auto mt-0 max-w-3xl"
              data={post.details}
              enableGutter={false}
              enableProse={true}
              locale={siteLocale}
            />
          </div>
        </div>
      </div>
      <div className="section-padding" />
    </article>
  );
}

// ... Metadata and queryPostBySlug remain unchanged
export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = "", locale } = await params;
  const post = await queryPostBySlug({ slug, locale });
  const t = await getTranslations();

  if (!post) {
    notFound();
  }

  const postKeywords =
    post.keywords
      ?.map((item) => item.keyword)
      .filter((k): k is string => typeof k === "string" && k.length > 0) ?? [];

  const heroImage =
    typeof post.featuredImage === "object" ? post.featuredImage : undefined;

  const ogLocale = locale === "fa" ? "fa_IR" : "en_US";

  return {
    title: post.title || post.meta?.title || t("blog-name"),
    description:
      post.subtitle || post.meta?.description || t("site-official-name"),
    keywords: postKeywords || t("sample-keywords"),
    openGraph: {
      siteName: t("site-name"),
      locale: ogLocale,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      url: `${BASE_URL}${locale}/case-studies/${post.slug}`,
      images: [
        {
          url: heroImage?.sizes?.og?.url ?? "",
          width: 1200,
          height: 628,
          alt: heroImage?.alt ?? t("site-official-name"),
        },
        {
          url: heroImage?.sizes?.square?.url ?? "",
          width: 1080,
          height: 1080,
          alt: heroImage?.alt ?? t("site-official-name"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      description:
        post.meta?.description || post.subtitle || t("site-official-name"),
      images: [heroImage?.sizes?.twitter?.url ?? ""],
    },
  };
}

const queryPostBySlug = cache(
  async ({ slug, locale }: { slug: string; locale: TypedLocale }) => {
    const { isEnabled: draft } = await draftMode();
    const payload = await getPayload({ config: configPromise });

    const defaultLocale = localization.defaultLocale || "en";

    const result = await payload.find({
      collection: "case-studies",
      locale,
      fallbackLocale: defaultLocale as TypedLocale,
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    const doc = result.docs?.[0] || null;

    return doc as CaseStudy & { locale?: TypedLocale };
  },
);
