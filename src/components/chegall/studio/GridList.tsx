import clsx from "clsx";
import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";

export function GridList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <FadeInStagger>
      <ul
        role="list"
        className={clsx(
          // Changed gap to match the card spacing better
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8",
          className,
        )}
      >
        {children}
      </ul>
    </FadeInStagger>
  );
}

export function GridListItem({
  title,
  children,
  className,
  invert = false,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  invert?: boolean;
}) {
  return (
    <li className={clsx(className)}>
      <FadeIn className="h-full">
        <div
          className={clsx(
            "group relative h-full overflow-hidden p-8 transition-all duration-300",
            // 1. Shape & Border
            "rounded-[32px] border",

            // 2. Colors (Standard vs Inverted)
            invert
              ? "border-white/20 bg-white/5 hover:bg-white/10"
              : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 hover:shadow-lg hover:shadow-black/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-none",

            // 3. Layout
            "flex flex-col gap-4",
          )}
        >
          {/* Optional: Subtle Inner Shadow for depth */}
          <div
            className={clsx(
              "pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset",
              invert ? "ring-white/5" : "ring-black/5 dark:ring-white/5",
            )}
          />

          <strong
            className={clsx(
              "font-display text-xl font-semibold tracking-tight",
              invert ? "text-white" : "text-neutral-950 dark:text-white",
            )}
          >
            {title}
          </strong>

          <div
            className={clsx(
              "text-base leading-relaxed",
              invert
                ? "text-neutral-300"
                : "text-neutral-600 dark:text-neutral-400",
            )}
          >
            {children}
          </div>
        </div>
      </FadeIn>
    </li>
  );
}
