import { Border } from "@/components/chegall/studio/Border";
import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import clsx from "clsx";

export function StatList({ children, inverse = false, ...props }) {
  return (
    <FadeInStagger {...props}>
      <dl
        className={clsx(
          "grid grid-cols-1 gap-10 rounded-4xl p-8 sm:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none",
          inverse && "bg-jarounBlack",
          !inverse && "bg-gray-400/5",
        )}
      >
        {children}
      </dl>
    </FadeInStagger>
  );
}

export function StatListItem({ label, inverse = false, value }) {
  return (
    <Border
      as={FadeIn}
      invert={inverse}
      position="right"
      className="flex flex-col-reverse pr-8"
    >
      <dt
        className={clsx(
          "mt-2 text-base leading-6 font-semibold",
          inverse && "text-neutral-300",
          !inverse && "text-neutral-600",
        )}
      >
        {label}
      </dt>
      <dd
        className={clsx(
          "font-display text-3xl font-semibold sm:text-4xl",
          inverse && "text-neutral-50",
          !inverse && "text-neutral-950",
        )}
      >
        {value}
      </dd>
    </Border>
  );
}

export function StatListItemWithSub({ label, inverse = false, sub, value }) {
  return (
    <Border
      invert={inverse}
      as={FadeIn}
      position="right"
      className="flex flex-col-reverse pr-8"
    >
      <dt
        className={clsx(
          "mt-2 text-base leading-6 font-semibold",
          inverse && "text-neutral-300",
          !inverse && "text-neutral-600",
        )}
      >
        {label}
      </dt>

      <div className="flex items-center gap-1">
        <dd
          className={clsx(
            "font-display text-3xl font-semibold sm:text-4xl",
            inverse && "text-neutral-50",
            !inverse && "text-neutral-950",
          )}
        >
          {value}
        </dd>
        <dd
          className={clsx(
            "font-display text-xl font-semibold sm:text-xl",
            inverse && "text-neutral-50",
            !inverse && "text-neutral-950",
          )}
        >
          {sub}
        </dd>
      </div>
    </Border>
  );
}
