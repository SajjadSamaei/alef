import clsx from "clsx";

type BorderProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  position?: "top" | "left" | "right" | "simple";
  invert?: boolean;
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
  const Component = (as ?? "div") as any;

  return (
    <Component
      className={clsx(
        className,
        // 1. Structure
        "relative",
        "after:pointer-events-none after:absolute",

        // 2. Colors (Gradient Fade)
        invert
          ? "after:from-white/0 after:via-white/40 after:to-white/0"
          : "after:from-black/0 after:via-black/15 after:to-black/0 dark:after:from-white/0 dark:after:via-white/20 dark:after:to-white/0",

        // 3. TOP
        (position === "top" || position === "simple") && [
          "after:inset-x-0 after:top-0 after:h-px",
          "after:bg-gradient-to-r",
        ],

        // 4. SIDE - LEFT (Start)
        // In English: Left. In Farsi: Right.
        position === "left" && [
          "after:top-0 after:bottom-0 after:w-px",
          "after:start-0", // <--- Ensures correct placement in RTL
          "after:bg-gradient-to-b",
        ],

        // 5. SIDE - RIGHT (End)
        position === "right" && [
          "after:top-0 after:bottom-0 after:w-px",
          "after:end-0",
          "after:bg-gradient-to-b",
        ],
      )}
      {...props}
    />
  );
}
