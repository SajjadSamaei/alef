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
        "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors shadow-2xs",
        {
          // High contrast status badge colors for Light & Dark mode
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:ring-1 dark:ring-emerald-500/30":
            variant === "built",
          "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 dark:ring-1 dark:ring-amber-500/30":
            variant === "construction",
          "bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 dark:ring-1 dark:ring-sky-500/30":
            variant === "schematic",
          "bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 dark:ring-1 dark:ring-purple-500/30":
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
