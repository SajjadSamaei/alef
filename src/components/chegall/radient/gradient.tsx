import { clsx } from "clsx";

export function Gradient({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "bg-linear-115 from-[#ffcba3] from-28% via-[##A3C4FF] via-70% to-[##8DA7AA] sm:bg-linear-145",
      )}
    />
  );
}

type GradientVariant = "warm" | "cool" | "earth";

interface GradientProps extends React.ComponentPropsWithoutRef<"div"> {
  variant?: GradientVariant;
}

export function GradientComponent({
  className,
  variant = "warm", // Default to your original colors
  ...props
}: GradientProps) {
  const gradients = {
    // 1. Original (Peach/Blue) - Good for Hero / Creative vibes
    warm: "bg-[linear-gradient(115deg,#ffecd2_0%,#fcb69f_50%,#c1dce0_100%)] sm:bg-[linear-gradient(145deg,#ffecd2_0%,#fcb69f_50%,#c1dce0_100%)]",

    // 2. Cool (Blue/Grey/White) - Good for "Structure", "Glass", "Corporate"
    // Evokes a clean, modern architectural feel
    cool: "bg-[linear-gradient(115deg,#e0c3fc_0%,#8ec5fc_50%,#e0c3fc_100%)] sm:bg-[linear-gradient(145deg,#e0c3fc_0%,#8ec5fc_50%,#e0c3fc_100%)] saturate-[0.8]",

    // 3. Earth (Sage/Beige/Stone) - Good for "Sustainability", "Landscape", "Calm"
    // Evokes nature and raw materials
    earth:
      "bg-[linear-gradient(115deg,#e6e9f0_0%,#eef1f5_50%,#d9ded8_100%)] sm:bg-[linear-gradient(145deg,#e6e9f0_0%,#eef1f5_50%,#d9ded8_100%)]",
  };

  return (
    <div
      {...props}
      className={clsx(
        className,
        "opacity-60", // Keep the opacity consistent
        gradients[variant],
      )}
    />
  );
}

// Steller Bloom: "bg-[linear-gradient(115deg,#ff9a9e_0%,#fad0c4_25%,#a18cd1_75%,#fbc2eb_100%)]"

export function GradientBackground({ className }: { className?: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-44 z-[-1]">
      <div
        className={clsx(
          // relative & centered
          "relative left-1/2 -translate-x-1/2 transform-gpu",
          // responsive size
          "h-80 w-[120vw] sm:w-[150vw] md:w-[100vw]",
          // gradient style
          "bg-[linear-gradient(115deg,#fff1be_0%,#fff1be_25%,#fff1be_75%,#e6d5b8_100%)]",
          "rounded-full blur-3xl",
        )}
      />
    </div>
  );
}
