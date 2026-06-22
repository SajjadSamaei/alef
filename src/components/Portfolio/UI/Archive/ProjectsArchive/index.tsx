import React from "react";
import type { CaseStudy } from "@/src/payload-types";
import { Card } from "@/components/Portfolio/UI/Archive/Card";
import { getSquareMosaicRadii } from "@/components/Portfolio/UI/Archive/squareMosaic";

export type Props = {
  projects: CaseStudy[];
  direction?: "ltr" | "rtl";
};

export const PortfolioArchive: React.FC<Props> = (props) => {
  const { projects, direction = "ltr" } = props;
  const length = projects?.length || 0;

  return (
    <div className="container">
      <div>
        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {projects?.map((result, index) => {
            if (typeof result === "object" && result !== null) {
              return (
                <Card
                  key={index}
                  className={getSquareMosaicRadii(index, length, direction)}
                  doc={result}
                  relationTo="case-studies"
                  showCategories
                  imageSize="square"
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
