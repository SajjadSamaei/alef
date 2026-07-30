import clsx from "clsx";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { GridPattern } from "@/components/chegall/studio/GridPattern";
import { GradientComponent } from "@/components/chegall/radient/gradient"; // Make sure to import this
import { useDirection } from "@/utils/hooks/useDirection";

export function Testimonial({
  children,
  className,
  author,
  role,
}: {
  children: React.ReactNode;
  className?: string;
  author?: string;
  role?: string;
}) {
  const direction = useDirection();

  return (
    <div
      className={clsx(
        "relative isolate overflow-hidden bg-neutral-50 py-24 sm:py-32 dark:bg-neutral-900",
        className,
      )}
    >
      {/* 1. Architectural Grid Background */}
      <GridPattern
        // Modernized Setup:
        width={60} // Larger cells for architectural feel
        height={60}
        x={-1}
        y={-1}
        className={clsx(
          "absolute inset-0 h-full w-full",
          // Use mask-image to fade the edges (Vignette)
          "[mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]",
          // Subtle architectural lines
          "fill-neutral-100 stroke-neutral-950/5 dark:fill-neutral-800 dark:stroke-white/5",
        )}
        interactive={true} // Enable the mouse follower
      />

      {/* 2. Warm Gradient Glow */}
      <GradientComponent
        variant="earth"
        className="absolute inset-0 -z-10 opacity-30 dark:opacity-20"
      />

      <Container>
        <FadeIn>
          <figure className="relative mx-auto max-w-4xl text-center">
            {/* Decorative Big Quote Icon */}
            <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-10">
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={clsx(
                  "text-neutral-950 dark:text-white",
                  direction === "rtl" && "scale-x-[-1]",
                )}
              >
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V3H19.017C20.6739 3 22.017 4.34315 22.017 6V15C22.017 16.6569 20.6739 18 19.017 18H16.017V21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 7.55228 5.0166 7V3H10.0166C11.6735 3 13.0166 4.34315 13.0166 6V15C13.0166 16.6569 11.6735 18 10.0166 18H7.0166V21H5.0166Z" />
              </svg>
            </div>

            <blockquote className="font-display text-3xl font-medium tracking-tight text-neutral-950 sm:text-4xl dark:text-white">
              <p className="relative">
                {/* We rely on the big SVG background for the visual quote, keeping the text clean */}
                {children}
              </p>
            </blockquote>

            {author && (
              <figcaption className="mt-10">
                <div className="font-display text-base font-semibold text-neutral-950 dark:text-white">
                  {author}
                </div>
                {role && (
                  <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {role}
                  </div>
                )}
              </figcaption>
            )}
          </figure>
        </FadeIn>
      </Container>
    </div>
  );
}

export function Quote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const direction = useDirection();

  return (
    <div
      className={clsx(
        "relative isolate overflow-hidden rounded-[32px] px-6 py-6 sm:px-8",
        // Glass Effect
        "border border-neutral-200 bg-neutral-50/50 backdrop-blur-sm",
        "dark:border-white/10 dark:bg-white/5",
        className,
      )}
    >
      <FadeIn>
        <figure className="relative mx-auto">
          {/* Decorative small line to denote it's a note */}
          <div className="mb-4 h-0.5 w-8 bg-neutral-300 dark:bg-neutral-600" />

          <blockquote className="font-display text-lg font-medium tracking-tight text-neutral-950 dark:text-white">
            <p
              className={clsx(
                "italic",
                direction === "rtl"
                  ? "before:content-['«'] after:content-['»']"
                  : "before:content-['“'] after:content-['”']",
              )}
            >
              {children}
            </p>
          </blockquote>
        </figure>
      </FadeIn>
    </div>
  );
}
