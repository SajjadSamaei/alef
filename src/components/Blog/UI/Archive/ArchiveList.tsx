"use client";
import React from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Post } from "@/src/payload-types";
import { ArchivePost } from "@/components/Blog/UI/Archive/ArchivePost";

export type Props = {
  posts: Post[];
};

export const ArchivePostList: React.FC<Props> = ({ posts }) => {
  return (
    // GRID SYSTEM:
    // Mobile: 1 Col
    // Tablet: 2 Cols
    // Desktop: 3 Cols
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {posts?.map((result, index) => {
        if (typeof result === "object" && result !== null) {
          return (
            <FadeIn key={result.id || index}>
              <div className="h-full w-full">
                <ArchivePost
                  className="h-full" // Ensure cards stretch to match height
                  doc={result}
                  relationTo="blog"
                  showCategories
                />
              </div>
            </FadeIn>
          );
        }
        return null;
      })}
    </div>
  );
};
