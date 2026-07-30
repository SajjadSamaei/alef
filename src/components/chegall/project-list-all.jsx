"use client";
import Image from "next/image";
import { clsx } from "clsx";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { createContext, useContext } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { Link } from "@/components/chegall/radient/link";

import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import { SectionIntro } from "@/components/chegall/studio/SectionIntro";
import { englishToPersianDigits } from "@/utils/helpers/strings-numbers";
import {
  works,
  worksCarousel,
} from "@/app/(chegall)/[locale]/work/chegall-works";

function PhotoLogoCard({
  name,
  title,
  date,
  img,
  blurDataURL,
  logo,
  logoPosition,
  icon,
  service,
  href,
  summary,
  children,
  bounds,
  scrollX,
  ...props
}) {
  const ref = useRef(null);

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

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      {...props}
      className="relative flex aspect-9/16 w-72 shrink-0 snap-center flex-col py-6 sm:w-96"
      // className="relative flex aspect-9/16 w-72 shrink-0 snap-end scroll-ml-[var(--scroll-padding)] flex-col sm:w-96 md:snap-start"
    >
      <FadeIn key={href} className="flex">
        <article className="relative flex w-full flex-col rounded-[40px] shadow-sm ring-1 ring-neutral-950/5 transition hover:bg-neutral-50">
          {/* Top Section: Photo with Logo */}
          <div className="relative basis-2/3">
            {/* Photo */}
            <Link href={href} className="block">
              <Image
                width={1080}
                height={1080}
                alt="building photo"
                placeholder="blur"
                blurDataURL={blurDataURL}
                src={img}
                className="h-96 w-96 rounded-t-[40px] object-cover"
              />
            </Link>
            {/* Effect */}
            <Link
              href={href}
              aria-hidden="true"
              className="from-100 absolute inset-0 bg-linear-to-t from-black/40 to-20%"
            />

            {/* Logo */}
            {/* <div
              className={clsx(
                "absolute z-10 flex items-center gap-2",

                logoPosition,
              )}
            >
              <Link href={href} className="flex">
                {icon}
              </Link>
            </div> */}
          </div>

          {/* Bottom Section: Title, Dates, and Summary */}
          <div className="basis-1/3 p-6">
            <p className="flex gap-x-2 text-sm text-neutral-950">
              <span className="font-semibold">{service}</span>
              <span className="text-neutral-300" aria-hidden="true">
                /
              </span>
              <time className="font-base">{englishToPersianDigits(date)}</time>
            </p>
            <h3 className="font-display mt-4 text-2xl font-semibold text-neutral-950">
              <Link href={href}>{name}</Link>
            </h3>
            <p className="mt-4 text-base text-neutral-600">{summary}</p>
          </div>
        </article>
      </FadeIn>
    </motion.div>
  );
}

function ProjectsCards({
  name,
  title,
  date,
  img,
  blurDataURL,
  logo,
  logoPosition,
  icon,
  service,
  href,
  summary,
  children,
  bounds,
  scrollX,
  ...props
}) {
  const ref = useRef(null);

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

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      {...props}
      className="relative flex w-72 shrink-0 snap-center flex-col py-6 sm:w-96"
      // className="relative flex aspect-9/16 w-72 shrink-0 snap-end scroll-ml-[var(--scroll-padding)] flex-col sm:w-96 md:snap-start"
    >
      <FadeIn key={href} className="flex">
        <article className="relative flex w-full flex-col rounded-[40px] shadow-sm ring-1 ring-neutral-950/5 transition hover:bg-neutral-50">
          {/* Top Section: Photo with Logo */}
          <div className="relative aspect-square basis-3/5">
            {/* Photo */}
            <Link href={href} className="block">
              <Image
                width={1080}
                height={1080}
                alt="building photo"
                placeholder="blur"
                blurDataURL={blurDataURL}
                src={img}
                className="object-cove w-full rounded-t-[40px]"
              />
            </Link>
            {/* Effect */}
            <Link
              href={href}
              aria-hidden="true"
              className="from-100 absolute inset-0 bg-linear-to-t from-black/40 to-20%"
            />
          </div>

          {/* Bottom Section: Title, Dates, and Summary */}
          <div className="basis-2/5 p-6">
            <p className="flex gap-x-2 text-sm text-neutral-950">
              <span className="font-semibold">{service}</span>
              <span className="text-neutral-300" aria-hidden="true">
                /
              </span>
              <time className="font-base">{englishToPersianDigits(date)}</time>
            </p>
            <h3 className="font-display mt-4 text-2xl font-semibold text-neutral-950">
              <Link href={href}>{name}</Link>
            </h3>
            <p className="mt-4 text-base text-neutral-600">{summary}</p>
          </div>
        </article>
      </FadeIn>
    </motion.div>
  );
}

const FadeInStaggerContext = createContext(false);

const viewport = { once: true, margin: "0px 0px -200px" };

function Card({
  name,
  title,
  date,
  img,
  blurDataURL,
  logo,
  logoPosition,
  icon,
  service,
  href,
  summary,
  children,
  bounds,
  scrollX,
  ...props
}) {
  const ref = useRef(null);
  let shouldReduceMotion = useReducedMotion();
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

  return (
    <motion.div
      key={href}
      ref={ref}
      style={{ opacity }}
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      {...(isInStaggerGroup
        ? {}
        : {
            initial: "hidden",
            whileInView: "visible",
            viewport,
          })}
      {...props}
      className={clsx(
        "flex max-h-[48rem] w-full max-w-72 shrink-0 snap-center flex-col items-center justify-center sm:max-w-96",
        "w-full overflow-hidden rounded-[40px]",
        "shadow-sm ring-1 ring-neutral-950/5 transition hover:bg-neutral-50/10",
      )}
    >
      <div className="relative w-full">
        <Image
          width={1080}
          height={1080}
          alt="building photo"
          placeholder="blur"
          blurDataURL={blurDataURL}
          src={img}
          className="object-cover"
        />
        <Link
          href={href}
          aria-hidden="true"
          className="from-100 absolute inset-0 bg-linear-to-t from-black to-40%"
        />
      </div>
      <div className="flex w-full flex-col items-center justify-end gap-2 bg-black py-6">
        <p className="flex gap-x-2 text-sm text-neutral-100">
          <span className="font-semibold">{service}</span>
          <span className="text-neutral-300" aria-hidden="true">
            /
          </span>
          <time className="font-base">{englishToPersianDigits(date)}</time>
        </p>
        <h3 className="font-display mt-4 text-2xl font-semibold text-neutral-100">
          <Link href={href}>{name}</Link>
        </h3>
      </div>
    </motion.div>
  );
}

export function PhotoLogoCarousel() {
  const scrollRef = useRef(null);
  const { scrollX } = useScroll({ container: scrollRef });
  const [setReferenceWindowRef, bounds] = useMeasure();
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollX, "change", (x) => {
    setActiveIndex(Math.floor(x / scrollRef.current.children[0].clientWidth));
  });

  function scrollTo(index) {
    const cardWidth = scrollRef.current.children[0].offsetWidth;
    const cardsPerView = 1.5;
    const gap = 32;
    const scrollAmount = cardWidth * cardsPerView + gap;
    const offset = 200;
    const width = scrollRef.current.children[0].offsetWidth;
    scrollRef.current.scrollTo({
      left: scrollAmount * index - offset,
      behavior: "smooth",
    });
  }

  return (
    <>
      <SectionIntro
        eyebrow="کارهای دیگر"
        title="هر پروژه، یک فکر"
      ></SectionIntro>
      <div
        ref={scrollRef}
        className={clsx([
          "mx-auto mt-2 flex gap-8 px-[2rem] pb-0.5 md:px-[3rem] lg:px-[4.5rem] xl:px-[9.5rem]",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth",
          "snap-center",

          // "[--scroll-padding:max(--spacing(6),calc((100vw-(var(--container-2xl)))/2))] lg:[--scroll-padding:max(--spacing(8),calc((100vw-(var(--container-7xl)))/2))]",
        ])}
      >
        {worksCarousel.map(
          (
            {
              name,
              logo,
              icon,
              logoPosition,
              image,
              blurDataURL,
              service,
              date,
              href,
              title,
              summary,
            },
            testimonialIndex,
          ) => (
            <Card
              key={testimonialIndex}
              name={name}
              title={title}
              img={image}
              blurDataURL={blurDataURL}
              icon={icon}
              date={date}
              service={service}
              summary={summary}
              href={href}
              logo={logo}
              logoPosition={logoPosition}
              bounds={bounds}
              scrollX={scrollX}
              // onClick={() => scrollTo(testimonialIndex)}
            />
          ),
        )}
        <div className="w-[42rem] shrink-0 sm:w-[54rem]" />
      </div>
      <div className="section-style mt-10 flex justify-start">
        <a
          href="/work"
          className="z-50 rounded-full p-2 text-base/7 font-semibold text-neutral-950 transition-colors hover:bg-neutral-100"
        >
          دیدن همه پروژه‌ها<span aria-hidden="true">&larr;</span>
        </a>
      </div>
    </>
  );
}
