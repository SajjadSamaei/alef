import configPromise from "@payload-config";
import { getPayload, TypedLocale } from "payload";
import { draftMode } from "next/headers";
import { cache } from "react";
import { LivePreviewListener } from "@/payload/components/LivePreviewListener";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImageMedia } from "@/components/Blog/Media/TeamPortraitMedia";
import { CardContent, SharpCard } from "@/components/ui/shadcn/card";
import { Details } from "@/components/Team/details";
import RichText from "@/components/RichText/BlogRichText";
import { Title } from "@/components/Team/title";
import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import localization from "@/src/i18n/localization";
import clsx from "clsx";
import { getDirection } from "@/utils/hooks/useDirection";
import { Team } from "@/src/payload-types";
import { FallbackToastNotifier } from "@/components/Blog/UI/FallbackToastNotifier";
import { Container } from "@/components/chegall/studio/Container";
import { requireEnabledPage } from "@/payload/utilities/siteSettings";

const { BASE_URL } = process.env;
const DEFAULT_LOCALE = localization.defaultLocale || "en";

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });

  const posts = await payload.find({
    collection: "team",
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

async function getLinkedAuthorAndPosts(
  teamMemberId: number | string,
  locale: string,
) {
  const payload = await getPayload({ config: configPromise });

  // A. Find the Author linked to this Team Member
  const authorQuery = await payload.find({
    collection: "authors",
    where: {
      associatedTeamMember: {
        equals: teamMemberId,
      },
    },
    limit: 1,
  });

  const author = authorQuery.docs[0];
  if (!author) return null;

  // B. Find the latest 5 posts by this Author
  const postsQuery = await payload.find({
    collection: "posts", // Ensure this matches your Post collection slug
    locale: locale as TypedLocale,
    where: {
      authors: {
        equals: author.id,
      },
      // You might want to filter by locale if your posts are localized
      // or rely on Payload's fallback
    },
    limit: 5,
    sort: "-publishedAt",
  });

  return {
    name: author.name, // The public author name
    posts: postsQuery.docs,
  };
}

type Args = {
  params: Promise<{
    slug: string;
    locale: TypedLocale;
  }>;
};

export default async function TeamMemberPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = "", locale } = await paramsPromise;
  await requireEnabledPage("team", locale);

  setRequestLocale(locale);

  const siteLocale = await getLocale();
  const t = await getTranslations("Blog");
  const tGlobal = await getTranslations("Global");
  const post = await queryPostBySlug({ slug, locale });
  const authorData = post
    ? await getLinkedAuthorAndPosts(post.id, locale)
    : null;
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
    <article
      dir={direction}
      className="min-h-screen bg-white dark:bg-neutral-950"
    >
      {draft && <LivePreviewListener />}

      {isFallback && (
        <div className="container mx-auto px-6 py-4">
          <FallbackToastNotifier
            title={t("fallbackNoticeTitle", {
              requestedLang: getLanguageName(locale),
            })}
            description={t("fallbackNoticeDescription", {
              actualLang: getLanguageName(post.locale || "en"),
            })}
          />
        </div>
      )}

      <Container className="py-12 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* --- LEFT COLUMN: Image + Details (Sticky on Desktop) --- */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 flex flex-col gap-8">
              {/* Profile Image */}
              <SharpCard
                className={clsx(
                  "overflow-hidden rounded-[32px] border-none bg-neutral-100 shadow-xl dark:bg-neutral-900",
                  "aspect-[3/4] w-full",
                )}
              >
                <CardContent className="relative h-full w-full p-0">
                  {post.profilePicture && (
                    <ImageMedia
                      size="card"
                      resource={post.profilePicture}
                      fill
                      imgClassName="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  )}
                </CardContent>
              </SharpCard>

              {/* 👇 DETAILS (Desktop Only): Visible on lg screens and up */}
              <div className="hidden lg:block">
                <Details post={post} relatedArticles={authorData} />
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Title + Bio --- */}
          <div className="flex flex-col gap-8 lg:col-span-7 xl:col-span-8">
            {/* Header: Name & Role */}
            <div className="border-b border-neutral-200 pb-8 dark:border-neutral-800">
              <Title post={post} />
            </div>

            {/* 👇 DETAILS (Mobile Only): Hidden on lg screens and up */}
            <div className="block lg:hidden">
              <Details post={post} relatedArticles={authorData} />
            </div>

            {/* Main Bio Content */}
            {post.details && (
              <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                <RichText
                  data={post.details}
                  enableGutter={false}
                  enableProse={true}
                  locale={siteLocale}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </article>
  );
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = "", locale } = await params;
  const post = await queryPostBySlug({ slug, locale });
  const t = await getTranslations();
  const brandName = locale === "fa" ? "چگال" : "Chegall";

  if (!post) {
    notFound();
  }

  const heroImage =
    typeof post.profilePicture === "object" ? post.profilePicture : undefined;

  const ogLocale = locale === "fa" ? "fa_IR" : "en_US";

  return {
    title: post.name || t("blog-name"),
    description: `${post.name} | ${brandName}` || t("site-official-name"),
    openGraph: {
      siteName: t("site-name"),
      locale: ogLocale,
      url: `${BASE_URL}${locale}/team/${post.slug}`,
      images: [
        {
          url: heroImage?.sizes?.card?.url ?? "",
          width: 768,
          height: 1024,
          alt: heroImage?.alt ?? t("site-official-name"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      description: post.bio || t("site-official-name"),
      images: [heroImage?.sizes?.card?.url ?? ""],
    },
  };
}

const queryPostBySlug = cache(
  async ({ slug, locale }: { slug: string; locale: TypedLocale }) => {
    const { isEnabled: draft } = await draftMode();
    const payload = await getPayload({ config: configPromise });
    const defaultLocale = localization.defaultLocale || "en";

    const result = await payload.find({
      collection: "team",
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
    return doc as Team & { locale?: TypedLocale };
  },
);
