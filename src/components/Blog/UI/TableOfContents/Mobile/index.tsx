"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ListBulletIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { TOCItem } from "@/components/Blog/UI/TableOfContents/hooks/extractHeadings"; // Adjust path to your types
import { useTranslations } from "next-intl";

export function MobileTableOfContents({ headings }: { headings: TOCItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Blog");
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by mounting portal only on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!headings || headings.length === 0) return null;

  // Toggle Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Portal Content
  const portalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 bottom-0 left-0 z-[70] flex max-h-[80vh] flex-col rounded-t-[32px] bg-white shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10"
          >
            {/* Handle Bar (Visual cue for dragging/sheet) */}
            <div
              className="flex justify-center pt-4 pb-2"
              onClick={() => setIsOpen(false)}
            >
              <div className="h-1.5 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
                {t("tableOfContents")}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-neutral-100 p-2 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-8">
              <nav className="space-y-1">
                {headings.map((heading, index) => (
                  <a
                    key={index}
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      "block rounded-xl py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white",
                      heading.level === 3 && "pl-4 text-xs opacity-80",
                    )}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Floating Action Button (Only visible on Mobile/Tablet) */}
      <div className="fixed right-6 bottom-6 z-40 lg:hidden">
        <motion.button
          onClick={toggleOpen}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }} // Delay helps it pop in after page load
          className={clsx(
            "flex h-14 w-14 items-center justify-center rounded-full shadow-xl shadow-neutral-900/20",
            "bg-neutral-900/90 text-white backdrop-blur-md", // Dark mode default for contrast
            "dark:bg-white/90 dark:text-neutral-900", // Light mode inverse
            "border border-white/10 dark:border-black/10",
          )}
          aria-label="Table of Contents"
        >
          <ListBulletIcon className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Render Portal */}
      {mounted && createPortal(portalContent, document.body)}
    </>
  );
}
