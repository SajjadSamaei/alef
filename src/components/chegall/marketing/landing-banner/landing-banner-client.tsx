"use client";
import { useState, useTransition } from "react";
import { XMarkIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";

import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { dismissBanner } from "./dismissBanner";
import type { BannerData } from "./types"; // Import your type

import Link from "next/link";

export function LandingBanner({ data }: { data: BannerData }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleDismiss = () => {
    setIsVisible(false);
    startTransition(() => {
      dismissBanner(data.updatedAt);
    });
  };

  if (!isVisible) {
    return null;
  }
  return (
    <FadeIn className="relative mt-4 flex items-center gap-x-6 overflow-hidden bg-gray-800/50 px-6 py-2.5 inset-shadow-2xs backdrop-blur-3xl after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 sm:px-3.5">
      {/* Background decorative elements remain unchanged */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
          className="from-nirvanaDarkBlue aspect-577/310 w-144.25 bg-linear-to-r to-black opacity-40"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
          className="to-nirvanaDarkBlue aspect-577/310 w-144.25 bg-linear-to-r from-black opacity-40"
        />
      </div>
      <div className="absolute top-2 left-2 flex items-center justify-center p-1 hover:rounded-full hover:bg-white/15 hover:shadow-xs hover:inset-ring-white/20 sm:top-1/2 sm:left-8 sm:-translate-y-1/2 md:left-14 lg:left-20 xl:left-40">
        <button
          type="button"
          onClick={handleDismiss}
          disabled={isPending}
          className="focus-visible:-outline-offset-4"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon aria-hidden="true" className="size-5 text-gray-100" />
        </button>
      </div>

      {/* ↓↓↓ The wrapper div has been removed here ↓↓↓ */}
      <div className="section-style-no-mobile flex w-full items-start justify-start sm:items-center">
        <div className="flex flex-col gap-1 text-sm/6 text-gray-100 sm:flex-row sm:items-center sm:justify-center sm:gap-0">
          <strong className="font-semibold">{data.title}</strong>
          <svg
            viewBox="0 0 2 2"
            aria-hidden="true"
            className="mx-2 hidden size-0.5 fill-current sm:inline"
          >
            <circle r={1} cx={1} cy={1} />
          </svg>
          <p className="text-xs/6">{data.description}</p>
          <Link
            href={data.linkURL || "#"}
            className="flex items-center justify-center gap-2 self-start rounded-full bg-white/10 px-3.5 py-1 text-xs/6 font-semibold text-gray-100 shadow-xs inset-ring-white/20 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:mx-2 sm:max-w-none"
          >
            {data.cta} <ChevronLeftIcon className="h-3 w-3" />
          </Link>
        </div>
      </div>
      {/* ↑↑↑ The wrapper div has been removed here ↑↑↑ */}
    </FadeIn>
  );
}
