import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { ButtonCustomColor } from "@/components/chegall/studio/Button";

interface GlowingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  href: any;
}

export const GlowingButton: React.FC<GlowingButtonProps> = ({
  children,
  className,
  href,
  ...props
}) => {
  return (
    // The wrapper div creates the glowing pseudo-element
    <div
      className={cn(
        "relative inline-block", // Use inline-block to fit content width
        // These are the core styles for the ::after pseudo-element glow
        "after:absolute after:inset-0 after:z-[-1]",
        "after:content-['']",
        "after:bg-gradient-to-r after:from-[#ff00aa] after:to-[#00FFF1]",
        "after:bg-[length:200%_100%]", // Gradient size for animation
        "after:blur-lg", // This creates the "glow"
        "after:animate-background-position-spin", // The animation class
        "after:rounded-lg", // Match the button's border radius
      )}
    >
      <Link href={href}>
        <button
          className={cn(
            // Ensure button is on top of the glow
            "relative z-10 w-full",
            // Basic button styling
            "rounded-lg bg-neutral-900 px-6 py-2 text-white",
            className,
          )}
          {...props}
        >
          {children}
        </button>
      </Link>
    </div>
  );
};

// Example Usage:
// <GlowingButton>Click Me</GlowingButton>
