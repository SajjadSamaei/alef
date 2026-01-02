"use client";
import { cn } from "@/utils/cn";
import React from "react";
import { Card, type CardPostData } from "@/components/Blog/UI/Archive/Card";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";

export type Props = {
  posts: CardPostData[];
};

export const CollectionArchive: React.FC<Props> = ({ posts }) => {
  const locale = useLocale();
  const direction = getDirection(locale);
  const isRtl = direction === "rtl";

  if (!posts || posts.length === 0) return null;

  const length = posts.length;

  const getItemStyles = (index: number) => {
    // 1. Single Item (Hero only) - Full Round
    if (length === 1) return "rounded-[40px]";

    // 2. Base styles (Small rounded 16px for "inner" corners to creates the cluster effect)
    let styles = "rounded-[10px]";

    // --- MOBILE (1 Column) ---
    // Top Item: Round Top
    if (index === 0) styles += " rounded-t-[40px]";
    // Bottom Item: Round Bottom (This causes the double corner issue on Desktop if not reset)
    if (index === length - 1) styles += " rounded-b-[40px]";

    // --- DESKTOP (lg: 3 Columns) ---

    // HERO (Index 0)
    // Always Top Rounded, Flat Bottom (connected to grid)
    if (index === 0) {
      styles += " lg:rounded-t-[40px] lg:rounded-b-[10px]";
    }

    // GRID ITEMS (Index > 0)
    if (index > 0) {
      const gridIndex = index - 1; // 0-based index relative to the 3-col grid
      const colPos = gridIndex % 3; // 0=Left, 1=Middle, 2=Right

      // Determine if we are in the visual last row
      const totalGridItems = length - 1;
      const currentRow = Math.floor(gridIndex / 3);
      const totalRows = Math.ceil(totalGridItems / 3);
      const isLastRow = currentRow === totalRows - 1;

      if (isLastRow) {
        if (index === length - 1) {
          styles += " lg:rounded-b-[10px]";
        }

        if (colPos === 0) {
          styles += isRtl ? " lg:rounded-br-[40px]" : " lg:rounded-bl-[40px]";
        }

        if (colPos === 2) {
          styles += isRtl ? " lg:rounded-bl-[40px]" : " lg:rounded-br-[40px]";
        }
      }
    }

    return styles;
  };

  return (
    <div className="container py-16 lg:py-24">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {posts.map((post, index) => {
          if (!post || typeof post !== "object") return null;

          const isHero = index === 0;
          const gridSpan = isHero
            ? "col-span-1 md:col-span-2 lg:col-span-3"
            : "col-span-1";

          // ASPECT RATIO LOGIC
          const aspectClass = isHero
            ? "aspect-[4/5] md:aspect-[16/9] lg:aspect-[2.4/1]"
            : "aspect-[4/5] lg:aspect-[3/4]";

          return (
            <motion.div
              key={post.id}
              className={cn("w-full", gridSpan)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className={cn("h-full w-full", aspectClass)}>
                <Card
                  className={cn("h-full w-full", getItemStyles(index))}
                  doc={post}
                  relationTo="blog"
                  showCategories
                  imageSize={isHero ? "xlarge" : "card"}
                  isHero={isHero}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
