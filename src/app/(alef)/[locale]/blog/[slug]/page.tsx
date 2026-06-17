import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PayloadRedirects } from "@/payload/components/PayloadRedirects";
import configPromise from "@payload-config";
import { getPayload, TypedLocale } from "payload";
import { draftMode } from "next/headers";
import { cache } from "react";
import RichText from "@/components/RichText/BlogRichText";
import type { Post } from "@/src/payload-types";
import { PostHero } from "@/components/Blog/UI/PostHero/Component";
import { LivePreviewListener } from "@/payload/components/LivePreviewListener";
import { TagList, TagListItem } from "@/components/ui/TagList";
import { Link } from "@/src/i18n/routing";
import { getDirection } from "@/utils/hooks/useDirection";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import localization from "@/src/i18n/localization";
import { FallbackToastNotifier } from "@/components/Blog/UI/FallbackToastNotifier";
import { TableOfContents } from "@/components/Blog/UI/TableOfContents"; // New Component
import { extractHeadings } from "@/components/Blog/UI/TableOfContents/hooks/extractHeadings"; // New Utility
import { RelatedPosts } from "@/components/Blog/UI/RelatedPosts/Component";
import { requireEnabledPage } from "@/payload/utilities/siteSettings";

const { BASE_URL } = process.env;
const DEFAULT_LOCALE = localization.defaultLocale || "en";

// --- Query Logic (Cached) ---
const queryPostBySlug = cache(
  async ({ slug, locale }: { slug: string; locale: TypedLocale }) => {
    const { isEnabled: draft } = await draftMode();
    const payload = await getPayload({ config: configPromise });
    const defaultLocale = localization.defaultLocale || "en";

    const result = await payload.find({
      collection: "posts",
      locale,
      fallbackLocale: defaultLocale as TypedLocale,
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      where: {
        slug: { equals: slug },
      },
    });

    const doc = result.docs?.[0] || null;
    return doc as Post & { locale?: TypedLocale };
  },
);

type Args = {
  params: Promise<{
    slug: string;
    locale: TypedLocale;
  }>;
};

// --- Page Component ---
export default async function Post({ params: paramsPromise }: Args) {
  const { slug = "", locale } = await paramsPromise;
  await requireEnabledPage("blog", locale);
  const t = await getTranslations("Blog");
  const post = await queryPostBySlug({ slug, locale });
  const direction = getDirection(locale);

  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const hasKeywords = post.keywords && post.keywords.length > 0;
  const hasRelatedPost = post.relatedPosts && post.relatedPosts.length > 0;

  const validRelatedPosts = post.relatedPosts?.filter(
    (rel) => typeof rel === "object",
  ) as Post[];

  return (
    <article dir={direction} className="bg-white dark:bg-black">
      {/* ... LivePreviewListener, FallbackToastNotifier ... */}

      <PostHero post={post} />

      <Container className="mt-16 lg:mt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* LEFT SIDEBAR (Desktop) */}
          <div className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-32 space-y-12">
              <TableOfContents headings={headings} />

              {/* Keywords (Sidebar) */}
              {hasKeywords && (
                <div className="pl-6">
                  <h4 className="mb-4 text-xs font-bold tracking-widest text-neutral-900 uppercase dark:text-white">
                    {t("keywords")}
                  </h4>
                  <TagList>
                    {post.keywords?.map(
                      (item) =>
                        item.keyword && (
                          <TagListItem key={item.id}>
                            <Link
                              href={`/blog/archive?q=${encodeURIComponent(item.keyword)}`}
                            >
                              #{item.keyword}
                            </Link>
                          </TagListItem>
                        ),
                    )}
                  </TagList>
                </div>
              )}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 lg:col-start-4">
            {post.content && (
              <RichText
                className="mx-auto"
                locale={locale}
                data={post.content}
                enableGutter={false}
              />
            )}

            {/* Mobile Keywords */}
            {hasKeywords && (
              <div className="mt-12 block lg:hidden">
                <h4 className="mb-4 text-sm font-semibold">{t("keywords")}</h4>
                <TagList>
                  {post.keywords?.map(
                    (item) =>
                      item.keyword && (
                        <TagListItem key={item.id}>
                          <Link
                            href={`/blog/archive?q=${encodeURIComponent(item.keyword)}`}
                          >
                            #{item.keyword}
                          </Link>
                        </TagListItem>
                      ),
                  )}
                </TagList>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Related Posts Section */}
      {hasRelatedPost && (
        <div className="mt-24 border-t border-neutral-200 bg-neutral-50 py-24 dark:border-white/5 dark:bg-neutral-900/50">
          <Container>
            <div className="mb-12 text-center">
              <h3 className="font-display text-3xl font-medium tracking-tight text-neutral-950 dark:text-white">
                {t("readNext")}
              </h3>
            </div>
            <RelatedPosts locale={locale} docs={validRelatedPosts} />
          </Container>
        </div>
      )}
    </article>
  );
}

// --- Metadata Generation (Optimized) ---
export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = "", locale } = await params;
  const post = await queryPostBySlug({ slug, locale });
  const t = await getTranslations();

  if (!post) return {};

  const heroImage =
    typeof post.heroImage === "object" ? post.heroImage : undefined;

  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.subtitle,
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt || undefined,
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      images: heroImage?.url ? [{ url: heroImage.url }] : [],
    },
  };
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const posts = await payload.find({
    collection: "posts",
    locale: DEFAULT_LOCALE as TypedLocale,
    draft: false,
    limit: 1000,
    pagination: false,
    select: { slug: true },
  });

  return localization.locales.flatMap((locale) =>
    posts.docs.map(({ slug }) => ({ slug, locale: locale.code })),
  );
}
