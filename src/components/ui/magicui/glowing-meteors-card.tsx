"use client";

import { cn } from "@/utils/cn"; // Make sure you have this utility
import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

// --- NEON GRADIENT CARD (BASE) ---
interface NeonColorsProps {
  firstColor: string;
  secondColor: string;
}

interface NeonGradientCardProps {
  className?: string;
  children?: ReactNode;
  borderSize?: number;
  borderRadius?: number;
  neonColors?: NeonColorsProps;
  [key: string]: any;
}

const NeonGradientCard: React.FC<NeonGradientCardProps> = ({
  className,
  children,
  borderSize = 2,
  borderRadius = 20,
  neonColors = {
    firstColor: "#ff00aa",
    secondColor: "#00FFF1",
  },
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      style={
        {
          "--border-size": `${borderSize}px`,
          "--border-radius": `${borderRadius}px`,
          "--neon-first-color": neonColors.firstColor,
          "--neon-second-color": neonColors.secondColor,
          "--card-width": `${dimensions.width}px`,
          "--card-height": `${dimensions.height}px`,
          "--card-content-radius": `${borderRadius - borderSize}px`,
          "--pseudo-element-background-image": `linear-gradient(0deg, ${neonColors.firstColor}, ${neonColors.secondColor})`,
          "--pseudo-element-width": `${dimensions.width + borderSize * 2}px`,
          "--pseudo-element-height": `${dimensions.height + borderSize * 2}px`,
          "--after-blur": `${dimensions.width / 3}px`,
        } as CSSProperties
      }
      className={cn(
        "relative z-10 size-full rounded-[var(--border-radius)]",
        className,
      )}
      {...props}
    >
      {/* The inner div is now a prop to allow for customization */}
      <div
        className={cn(
          "relative size-full min-h-[inherit] rounded-[var(--card-content-radius)] p-6",
          // Background is transparent to see meteors
          "bg-gray-100/0 dark:bg-neutral-900/0",
          "before:absolute before:-top-[var(--border-size)] before:-left-[var(--border-size)] before:-z-10 before:block",
          "before:h-[var(--pseudo-element-height)] before:w-[var(--pseudo-element-width)] before:rounded-[var(--border-radius)] before:content-['']",
          "before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] before:bg-[length:100%_200%]",
          "before:animate-background-position-spin",
          "after:absolute after:-top-[var(--border-size)] after:-left-[var(--border-size)] after:-z-10 after:block",
          "after:h-[var(--pseudo-element-height)] after:w-[var(--pseudo-element-width)] after:rounded-[var(--border-radius)] after:blur-[var(--after-blur)] after:content-['']",
          "after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] after:bg-[length:100%_200%] after:opacity-80",
          "after:animate-background-position-spin",
        )}
      >
        {children}
      </div>
    </div>
  );
};

// --- METEORS (IMPROVED) ---
interface MeteorsProps {
  number?: number;
  className?: string;
}

const Meteors = React.forwardRef<HTMLDivElement, MeteorsProps>(
  ({ number = 20, className }, ref) => {
    const [meteorStyles, setMeteorStyles] = useState<Array<CSSProperties>>([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // We use a ref to get the container's dimensions
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const { offsetWidth, offsetHeight } = containerRef.current;
          setDimensions({ width: offsetWidth, height: offsetHeight });
        }
      };
      updateDimensions();

      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
      if (dimensions.width > 0) {
        const styles = [...new Array(number)].map(() => ({
          top: "-5%",
          // Use container width for positioning, not window width
          left: `${Math.floor(Math.random() * dimensions.width)}px`,
          animationDelay: `${Math.random() * 1 + 0.2}s`,
          animationDuration: `${Math.floor(Math.random() * 8 + 2)}s`,
        }));
        setMeteorStyles(styles);
      }
    }, [number, dimensions]);

    return (
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        {[...meteorStyles].map((style, idx) => (
          <span
            key={idx}
            className={cn(
              "animate-meteor pointer-events-none absolute size-0.5 rotate-[215deg] rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              className,
            )}
            style={style}
          >
            <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
          </span>
        ))}
      </div>
    );
  },
);
Meteors.displayName = "Meteors";

// --- MERGED COMPONENT ---
export const GlowingMeteorsCard = ({
  children,
  className,
  ...props
}: NeonGradientCardProps) => {
  return (
    <NeonGradientCard className={className} {...props}>
      <div className="relative flex size-full flex-col items-center justify-center overflow-hidden">
        <Meteors number={30} />
        {children}
      </div>
    </NeonGradientCard>
  );
};
