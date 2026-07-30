import clsx from "clsx";
import React from "react";

type LogoProps = {
  className?: string;
  invert?: boolean;
  filled?: boolean;
  fillOnHover?: boolean;
  [key: string]: any;
};

export function Logo({
  className,
  invert = false,
  filled = false,
  fillOnHover = false,
  ...props
}: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_2"
      data-name="Layer 2"
      viewBox="0 0 188.08 115.17"
      aria-hidden="true"
      className={clsx(fillOnHover && "group/logo", className)}
      {...props}
    >
      {/* <Logomark
        preserveAspectRatio="xMinYMid meet"
        invert={invert}
        filled={filled}
      /> */}
      <g id="_0" data-name="0">
        <path
          id="LWPOLYLINE"
          d="M24.02.39v71.06H.35v11.93H35.7V.39H24.02"
          className="fill-neutral-950 dark:fill-white"
        />
        <path
          id="LWPOLYLINE-2"
          d="M43.46.39v82.99h144.26V34.31h-42.81v24.6h11.67V46.29h19.81v25.15H94.7v-37.1H63.02v12.08h20.49v24.72H55.07V.38H43.46"
          className="fill-neutral-950 dark:fill-white"
        />
        <path
          id="LWPOLYLINE-3"
          d="M187.54 114.81h-12.19V102.7h-30.6V90.51h42.79v24.3"
          className="fill-neutral-950 dark:fill-white"
        />
        <path
          id="LWPOLYLINE-4"
          d="M187.48 14.97v12.24H62.87v-12.3l124.61.06"
          className="fill-neutral-950 dark:fill-white"
        />
        <path
          id="LWPOLYLINE-5"
          d="M187.51 12.36H137.5V.35h50.09v12.01"
          className="fill-neutral-950 dark:fill-white"
        />
      </g>
    </svg>
  );
}
