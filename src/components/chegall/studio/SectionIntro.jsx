import clsx from "clsx";

import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";

export function SectionIntro({
  eyebrow,
  title,
  children,
  centered = false,
  smaller = false,
  invert = false,
  ...props
}) {
  return (
    <div className={clsx("section-style")} {...props}>
      <FadeIn>
        <h2 className={clsx("eyebrow-style", centered && "text-center")}>
          {eyebrow && (
            <>
              <span
                className={clsx(
                  "mb-2 block lg:mb-3",
                  invert ? "text-white" : "text-neutral-950",
                )}
              >
                {eyebrow}
              </span>
              <span className="sr-only"> - </span>
            </>
          )}
          <span
            className={clsx(
              "title-style [text-wrap:balance]",
              smaller
                ? "text-2xl font-semibold"
                : "text-4xl font-medium sm:text-5xl",
              invert ? "text-white" : "text-neutral-950",
            )}
          >
            {title}
          </span>
        </h2>
        {children && (
          <div
            className={clsx(
              "mt-6 max-w-3xl text-xl",
              invert ? "text-neutral-300" : "text-neutral-600",
            )}
          >
            {children}
          </div>
        )}
      </FadeIn>
    </div>
  );
}

export function SectionIntroduction({
  eyebrow,
  title,
  children,
  centered = false,
  smaller = false,
  invert = false,
  ...props
}) {
  return (
    <div {...props}>
      <h2 className={clsx("eyebrow-style", centered && "text-center")}>
        {eyebrow && (
          <>
            <span
              className={clsx(
                "mb-2 block lg:mb-3",
                invert ? "text-white" : "text-neutral-950",
              )}
            >
              {eyebrow}
            </span>
            <span className="sr-only"> - </span>
          </>
        )}
        <span
          className={clsx(
            "title-style [text-wrap:balance]",
            smaller
              ? "text-2xl font-semibold"
              : "text-4xl font-medium sm:text-5xl",
            invert ? "text-white" : "text-neutral-950",
          )}
        >
          {title}
        </span>
      </h2>
      {children && (
        <div
          className={clsx(
            "mt-6 max-w-3xl text-xl",
            invert ? "text-neutral-300" : "text-neutral-600",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
