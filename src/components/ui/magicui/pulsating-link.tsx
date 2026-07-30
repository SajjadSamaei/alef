import React from "react";
import { cn } from "@/utils/cn";
import clsx from "clsx";
import { Link } from "@/src/i18n/routing";

interface PulsatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
  href: any;
  isPulsing: boolean;
}

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
>(
  (
    {
      className,
      isPulsing,
      href,
      children,
      pulseColor = "#808080",
      duration = "5s",
      ...props
    },
    ref,
  ) => {
    return (
      <Link href={href}>
        <button
          ref={ref}
          className={cn(
            "relative inline-flex cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition",
            className,
          )}
          style={
            {
              "--pulse-color": pulseColor,
              "--duration": duration,
            } as React.CSSProperties
          }
          {...props}
        >
          <div className="relative z-10">{children}</div>
          <div
            className={clsx(
              "absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-inherit",
              isPulsing && "animate-pulse",
            )}
          />
        </button>
      </Link>
    );
  },
);

PulsatingButton.displayName = "PulsatingButton";
