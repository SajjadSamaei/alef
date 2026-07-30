"use client";

import clsx from "clsx";
import { motion, useSpring, MotionValue, useMotionValue } from "framer-motion";
import {
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
  useMemo,
} from "react";
import useMeasure, { RectReadOnly } from "react-use-measure";
import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import { Link } from "@/src/i18n/routing";
import { toIndiaDigits } from "@/payload/utilities/helpers/strings-numbers";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { useLocale, useTranslations, useFormatter } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";
import type { Post, BlogMedia as Media } from "@/src/payload-types";
import {
  formatGregorianRelativeDate,
  formatPersianRelativeDate,
} from "@/payload/utilities/formatDateTime";

export type SpotlightPost = Pick<
  Post,
  "id" | "title" | "slug" | "categories" | "meta" | "heroImage" | "publishedAt"
>;

/* -------------------------------------------------------------------------- */
/* CARD COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

interface CardProps {
  post: SpotlightPost;
  bounds: RectReadOnly;
  scrollX: MotionValue<number>;
  index: number;
  isActive: boolean;
}

function Card({ post, bounds, scrollX, index, isActive }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("Common");

  const computeVisuals = useCallback(() => {
    // Safety check
    if (!ref.current || bounds.width === 0) return { opacity: 1, scale: 1 };

    const rect = ref.current.getBoundingClientRect();
    const boundsCenter = (bounds.left + bounds.right) / 2;
    const elementCenter = (rect.left + rect.right) / 2;

    // Calculate raw distance from center
    const distance = Math.abs(boundsCenter - elementCenter);

    // FIX 1: If active and very close (sub-pixel drift), force full visibility
    if (isActive && distance < 5) {
      return { opacity: 1, scale: 1 };
    }

    const maxDistance = bounds.width / 2 + rect.width / 2;
    const threshold = bounds.width * 0.2;

    const adjustedDistance = Math.max(0, distance - threshold);
    const progress = Math.min(1, adjustedDistance / maxDistance);

    const opacity = Math.max(0.5, 1 - progress * 0.5);
    const scale = Math.max(0.92, 1 - progress * 0.1);

    return { opacity, scale };
  }, [bounds, isActive]);

  // Use a softer spring for smoother visual recovery
  const opacity = useSpring(1, { stiffness: 120, damping: 20 });
  const scale = useSpring(1, { stiffness: 120, damping: 20 });

  useLayoutEffect(() => {
    const { opacity: o, scale: s } = computeVisuals();
    opacity.set(o);
    scale.set(s);
  }, [computeVisuals, opacity, scale]);

  // FIX 2: Add isActive to dependency array to force update when index changes
  useEffect(() => {
    const { opacity: o, scale: s } = computeVisuals();
    opacity.set(o);
    scale.set(s);
  }, [isActive, computeVisuals, opacity, scale]);

  useEffect(() => {
    return scrollX.on("change", () => {
      const { opacity: o, scale: s } = computeVisuals();
      opacity.set(o);
      scale.set(s);
    });
  }, [scrollX, computeVisuals, opacity, scale]);

  const { slug, title, heroImage, publishedAt, categories } = post;
  const href = `/blog/${slug}`;
  const hasImage = heroImage && typeof heroImage === "object";

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className={clsx(
        "group relative flex h-full shrink-0 flex-col overflow-hidden",
        "w-[75vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[35vw]",
        "rounded-[40px] sm:rounded-[40px]",
        "border border-white/10 bg-neutral-900 shadow-2xl",
        isActive ? "z-10" : "z-0",
      )}
    >
      <Link href={href} className="absolute inset-0 z-30 focus:outline-none">
        <span className="sr-only">{title}</span>
      </Link>

      <div className="absolute inset-0 h-full w-full">
        {hasImage && (
          <div className="h-full w-full transition-transform duration-1000 ease-out group-hover:scale-105">
            <ImageMedia
              fill
              resource={heroImage as Media}
              imgClassName="object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80" />
      </div>

      <div className="relative z-20 flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap gap-2">
          {categories?.slice(0, 2).map((cat, i) => {
            if (typeof cat === "object" && cat.title) {
              return (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] font-bold tracking-wide text-white uppercase backdrop-blur-md"
                >
                  {cat.title}
                </span>
              );
            }
            return null;
          })}
        </div>

        <div className="flex flex-col gap-4">
          {publishedAt && (
            <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <ClockIcon className="h-3.5 w-3.5" />
              <time dateTime={publishedAt}>
                {locale === "fa"
                  ? formatPersianRelativeDate(publishedAt)
                  : formatGregorianRelativeDate(publishedAt)}
              </time>
            </div>
          )}

          <h2 className="font-display text-2xl leading-tight font-bold text-white sm:text-3xl lg:text-4xl">
            {locale === "fa" ? toIndiaDigits(title) : title}
          </h2>

          <div className="flex items-center gap-2 text-sm font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span>{t("readMore")}</span>
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* LANDING POSTS                                                              */
/* -------------------------------------------------------------------------- */

interface LandingPostsProps {
  posts: SpotlightPost[];
}

export function LandingPosts({ posts }: LandingPostsProps) {
  const locale = useLocale();
  const t = useTranslations("Common");
  const direction = getDirection(locale);
  const isRtl = direction === "rtl";
  const scrollMultiplier = isRtl ? -1 : 1;

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const [measureRef, bounds] = useMeasure();
  const [activeIndex, setActiveIndex] = useState(0);

  // Initialize as TRUE so initial render looks correct
  const [isSnapping, setIsSnapping] = useState(true);

  // Animation & Interaction Refs
  const isDragging = useRef(false);
  const isAnimating = useRef(false);
  const isAutoPlaying = useRef(true);
  const autoplayTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollEndTimeout = useRef<NodeJS.Timeout | null>(null);

  if (!posts || posts.length === 0) return null;

  const CLONES = Math.min(posts.length, 3);
  const originalLength = posts.length;

  const extendedPosts = useMemo(() => {
    if (!posts.length) return [];
    return [...posts.slice(-CLONES), ...posts, ...posts.slice(0, CLONES)];
  }, [posts, CLONES]);

  const getStep = () => {
    // Safer check for children
    if (!scrollRef.current || scrollRef.current.children.length === 0) return 0;
    const el = scrollRef.current.children[0] as HTMLElement;
    // We hardcode 24 because we know 'gap-6' is 24px.
    // relying on dynamic gap calculation can be flaky on mobile.
    return el.getBoundingClientRect().width + 24;
  };

  /* --- Autoplay Logic --- */

  const pauseAutoplay = useCallback(() => {
    isAutoPlaying.current = false;
    if (autoplayTimeout.current) clearTimeout(autoplayTimeout.current);
    autoplayTimeout.current = setTimeout(() => {
      isAutoPlaying.current = true;
    }, 4000);
  }, []);

  const autoNext = useCallback(() => {
    if (
      isDragging.current ||
      isAnimating.current ||
      !isAutoPlaying.current ||
      !scrollRef.current
    )
      return;

    const step = getStep();
    if (step <= 1) return;

    const currentScroll = Math.abs(scrollRef.current.scrollLeft);
    const nextIndex = Math.round(currentScroll / step) + 1;

    scrollToIndex(nextIndex, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getStep]);

  useEffect(() => {
    const interval = setInterval(autoNext, 4000);
    return () => clearInterval(interval);
  }, [autoNext]);

  /* --- Teleport & Reset --- */
  const teleportIfNeeded = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const step = getStep();
    if (step <= 1) return;

    const currentScroll = Math.abs(container.scrollLeft);
    const index = Math.round((currentScroll + step / 2) / step);
    const realWidth = originalLength * step;

    if (index >= originalLength + CLONES || index < CLONES) {
      let newScrollPos;
      if (index >= originalLength + CLONES) {
        newScrollPos = (currentScroll - realWidth) * scrollMultiplier;
      } else {
        newScrollPos = (currentScroll + realWidth) * scrollMultiplier;
      }

      container.scrollTo({
        left: newScrollPos,
        behavior: "instant",
      });
      scrollX.set(newScrollPos);
    }
  }, [originalLength, scrollMultiplier, CLONES, scrollX]);

  /* --- Scroll Handler --- */
  const handleScroll = useCallback(() => {
    if (isAnimating.current) return;

    const container = scrollRef.current;
    if (!container) return;

    scrollX.set(container.scrollLeft);
    const step = getStep();
    if (step <= 1) return;

    const scroll = Math.abs(container.scrollLeft);
    const index = Math.round(scroll / step);
    setActiveIndex((prev) => (prev === index ? prev : index));

    if (scrollEndTimeout.current) clearTimeout(scrollEndTimeout.current);
    scrollEndTimeout.current = setTimeout(() => {
      if (!isDragging.current && !isAnimating.current) {
        teleportIfNeeded();
      }
    }, 100);
  }, [scrollX, teleportIfNeeded]);

  /* --- Navigation (Button / Auto) --- */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollToIndex = (index: number, isAuto = false) => {
    const container = scrollRef.current;
    if (!container) return;

    if (!isAuto) pauseAutoplay();

    const step = getStep();
    if (step <= 0) return;

    isAnimating.current = true;

    // 1. Disable snapping immediately
    setIsSnapping(false);

    // 2. Wait for the React render cycle (1 frame) to remove the 'snap-x' class.
    requestAnimationFrame(() => {
      if (!container) return;

      container.scrollTo({
        left: index * step * scrollMultiplier,
        behavior: "smooth",
      });

      // 3. Re-enable after animation
      setTimeout(() => {
        isAnimating.current = false;

        // FIX 3: Explicitly set scrollX on finish.
        // This accounts for mobile browsers throttling "scroll" events at the very end.
        if (container) {
          scrollX.set(container.scrollLeft);
        }

        teleportIfNeeded();
        // Wait another frame before re-enabling snap to prevent jerky correction
        requestAnimationFrame(() => setIsSnapping(true));
      }, 600);
    });
  };

  /* --- Initial Setup --- */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const step = getStep();
    const start = step * CLONES * scrollMultiplier;

    container.scrollTo({
      left: start,
      behavior: "instant",
    });

    setActiveIndex(CLONES);
    scrollX.set(start);

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll, scrollMultiplier, scrollX, CLONES]);

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const displayIndex = (activeIndex - CLONES + originalLength) % originalLength;

  return (
    <div ref={measureRef} className="relative w-full">
      <div
        ref={scrollRef}
        dir={direction}
        onPointerDown={() => {
          isDragging.current = true;
          setIsSnapping(true);
          pauseAutoplay();
        }}
        onPointerUp={() => (isDragging.current = false)}
        onPointerLeave={() => (isDragging.current = false)}
        className={clsx(
          "flex gap-6 px-[12.5vw] sm:px-[20vw] lg:px-[30vw]",
          "overflow-x-auto overflow-y-hidden",
          "h-[450px] sm:h-[550px] lg:h-[650px]",
          "overscroll-x-contain",
          // The ternary ensures 'snap-x' is completely removed when buttons are clicked
          isSnapping ? "snap-x snap-mandatory" : "",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "cursor-grab active:cursor-grabbing",
        )}
      >
        {extendedPosts.map((post, i) => (
          <div
            key={`${post.slug}-${i}`}
            className={clsx(isSnapping && "snap-center")}
          >
            <Card
              post={post}
              index={i}
              bounds={bounds}
              scrollX={scrollX}
              isActive={i === activeIndex}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex w-full flex-col items-center justify-between gap-8 px-4 sm:flex-row sm:px-12 lg:mt-12 lg:px-[10vw]">
        {/* Nav Buttons */}
        <div className="order-2 flex items-center gap-3 rounded-full border border-neutral-200 bg-white/50 p-1.5 backdrop-blur-xl sm:order-1 dark:border-white/10 dark:bg-black/40">
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200/50 transition-all hover:bg-neutral-900 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-black"
            aria-label="Previous"
          >
            <PrevIcon className="h-5 w-5" />
          </button>
          <div className="h-4 w-px bg-neutral-300 dark:bg-white/10" />
          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200/50 transition-all hover:bg-neutral-900 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-black"
            aria-label="Next"
          >
            <NextIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="order-1 flex gap-2 sm:order-2">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i + CLONES)}
              className={clsx(
                "h-2.5 rounded-full transition-all duration-500",
                i === displayIndex
                  ? "w-8 bg-neutral-900 dark:bg-white"
                  : "w-2.5 bg-neutral-300 hover:bg-neutral-500 dark:bg-white/20 dark:hover:bg-white/40",
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/blog"
          className="group order-3 flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-6 py-3 text-sm font-bold text-neutral-900 transition-all hover:border-neutral-300 hover:bg-neutral-200 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          <span>{t("viewAllArticles")}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
