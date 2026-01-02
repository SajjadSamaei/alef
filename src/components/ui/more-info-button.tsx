"use client";
import { useState, ReactNode, ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { CircleButton } from "@/components/chegall/studio/CircleButton";
import clsx from "clsx";

// --- Interface for MoreInfoButton ---
interface MoreInfoButtonProps {
  onClick?: () => void;
  children: ReactNode;
  divClassName?: string;
  className?: string;
  bgColor?: string;
  hoverButton?: boolean;
  buttonPosition?: string;
  hoverText?: string;
  hoverBgColor?: string;
  outlineColor?: string;
  outline?: boolean;
  textColor?: string;
}

export function MoreInfoButton({
  onClick,
  children,
  divClassName = "",
  className = "",
  bgColor = "bg-neutral-900",
  hoverButton = true,
  buttonPosition = "left-full",
  hoverText = "اطلاعات بیشتر",
  hoverBgColor = "hover:bg-neutral-900",
  outlineColor = "outline-neutral-950",
  outline = false,
  textColor = "text-white",
}: MoreInfoButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={clsx("flex items-center justify-end", divClassName)}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative flex items-center"
      >
        <CircleButton
          className={className}
          bgColor={bgColor}
          hoverBgColor={hoverBgColor}
          outline={outline}
          outlineColor={outlineColor}
          onClick={onClick}
          aria-label={`Read more about our work`}
        >
          {children}
        </CircleButton>

        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 10 : -10,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className={clsx(
            !hoverButton && "hidden",
            buttonPosition,
            "absolute top-0 rounded-full p-2 text-xs whitespace-nowrap shadow-lg",
            bgColor,
            textColor
          )}
        >
          {hoverText}
        </motion.span>
      </motion.div>
    </div>
  );
}

// --- Interface for MoreInformationButton ---
// Extending HTML attributes allows you to pass standard button props (disabled, type, etc.)
interface MoreInformationButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function MoreInformationButton({
  onClick,
  children,
  className = "",
  ariaLabel = "",
  ...props
}: MoreInformationButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center"
    >
      <button
        aria-label={ariaLabel}
        onClick={onClick}
        className={clsx(
          className,
          "inline-flex rounded-full px-2 py-2 text-sm font-semibold text-white transition"
        )}
        {...props}
      >
        <span className="relative top-px">{children}</span>
      </button>
    </motion.div>
  );
}