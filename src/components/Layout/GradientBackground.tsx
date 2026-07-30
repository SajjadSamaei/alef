"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";
import React from "react";

// Shared Type
export type GradientVariant = "home" | "about" | "projects" | "contact";

/* -------------------------------------------------------------------------- */
/* 1. GRADIENT BACKGROUND (The Blob)                                          */
/* -------------------------------------------------------------------------- */

export function GradientBackground({
  className,
  variant: propVariant, // Allow overriding via prop
}: {
  className?: string;
  variant?: GradientVariant;
}) {
  const pathname = usePathname();

  // Internal fallback logic if no prop is passed
  const getInternalVariant = (): GradientVariant => {
    if (pathname === "/" || pathname === "/fa" || pathname === "/en")
      return "home";
    if (pathname.includes("/about")) return "about";
    if (pathname.includes("/contact")) return "contact";
    if (pathname.includes("/projects") || pathname.includes("/case-studies"))
      return "projects";
    return "home";
  };

  // Prioritize the prop, otherwise use internal logic
  const variant = propVariant || getInternalVariant();

  const gradients = {
    // 1. Home: "Travertine & Light"
    home: "bg-[linear-gradient(115deg,#fdfbf7_0%,#f4efe9_40%,#e6d5b8_100%)] opacity-80",

    // 2. About: "Steel & Sky"
    about:
      "bg-[linear-gradient(115deg,#eef2ff_0%,#e0e7ff_50%,#cbd5e1_100%)] opacity-70",

    // 3. Projects: "Concrete & Canvas"
    projects:
      "bg-[linear-gradient(115deg,#f9fafb_0%,#f3f4f6_50%,#e5e7eb_100%)] opacity-60",

    // 4. Contact: "Clay & Earth"
    contact:
      "bg-[linear-gradient(115deg,#fff1f2_0%,#ffe4e6_50%,#e7e5e4_100%)] opacity-70",
  };

  return (
    <div
      className={clsx(
        "pointer-events-none absolute inset-x-0 -top-44 z-[-1]",
        className,
      )}
    >
      <div
        className={clsx(
          // Layout & Positioning
          "relative left-1/2 -translate-x-1/2 transform-gpu",

          // Responsive Size
          "h-80 w-[120vw] sm:w-[150vw] md:w-[100vw]",

          // Shape & Blur
          "rounded-full blur-3xl",

          // ANIMATION: Morphs smoothly on route change
          "transition-all duration-1000 ease-in-out",

          // Dynamic Gradient
          gradients[variant],
        )}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. GRADIENT (The Header Bar)                                               */
/* -------------------------------------------------------------------------- */

interface GradientProps extends React.ComponentPropsWithoutRef<"div"> {
  variant?: GradientVariant;
}

export function Gradient({
  className,
  variant = "home",
  ...props
}: GradientProps) {
  const gradients = {
    // 1. Home: "Travertine"
    home: "bg-linear-115 from-[#ffcba3] from-28% via-[#fff1be] via-70% to-[#e6d5b8] sm:bg-linear-145 opacity-90",

    // 2. About: "Steel & Sky"
    about:
      // "bg-linear-115 from-[#e0c3fc] from-10% via-[#8ec5fc] via-50% to-[#e0c3fc] sm:bg-linear-145 saturate-[0.8] opacity-80",
      "bg-[linear-gradient(115deg,#ffecd2_0%,#fcb69f_50%,#c1dce0_100%)] sm:bg-[linear-gradient(145deg,#ffecd2_0%,#fcb69f_50%,#c1dce0_100%)] opacity-90",

    // 3. Projects: "Concrete"
    projects:
      "bg-linear-115 from-[#f3f4f6] from-10% via-[#e5e7eb] via-60% to-[#d1d5db] sm:bg-linear-145 opacity-60",

    // 4. Contact: "Clay"
    contact:
      "bg-linear-115 from-[#e6e9f0] from-0% via-[#eef1f5] via-50% to-[#d9ded8] sm:bg-linear-145 opacity-80",
  };

  return (
    <div
      {...props}
      className={clsx(
        className,
        // Transition for smooth color morphing
        "transition-colors duration-700 ease-in-out",
        gradients[variant],
      )}
    />
  );
}
