import clsx from "clsx";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";

export function PageIntro({
  eyebrow,
  title,
  eyebrowFont = "eyebrow-style",
  titleFont = "text-5xl sm:text-6xl",
  children,
  titleColor = "text-neutral-950",
  accentColor = "text-neutral-600",
  centered = false,
}) {
  return (
    <Container
      className={clsx(
        "mt-4 sm:mt-6 md:mt-32 lg:mt-40",
        centered && "text-center",
      )}
    >
      <FadeIn>
        <h1>
          <span className={clsx("mb-2 block", titleColor, eyebrowFont)}>
            {eyebrow}
          </span>
          <span className="sr-only"> - </span>
          <span
            className={clsx(
              "font-display block max-w-5xl font-bold tracking-tight [text-wrap:balance]",
              centered && "mx-auto",
              titleColor,
              titleFont,
            )}
          >
            {title}
          </span>
        </h1>
        <div
          className={clsx(
            "mt-6 max-w-3xl text-xl",
            centered && "mx-auto",
            accentColor,
          )}
        >
          {children}
        </div>
      </FadeIn>
    </Container>
  );
}
