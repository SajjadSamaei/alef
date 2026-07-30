"use client";
import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useTranslations } from "next-intl"; // 1. Import i18n hook

// 2. Define a Prop interface for TypeScript
interface ApartmentInfoProps {
  onClick: () => void; // 3. Fixed typo 'onClcik' -> 'onClick'
  className?: string;
  bgColor?: string;
  accentColor?: string;
  title: string | number;
  titleColor?: string;
  hoverBgColor?: string;
  [key: string]: any; // To allow other motion props
}

export function ApartmentInfo({
  onClick, // 3. Fixed typo
  className,
  hoverTextColor,
  bgColor = "bg-neutral-900",
  accentColor = "text-neutral-700",
  title = "",
  titleColor = "text-white",
  hoverBgColor = "hover:bg-neutral-900",
  ...props
}: ApartmentInfoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations("Project.Jaroun.UnitSelector"); // 4. Get translations

  return (
    <div className="flex items-center justify-end">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative flex items-center"
      >
        <button
          onClick={onClick} // 3. Fixed typo
          aria-label={t("aria.showUnit", { title })} // 5. Localized aria-label
          className={clsx(
            className,
            "glow-button flex-none rounded-full p-1 shadow-lg drop-shadow-xs",
            bgColor,
            accentColor,
            hoverBgColor,
          )}
          {...props}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-current xl:h-10 xl:w-10">
            <span
              className={clsx(
                "flex h-2 w-2 items-center justify-center text-sm leading-none xl:text-base",
                titleColor,
                hoverTextColor,
              )}
            >
              {title} {/* 6. Render localized title directly */}
            </span>
          </div>
        </button>
      </motion.div>
    </div>
  );
}
