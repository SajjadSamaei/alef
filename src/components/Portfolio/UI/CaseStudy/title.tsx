import clsx from "clsx";
import { JSX } from "react";
import { FadeInStagger } from "@/components/chegall/studio/FadeIn";
import type { CaseStudy } from "@/src/payload-types";
import { useTranslations } from "next-intl";

type BadgeType = {
  className: string;
  variant: string;
};

function Badge({
  className,
  variant,
  children,
  ...props
}: BadgeType &
  React.HTMLAttributes<HTMLSpanElement> & {
    children?: React.ReactNode;
  }): JSX.Element {
  return (
    <span
      className={clsx(
        "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap shadow-2xs ring-1 ring-white/10 transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
        {
          // Updated Architecture Status Colors
          "bg-lime-400/10 text-lime-300 hover:bg-lime-400/15":
            variant === "built",
          "bg-amber-400/10 text-amber-400 hover:bg-amber-400/15":
            variant === "construction",
          "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25":
            variant === "schematic",
          "bg-purple-500/15 text-purple-400 hover:bg-purple-500/25":
            variant === "concept",
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function TagList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ul
      role="list"
      className={clsx(className, "flex list-none! flex-wrap gap-2")}
    >
      {children}
    </ul>
  );
}

export function TagListItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li
      className={clsx(
        "flex items-center justify-center rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
        className,
      )}
    >
      {children}
    </li>
  );
}

export function Title({ post }: { post: CaseStudy }): JSX.Element {
  const t = useTranslations("BlogFilters.Status");
  const tCaseStudy = useTranslations("CaseStudy");

  // Destructure new fields: keywords instead of services
  const { projectStatus, title, keywords, subtitle, projectBrief } = post || {};

  return (
    <FadeInStagger className="my-8 flex flex-col items-start justify-start gap-4">
      {/* Status Badge */}
      {projectStatus && (
        <Badge variant={projectStatus} className="">
          {projectStatus && <p>{t(projectStatus)}</p>}
        </Badge>
      )}

      {/* Main Title */}
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance text-black sm:text-5xl dark:text-white">
        {title}
      </h1>

      {/* Subtitle / Tagline */}
      <p className="text-appleBackgorundGray text-lg leading-7 font-medium">
        {subtitle}
      </p>

      {/* Project Brief (Abstract) */}
      {projectBrief && (
        <p className="max-w-2xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
          {projectBrief}
        </p>
      )}

      {/* Keywords (Replaces Services) */}
      {keywords && keywords.length > 0 && (
        <div className="mt-4">
          <h4 className="font-display text-appleBackgorundGray/90 mb-2 text-xs font-semibold tracking-wider uppercase">
            {tCaseStudy("keywords")}
          </h4>
          <TagList>
            {keywords.map((item, index) => (
              <TagListItem
                key={index}
                className="border border-zinc-200/10 hover:inset-shadow-2xs"
              >
                {item.keyword}
              </TagListItem>
            ))}
          </TagList>
        </div>
      )}
    </FadeInStagger>
  );
}
