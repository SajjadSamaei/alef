import React from "react";
import { cn } from "@/utils/cn";

export const PostSkeleton: React.FC = () => {
  // We simulate 4 items to match the "Bento" pattern (8 | 4 | 4 | 8)
  // UPDATED: Using logical properties (ss = start-start, se = start-end, etc.)
  const skeletonItems = [
    {
      span: "sm:col-span-8",
      // Mobile: Top rounded
      // Desktop: Top-Start rounded (Left in EN, Right in FA) | Top-End square
      corners: "rounded-t-[40px] sm:rounded-ss-[40px] sm:rounded-se-none",
    },
    {
      span: "sm:col-span-4",
      // Desktop: Top-End rounded (Right in EN, Left in FA) | Top-Start square
      corners: "sm:rounded-se-[40px] sm:rounded-ss-none",
    },
    {
      span: "sm:col-span-4",
      // Desktop: Bottom-Start rounded | Bottom-End square
      corners: "sm:rounded-es-[40px] sm:rounded-ee-none",
    },
    {
      span: "sm:col-span-8",
      // Mobile: Bottom rounded
      // Desktop: Bottom-End rounded | Bottom-Start square
      corners: "rounded-b-[40px] sm:rounded-ee-[40px] sm:rounded-es-none",
    },
  ];

  return (
    <div className="mb-16 animate-pulse">
      {/* Page Range Skeleton */}
      <div className="mb-8 h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800"></div>

      {/* Grid Skeleton */}
      <div className={cn("container px-0 sm:px-6")}>
        <div className="grid grid-cols-1 items-stretch gap-x-4 gap-y-4 sm:grid-cols-12 lg:gap-x-3 lg:gap-y-3 xl:gap-x-3">
          {skeletonItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                "relative flex h-full min-h-[300px] flex-col overflow-hidden bg-neutral-100 dark:bg-neutral-900",
                item.span,
                item.corners,
              )}
            >
              {/* Image Placeholder */}
              <div className="h-full w-full flex-1 bg-neutral-200 dark:bg-neutral-800" />

              {/* Content Placeholder (mimicking Card overlay or bottom content) */}
              <div className="absolute start-0 bottom-0 w-full space-y-3 p-6">
                <div className="h-6 w-1/3 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                <div className="h-4 w-2/3 rounded bg-neutral-300 dark:bg-neutral-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
