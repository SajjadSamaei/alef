import React from "react";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import type { Project as ProjectType } from "@/src/payload-types";
import { Project } from "./Project";

export type Props = {
  posts: ProjectType[];
};

export const ProjectList: React.FC<Props> = ({ posts }) => {
  return (
    <div className="section-style section-padding overflow-hidden">
      <div className="space-y-12">
        {posts?.map((result, index) => {
          if (typeof result === "object" && result !== null) {
            return (
              <FadeIn key={result.id || index}>
                <Project doc={result} />
              </FadeIn>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
