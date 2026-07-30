"use client";

import React from "react";
import { getSquareMosaicRadii } from "@/components/Portfolio/UI/Archive/squareMosaic";
import { useDirection } from "@/utils/hooks/useDirection";
import { cn } from "@/utils/cn";

export const ProjectGridSkeleton: React.FC<{
  count?: number;
  direction?: "ltr" | "rtl";
  className?: string;
}> = ({ count = 10, direction: propDirection, className }) => {
  const activeDirection = useDirection();
  const direction = propDirection || activeDirection;
  const items = Array.from({ length: count });

  return (
    <div className={cn("container animate-pulse", className)}>
      <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((_, index) => (
          <div
            key={index}
            className={cn(
              "group relative aspect-square w-full overflow-hidden border border-neutral-200/60 bg-neutral-200/80 dark:border-white/10 dark:bg-neutral-800/80",
              getSquareMosaicRadii(index, count, direction),
            )}
          >
            {/* Soft inner gradient shimmer matching project card aspect ratio */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent dark:via-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const PostSkeleton: React.FC<{
  count?: number;
  direction?: "ltr" | "rtl";
}> = ({ count = 10, direction: propDirection }) => {
  const activeDirection = useDirection();
  const direction = propDirection || activeDirection;

  return (
    <div className="mb-16 animate-pulse">
      {/* Page Range Header Skeleton */}
      <div className="container mb-8">
        <div className="h-4 w-36 rounded-md bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* 5-Column Square Grid Skeleton */}
      <ProjectGridSkeleton count={count} direction={direction} />
    </div>
  );
};
