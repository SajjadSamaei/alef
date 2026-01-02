"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: any;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  interactive?: boolean; // Toggle interaction
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  interactive = true, // Default to interactive
  ...props
}: GridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [hoveredSquare, setHoveredSquare] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const relativeY = event.clientY - rect.top;

      // Calculate grid coordinates based on mouse position
      const gridX = Math.floor(relativeX / width);
      const gridY = Math.floor(relativeY / height);

      setHoveredSquare({ x: gridX, y: gridY });
    };

    const handleMouseLeave = () => {
      setHoveredSquare(null);
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [interactive, width, height]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        "dark:fill-white/5 dark:stroke-white/5", // Dark mode support
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>

      {/* The Grid Lines */}
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />

      {/* Interactive Hover Effect */}
      {hoveredSquare && (
        <motion.rect
          layoutId="grid-highlight"
          width={width - 1}
          height={height - 1}
          x={hoveredSquare.x * width + 1 + x}
          y={hoveredSquare.y * height + 1 + y}
          className="fill-neutral-950/10 dark:fill-white/10" // Subtle highlight color
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }} // Snappy follow
        />
      )}
    </svg>
  );
}