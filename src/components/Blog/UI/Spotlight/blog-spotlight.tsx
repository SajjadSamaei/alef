import { LandingPosts } from "./landing-posts";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { FadeIn } from "@/components/ui/FadeIn";
import { getLocale } from "next-intl/server";
import { TypedLocale } from "payload";
import { Container } from "@/components/chegall/studio/Container"; // Use your project's Container

export const revalidate = 60;

export default async function BlogSpotlight() {
  const payload = await getPayload({ config: configPromise });
  const locale = await getLocale();

  // Optimized Query: Only fetch what we strictly need
  const posts = await payload.find({
    collection: "posts",
    depth: 1, // Reduced depth for performance
    limit: 8,
    sort: "-publishedAt",
    overrideAccess: false,
    locale: locale as TypedLocale,
    fallbackLocale: "en",
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      publishedAt: true,
    },
  });

  if (!posts.docs.length) return null;

  return (
    <section className="secti relative overflow-hidden py-16 lg:py-24">
      <FadeIn className="section-padding">
        <div className="mb-12 flex flex-col items-center text-center">
          {/* You can add a Section Title here if needed */}
        </div>
        <LandingPosts posts={posts.docs} />
      </FadeIn>
    </section>
  );
}
