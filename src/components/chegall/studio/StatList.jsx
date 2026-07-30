import { Border } from "@/components/chegall/studio/Border";
import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import clsx from "clsx";

export function StatList({
  bgColor = "bg-neutral-950",
  children,
  inverse = false,
  ...props
}) {
  return (
    <FadeInStagger {...props}>
      <dl
        className={clsx(
          "grid grid-cols-1 gap-10 p-8 sm:grid-cols-3 xl:auto-cols-fr xl:grid-flow-col xl:grid-cols-none",
          bgColor,
          "ring-jarounBlack/5 rounded-[40px] shadow-2xs ring-1",
        )}
      >
        {children}
      </dl>
    </FadeInStagger>
  );
}

export function StatListItem({
  textColor = "text-neutral-50",
  textAccentColor = "text-neutral-300",
  label,

  value,
}) {
  return (
    <Border
      invert="true"
      as={FadeIn}
      position="right"
      className="flex flex-col-reverse pr-8"
    >
      <dt
        className={clsx(
          "mt-2 text-base leading-6 font-semibold",
          textAccentColor,
        )}
      >
        {label}
      </dt>
      <dd
        className={clsx(
          "font-display xl:text text-3xl font-semibold sm:text-4xl lg:text-3xl",
          textColor,
        )}
      >
        {value}
      </dd>
    </Border>
  );
}

export function StatListItemWithSub({
  textColor = "text-neutral-50",
  textAccentColor = "text-neutral-300",
  label,
  sub,
  value,
}) {
  return (
    <Border
      invert="true"
      as={FadeIn}
      position="right"
      className={clsx("flex flex-col-reverse pr-8", textAccentColor)}
    >
      <dt
        className={clsx(
          "mt-2 text-base leading-6 font-semibold",
          textAccentColor,
        )}
      >
        {label}
      </dt>

      <div className="flex items-center gap-1">
        <dd
          className={clsx(
            "font-display text-3xl font-semibold sm:text-4xl",
            textColor,
          )}
        >
          {value}
        </dd>
        <dd
          className={clsx(
            "font-display text-xl font-semibold sm:text-lg lg:line-clamp-1 lg:text-xs xl:text-lg",
            textColor,
          )}
        >
          {sub}
        </dd>
      </div>
    </Border>
  );
}

export function UnitList({
  bgColor = "bg-neutral-950",
  children,
  inverse = false,
  ...props
}) {
  return (
    <FadeInStagger {...props}>
      <dl
        className={clsx(
          "grid grid-cols-1 gap-10 p-8 sm:grid-cols-3",
          bgColor,
          "ring-jarounBlack/5 rounded-[40px] shadow-2xs ring-1",
        )}
      >
        {children}
      </dl>
    </FadeInStagger>
  );
}

export function BlogStatList({
  bgColor = "bg-neutral-950",
  children,
  inverse = false,
  ...props
}) {
  return (
    <FadeInStagger {...props}>
      <dl
        className={clsx(
          "grid grid-cols-3 gap-10 p-8 xl:auto-cols-fr xl:grid-flow-col xl:grid-cols-none",
          bgColor,
          "ring-jarounBlack/5 rounded-[40px] shadow-2xs ring-1",
        )}
      >
        {children}
      </dl>
    </FadeInStagger>
  );
}

export function BlogStatListItem({
  textColor = "text-neutral-50",
  textAccentColor = "text-neutral-300",
  label,

  value,
}) {
  return (
    <Border
      invert="true"
      as={FadeIn}
      position="right"
      className="flex flex-col-reverse pr-8"
    >
      <dt
        className={clsx(
          "mt-2 text-base leading-6 font-semibold",
          textAccentColor,
        )}
      >
        {label}
      </dt>
      <dd
        className={clsx(
          "font-display text-xl font-semibold md:text-2xl",
          textColor,
        )}
      >
        {value}
      </dd>
    </Border>
  );
}
