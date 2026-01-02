"use client";
import { cn } from "@/utils/cn";
import React from "react";

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse bg-neutral-200 dark:bg-neutral-800",
      className,
    )}
  />
);

export const ArchiveListSkeleton = () => {
  // Simulate 6 items for a full grid feel
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {items.map((index) => (
        <div
          key={index}
          className="flex h-full flex-col overflow-hidden rounded-[32px] border border-neutral-200 dark:border-white/5"
        >
          {/* Image Area (4:3) */}
          <div className="aspect-[4/3] w-full bg-neutral-200 dark:bg-neutral-800" />

          {/* Content Area */}
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            {/* Date */}
            <Skeleton className="mb-4 h-4 w-24 rounded-full" />

            {/* Title */}
            <Skeleton className="mb-2 h-8 w-3/4 rounded-lg" />
            <Skeleton className="mb-6 h-8 w-1/2 rounded-lg" />

            {/* Description */}
            <Skeleton className="mb-2 h-4 w-full rounded" />
            <Skeleton className="mb-2 h-4 w-5/6 rounded" />

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between pt-4">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
