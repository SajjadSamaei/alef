"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { TOCItem } from "./hooks/extractHeadings";

export function TableOfContents({ headings }: { headings: TOCItem[] }) {
  const t = useTranslations("Blog");

  if (!headings || headings.length === 0) return null;

  return (
    <nav className="sticky top-32 hidden lg:block">
      <div className="relative pl-6">
        {/* Decorative Line */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-neutral-200 dark:bg-white/10" />

        <h3 className="mb-4 text-xs font-bold tracking-widest text-neutral-900 uppercase dark:text-white">
          {t("tableOfContents") || "On this page"}
        </h3>

        <ul className="space-y-3">
          {headings.map((heading, index) => (
            <li key={index}>
              <a
                href={`#${heading.id}`}
                className={clsx(
                  "block text-sm transition-colors duration-200",
                  "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
                  heading.level === 3 && "ml-4 text-xs", // Indent H3s
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
