import clsx from "clsx";
import React from "react";
import RichText from "@/components/RichText/BlogRichText";
import type { Post } from "@/src/payload-types";
// ✅ IMPORT THE SHARED CARD
import { Card } from "@/components/Blog/UI/Archive/Card";
import { type DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

export type RelatedPostsProps = {
  className?: string;
  docs?: Post[];
  introContent?: DefaultTypedEditorState;
  locale: string;
};

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  className,
  docs,
  introContent,
  locale,
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {introContent && (
        <div className="mb-12 border-b border-neutral-200 pb-8 dark:border-white/10">
          <RichText locale={locale} data={introContent} enableGutter={false} />
        </div>
      )}

      {/* Matching the Archive Grid:
         - 1 col on Mobile
         - 2 cols on Tablet
         - 3 cols on Desktop
         - Gap 6/8 for breathing room
      */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {docs?.map((doc, index) => {
          if (typeof doc === "string") return null;

          return (
            <div key={index} className="h-full w-full">
              <Card
                className="h-full w-full"
                doc={doc}
                relationTo="blog"
                showCategories
                imageSize="card" // Forces the 4:3 aspect ratio logic we set up
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
