import clsx from "clsx";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";

export function PageIntro({ eyebrow, title, children, centered = false }) {
  return (
    <div
      className={clsx(
        "section-style mt-24 sm:mt-32 lg:mt-40",
        centered && "text-center",
      )}
    >
      <FadeIn>
        <h1>
          <span className="eyebrow-style mb-2 block text-neutral-950 lg:mb-3">
            {eyebrow}
          </span>
          <span className="sr-only"> - </span>
          <span
            className={clsx(
              "title-style max-w-5xl [text-wrap:balance] text-neutral-950",
              centered && "mx-auto",
            )}
          >
            {title}
          </span>
        </h1>
        <div
          className={clsx(
            "mt-6 max-w-3xl text-xl text-neutral-600",
            centered && "mx-auto",
          )}
        >
          {children}
        </div>
      </FadeIn>
    </div>
  );
}
