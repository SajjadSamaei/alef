import clsx from "clsx";
import { JSX } from "react";
import { FadeInStagger } from "@/components/chegall/studio/FadeIn";
import type { Team } from "@/src/payload-types";
import { useTranslations } from "next-intl";

type BadgeType = {
  className?: string; // Made optional
  variant?: string | null; // Made optional/nullable to match payload types
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
        "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 transition-colors ring-inset",
        {
          // Team: Green/Lime theme
          "bg-lime-50 text-lime-700 ring-lime-600/20 dark:bg-lime-400/10 dark:text-lime-300 dark:ring-lime-400/20":
            variant === "team",

          // Representative: Amber/Yellow theme
          "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20":
            variant === "leadership",

          // Leadership: Blue theme
          "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/20":
            variant === "associate" || "contractor" || "admin", // Corrected logic (was duplicated)
     

          // Fallback theme
          "bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20":
            !variant,
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
      className={clsx(className, "flex list-none flex-wrap gap-2")}
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
        // Light Mode: Clean white pill with border
        "border border-neutral-200 bg-white text-neutral-700",
        // Dark Mode: Dark surface with subtle border
        "dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
        // Interaction & Layout
        "flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium transition-colors hover:border-neutral-300 dark:hover:border-neutral-500",
        className,
      )}
    >
      {children}
    </li>
  );
}

export function Title({ post }: { post: Team }): JSX.Element {
  const t = useTranslations("Team.orgRoles");
  const tTeam = useTranslations("Team");
  const { name, orgRoles, skills, role } = post || {};

  const hasSkills = skills && Array.isArray(skills) && skills.length > 0;

  return (
    <FadeInStagger className="flex flex-col items-start justify-start gap-4">
      {/* Badge Section */}
      {orgRoles && Array.isArray(orgRoles) ? (
        orgRoles.map((role) => (
          <Badge key={role} variant={role}>{t(role)}</Badge>
        ))
      ) : (
        orgRoles && <Badge variant={orgRoles}>{t(orgRoles)}</Badge>
      )}

      {/* Name Title */}
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-neutral-950 lg:text-5xl dark:text-neutral-50">
        {name}
      </h1>

      {/* Bio Text */}
      {role && (
        <p className="max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          {role}
        </p>
      )}

      {/* Skills Section */}
      {hasSkills && (
        <div className="mt-4 flex flex-col gap-3">
          <h4 className="font-display text-xs font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
            {tTeam("skills")}
          </h4>
          <TagList>
            {skills.map((item) => (
              <TagListItem key={item.id}>{item.skill}</TagListItem>
            ))}
          </TagList>
        </div>
      )}
    </FadeInStagger>
  );
}
