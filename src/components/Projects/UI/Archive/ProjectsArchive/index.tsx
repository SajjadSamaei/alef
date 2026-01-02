import { cn } from "@/utils/cn";
import React from "react";
import type { Project } from "@/src/payload-types";
import { Card } from "@/components/Portfolio/UI/Archive/ProjectsArchive/Card";

export type Props = {
  projects: Project[];
};

export const PortfolioArchive: React.FC<Props> = (props) => {
  const { projects } = props;
  const length = projects?.length;

  return (
    <div className={cn("container")}>
      <div>
        <div className="grid grid-cols-1 items-stretch gap-x-4 gap-y-4 sm:grid-cols-12 lg:gap-x-3 lg:gap-y-3 xl:gap-x-3">
          {projects?.map((result, index) => {
            if (typeof result === "object" && result !== null) {
              const colSpanClass = "col-span-full sm:col-span-4";
              // let colSpanClass = "col-span-full";

              // switch (index) {
              //   case 0:
              //     colSpanClass = "sm:col-span-8";
              //     break;
              //   case 1:
              //     colSpanClass = "sm:col-span-4";
              //     break;
              //   case 2:
              //     colSpanClass = "sm:col-span-4";
              //     break;
              //   case 3:
              //     colSpanClass = "sm:col-span-8";
              //     break;
              //   default:
              //     colSpanClass = "sm:col-span-4";
              //     break;
              // }

              return (
                <div key={index} className={cn(colSpanClass)}>
                  <Card
                    className="h-full"
                    doc={result}
                    relationTo="projects"
                    showCategories
                    // index={index}
                    // length={length}
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};
