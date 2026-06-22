"use client";

import React from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import type { CaseStudy } from "@/src/payload-types";
import { Project } from "@/components/Portfolio/UI/Archive/Project";
import { getSquareMosaicRadii } from "@/components/Portfolio/UI/Archive/squareMosaic";
import { useLocale } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";

export type Props = {
  posts: CaseStudy[];
};

export const ProjectList: React.FC<Props> = (props) => {
  const { posts } = props;
  const locale = useLocale();
  const direction = getDirection(locale);
  const length = posts?.length || 0;

  return (
    <div className="container">
      <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {posts?.map((result, index) => {
          if (typeof result === "object" && result !== null) {
            return (
              <FadeIn
                key={index}
                className="h-full"
              >
                <Project
                  className={getSquareMosaicRadii(index, length, direction)}
                  doc={result}
                  relationTo="case-studies"
                  showCategories
                  imageSize="square"
                />
              </FadeIn>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
