// src/components/ui/share/button.tsx (Updated)
"use client";

import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/cn"; // Your Shadcn utils path
import {
  Button as ShadcnButton,
  type ButtonProps as ShadcnButtonProps,
} from "@/components/ui/button"; // Import Shadcn Button

// Define variants based on original props
interface CustomButtonProps extends ShadcnButtonProps {
  invert?: boolean;
  outline?: boolean;
  href?: string; // Add href directly
}

const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,
      invert = false,
      outline = false,
      href,
      children,
      asChild = false, // Allow passing down asChild
      ...props
    },
    ref,
  ) => {
    const Comp = href ? Link : asChild ? Slot : "button"; // Determine the component type

    return (
      <ShadcnButton // Use Shadcn Button as the base
        className={cn(
          // Base styles from original, Shadcn's base will also apply
          "inline-flex h-auto items-center rounded-full px-4 py-1.5 text-base font-semibold transition sm:text-sm", // h-auto overrides Shadcn's fixed height
          // Invert variant styles
          invert
            ? "bg-white text-neutral-950 hover:bg-neutral-200"
            : "bg-neutral-950 text-white hover:bg-neutral-800",
          // Outline style
          outline ? "outline -outline-offset-1 outline-neutral-950" : "", // Adjusted outline
          className, // Allow overriding
        )}
        ref={ref}
        {...(Comp === Link && { href: href })} // Spread href only if it's a Link
        {...props} // Spread remaining props (like onClick, type, etc.)
        asChild={Comp === Link || asChild} // Use asChild for Link or if explicitly passed
      >
        {/* Render Link directly if href is present, otherwise render children */}
        {Comp === Link && href ? (
          <Link href={href}>
            <span className="relative">{children}</span>
          </Link>
        ) : (
          <span className="relative">{children}</span>
        )}
      </ShadcnButton>
    );
  },
);
Button.displayName = "Button";

export { Button, type CustomButtonProps as ButtonProps }; // Export with the original name
