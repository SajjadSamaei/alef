"use client";

import { cn } from "@/utils/cn";

// Basic Pulse Primitive
const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse bg-neutral-200 dark:bg-neutral-800",
      className,
    )}
  />
);

export const CollectionArchiveSkeleton = () => {
  // We simulate 4 items: 1 Hero + 3 Grid items to fill the viewport
  const items = [0, 1, 2, 3];

  return (
    <div className="container py-16 lg:py-24">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {items.map((index) => {
          const isHero = index === 0;

          // --- 1. LAYOUT LOGIC (Matches Real Component) ---
          const gridSpan = isHero
            ? "col-span-1 md:col-span-2 lg:col-span-3"
            : "col-span-1";

          const aspectClass = isHero
            ? "aspect-[4/5] md:aspect-[16/9] lg:aspect-[2.4/1]"
            : "aspect-[4/5] lg:aspect-[3/4]";

          // --- 2. ROUNDING LOGIC (Simplified Match) ---
          // We replicate the 'blob' shape for the first 4 items
          let roundedClass = "rounded-[16px]"; // Base

          if (isHero) {
            // Hero: Top rounded, bottom flat-ish on desktop
            roundedClass = "rounded-[40px] lg:rounded-b-[16px]";
          } else if (index === 1) {
            // Bottom Left (in LTR)
            roundedClass = "rounded-[16px] lg:rounded-bl-[40px]";
          } else if (index === 3) {
            // Bottom Right (in LTR)
            roundedClass =
              "rounded-[16px] lg:rounded-br-[40px] rounded-b-[40px]"; // Mobile bottom
          }

          return (
            <div key={index} className={cn("w-full", gridSpan)}>
              <div
                className={cn(
                  "relative w-full overflow-hidden border border-white/50 dark:border-white/5",
                  aspectClass,
                  roundedClass,
                )}
              >
                {/* Background Skeleton */}
                <Skeleton className="h-full w-full" />

                {/* --- Internal UI Mimicry --- */}
                <div
                  className={cn(
                    "absolute right-0 bottom-0 left-0 flex flex-col justify-end p-6",
                    isHero ? "sm:p-10" : "sm:p-8",
                  )}
                >
                  {/* Category Pill */}
                  <Skeleton className="mb-4 h-6 w-24 rounded-full bg-neutral-300 dark:bg-neutral-700" />

                  {/* Title Lines */}
                  <Skeleton
                    className={cn(
                      "mb-2 h-8 rounded-lg bg-neutral-300 dark:bg-neutral-700",
                      isHero ? "w-3/4 sm:h-12" : "w-full",
                    )}
                  />
                  <Skeleton
                    className={cn(
                      "h-8 rounded-lg bg-neutral-300 dark:bg-neutral-700",
                      isHero ? "w-1/2 sm:h-12" : "w-2/3",
                    )}
                  />

                  {/* Date Pill (Hero only usually has description, grid has date) */}
                  {!isHero && (
                    <Skeleton className="mt-6 h-6 w-32 rounded-full bg-neutral-300/50 dark:bg-neutral-700/50" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
