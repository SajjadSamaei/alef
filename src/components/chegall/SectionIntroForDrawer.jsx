import clsx from "clsx";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";

export function SectionIntroForDrawer({
  eyebrow,
  eyebrowColor = "text-white",
  title,
  titleColor = "text-white",
  children,
  childrenColor = "text-white",
  smaller = false,

  ...props
}) {
  return (
    <Container {...props}>
      <FadeIn className="mx-auto max-w-2xl">
        <h2>
          {eyebrow && (
            <>
              <span
                className={clsx(
                  "mb-4 block text-base/7 font-semibold md:text-lg lg:text-xl",
                  eyebrowColor,
                )}
              >
                {eyebrow}
              </span>
              <span className="sr-only"> - </span>
            </>
          )}
          <span
            className={clsx(
              "font-display block tracking-tight text-balance",
              smaller
                ? "text-2xl font-semibold"
                : "iphone-promax:text-4xl text-3xl font-semibold",
              titleColor,
            )}
          >
            {title}
          </span>
        </h2>
        {children && (
          <div className={clsx("mt-6", childrenColor)}>{children}</div>
        )}
      </FadeIn>
    </Container>
  );
}
