"use client";

import { useRef, useContext, useCallback, useLayoutEffect } from "react";
import { motion, useSpring, useMotionValueEvent, MotionValue } from "framer-motion";
import clsx from "clsx";
import {ImageMedia} from "@/components/Blog/Media/ImageMedia"
import { Link } from "@/src/i18n/routing";
import { ArrowLongRightIcon, ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { useLocale, useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import type { Post } from "@/src/payload-types";

// Assuming you have these context/hooks from your original code
// If not, you can remove the StaggerContext logic
import { FadeInStaggerContext } from "@/components/ui/FadeIn"; 

interface BlogCardProps {
  post: Post;
  index: number;
  isActive: boolean;
  length: number; // Total items (posts + cta)
  bounds: { width: number; left: number; right: number };
  scrollX: MotionValue<number>;
}

export function BlogCard({
  post,
  index,
  isActive,
  length,
  bounds,
  scrollX,
}: BlogCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const direction = useDirection();
  const isRtl = direction === "rtl";
  
  // Use Context if available, otherwise null
  let isInStaggerGroup = useContext(FadeInStaggerContext);

  const computeOpacity = useCallback(() => {
    const element = ref.current;
    if (!element || bounds.width === 0) return 1;

    const rect = element.getBoundingClientRect();

    if (rect.left < bounds.left) {
      const diff = bounds.left - rect.left;
      const percent = diff / rect.width;
      return Math.max(0.5, 1 - percent);
    } else if (rect.right > bounds.right) {
      const diff = rect.right - bounds.right;
      const percent = diff / rect.width;
      return Math.max(0.5, 1 - percent);
    } else {
      return 1;
    }
  }, [ref, bounds.width, bounds.left, bounds.right]);

  const opacity = useSpring(computeOpacity(), {
    stiffness: 154,
    damping: 23,
  });

  useLayoutEffect(() => {
    opacity.set(computeOpacity());
  }, [computeOpacity, opacity]);

  useMotionValueEvent(scrollX, "change", () => {
    opacity.set(computeOpacity());
  });

  // Handle Image Data
  const heroImage = typeof post.heroImage === "object" ? post.heroImage : null;
  const imageUrl = heroImage?.sizes?.card?.url || heroImage?.url || "";
  
  // Format Date
  const dateStr = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString(isRtl ? 'fa-IR' : 'en-US') 
    : "";

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={clsx(
        "flex max-h-[48rem] w-full max-w-72 shrink-0 snap-center flex-col items-center justify-center sm:max-w-[20rem]",
        "shadow-sm ring-1 ring-neutral-950/5 transition hover:bg-neutral-50/10",
        "relative overflow-hidden aspect-[3/4]", // Force vertical aspect ratio
        
        // Dynamic Rounded Corners
        isRtl && index === 0 && "rounded-r-[40px]",
        isRtl && index === length - 1 && "rounded-l-[40px]",
        !isRtl && index === 0 && "rounded-l-[40px]",
        !isRtl && index === length - 1 && "rounded-r-[40px]",

        isActive ? "cursor-default" : "cursor-pointer"
      )}
    >
      <div className="relative w-full h-full">
        {imageUrl && (
          <ImageMedia
            fill
            alt={post.title || "Blog post"}
            resource={heroImage}
            className="h-full w-full object-cover"
          />
        )}

        <div className="absolute bottom-0 z-10 flex w-full flex-col items-start justify-end gap-2 p-6">
          <div className="flex gap-x-2 text-sm text-neutral-300">
             {/* Render first category if exists */}
            {post.categories && post.categories.length > 0 && (
                <span className="font-semibold text-neutral-100">
                    {typeof post.categories[0] === 'object' ? post.categories[0].title : ''}
                </span>
            )}
            <span aria-hidden="true">/</span>
            <time className="font-base">{dateStr}</time>
          </div>

          <h3 className="font-display text-xl font-semibold leading-tight text-neutral-100 line-clamp-2">
            {post.title}
          </h3>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
        />
      </div>
    </motion.div>
  );
}

export function ViewAllCard({
  index,
  length,
  bounds,
  scrollX,
}: {
  index: number;
  length: number;
  bounds: any;
  scrollX: any;
}) {
  const t = useTranslations("Blog");
  const direction = useDirection();
  const isRtl = direction === "rtl";
  const Arrow = isRtl ? ArrowLongLeftIcon : ArrowLongRightIcon;

  return (
    <motion.div
      className={clsx(
        "flex max-h-[48rem] w-full max-w-72 shrink-0 snap-center flex-col items-center justify-center sm:max-w-[20rem]",
        "bg-neutral-900 shadow-sm ring-1 ring-white/10 transition hover:bg-neutral-800",
        "relative overflow-hidden aspect-[3/4]",
        
        // Rounded corners logic for the last card
        isRtl ? "rounded-l-[40px]" : "rounded-r-[40px]"
      )}
    >
      <Link href="/blog/archive" className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center group">
        <div className="rounded-full bg-white/10 p-4 transition-transform group-hover:scale-110">
            <Arrow className="w-8 h-8 text-white" />
        </div>
        <span className="font-display text-xl font-semibold text-white">
          {t("seeAll")}
        </span>
      </Link>
    </motion.div>
  );
}