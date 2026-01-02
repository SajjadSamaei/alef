"use client";
import { useState, useEffect } from "react";

// Define your breakpoints to match your CSS (e.g., Tailwind's defaults)
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const useBreakpoint = () => {
  const getBreakpoint = (width) => {
    if (width < breakpoints.sm) return "sm";
    if (width < breakpoints.md) return "md";
    if (width < breakpoints.lg) return "lg";
    if (width < breakpoints.xl) return "xl";
    return "2xl";
  };

  const [breakpoint, setBreakpoint] = useState("xl");

  useEffect(() => {
    // Set the initial breakpoint
    setBreakpoint(getBreakpoint(window.innerWidth));

    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return breakpoint;
};
