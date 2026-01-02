import clsx from "clsx";

type BorderProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  position?: "top" | "left" | "right";
  invert?: boolean; // Kept for compatibility, though theme classes handle this now
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  "as" | "className" | "position" | "invert"
>;

export function Border<T extends React.ElementType = "div">({
  as,
  className,
  position = "top",
  invert = false,
  ...props
}: BorderProps<T>) {
  // FIX: Cast to 'any' to unblock generic component rendering
  const Component = (as ?? "div") as any;

  return (
    <Component
      className={clsx(
        className,
        // Base Layout
        "pointer-events-none", // Ensure the border never blocks clicks

        // Sizing based on position
        position === "top" && "h-px w-full",
        (position === "left" || position === "right") && "h-full w-px",

        // THE NEW AESTHETIC: Gradient Fade
        // Instead of a hard line, we use a gradient that is solid in the center
        // and transparent at the edges. This looks premium and 'glassy'.

        // Horizontal Gradient (Top)
        position === "top" &&
          "bg-gradient-to-r from-neutral-200/0 via-neutral-200 to-neutral-200/0 dark:from-white/0 dark:via-white/10 dark:to-white/0",

        // Vertical Gradient (Left/Right)
        (position === "left" || position === "right") &&
          "bg-gradient-to-b from-neutral-200/0 via-neutral-200 to-neutral-200/0 dark:from-white/0 dark:via-white/10 dark:to-white/0",
      )}
      {...props}
    />
  );
}
