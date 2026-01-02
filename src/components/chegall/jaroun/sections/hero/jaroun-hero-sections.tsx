"use client";
import Image from "next/image";
import {
  MoveToUnitButton,
  MoveToFQAButton,
} from "@/components/chegall/jaroun/sections/hero/jaroun-hero-buttons";
import * as motion from "motion/react-client";
import { PageIntro } from "@/components/chegall/studio/PageIntroForProject";
import { JarounHeroDesktopImage } from "@/components/chegall/jaroun/sections/hero/jaroun-hero-desktop";
import { useTranslations } from "next-intl"; // 1. Import the hook

export function JarounHeroMobile() {
  const t = useTranslations("Project.Jaroun"); // 2. Get translations

  return (
    <>
      <motion.div
        initial={{ boxShadow: "0 0 0 0 rgba(255, 255, 255, 0)", opacity: 0 }} // Start with no glow and transparent
        animate={{
          boxShadow: "0 0 20px 10px rgba(255, 255, 255, 0.5)",
          opacity: 1,
        }} // Add glow and fade in
        transition={{ duration: 1, ease: "easeOut" }} // Smooth transition
      >
        <Image
          alt={t("heroAlt")} // 3. Use localized alt text
          placeholder="blur"
          src="https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/jaroun-hero-sm.png"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAKCAIAAADzWwNnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAqElEQVR4nGPYsuXQqXM37jx68fzdxw+/fzMcOHLuwNHT23btfvjyxZe/vxhyswoD/cNKc/NqiovOnTvBkJ+W5e7sWZiWmRUff/TwXobctGxXR8/c1NSshPgTxw4yZCZnODq4g+Vjz589DuJbWznGBIemREQcP36EwdzIWFVV393e3sbcateu7Qy6Wtpebl6ZifG+bh4NdbUM3CyMxroans52mUmxQT4eABJgSDsB+k2LAAAAAElFTkSuQmCC"
          width={1218}
          height={563}
          className="hero-gradient-mask iphone-se:h-[90vh] iphone-se:object-fill iphone-pro:h-[89vh] iphone-pro:object-cover iphone-promax:h-[89vh] w-full rounded-t-3xl object-cover sm:hidden"
        />
      </motion.div>

      <div className="absolute top-1/3 right-1 left-1 z-10 flex -translate-y-1/3 items-center justify-center gap-2 sm:hidden">
        <PageIntro
          eyebrow={t("eyebrow")} // 4. Use localized text
          title={t("title")} // 4. Use localized text
          centered
          titleColor="text-jarounSuperLight"
          accentColor="text-jarounTitleLight"
          titleFont="text-4xl iphone-pro:text-5xl sm:text-6xl"
          eyebrowFont="font-display text-base font-semibold"
        >
          <p className="font-medium">
            {t("subtitle")} {/* 4. Use localized text */}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            {/* These components are already localized from the previous step */}
            <MoveToUnitButton />
            <MoveToFQAButton />
          </div>
        </PageIntro>
      </div>
    </>
  );
}

export function JarounHeroDesktop() {
  const t = useTranslations("Project.Jaroun"); // 2. Get translations

  return (
    <div className="hidden flex-col sm:flex">
      <div className="flex gap-2">
        <PageIntro
          titleColor="text-jarounGray7"
          titleFont="text-5xl xl:text-6xl"
          eyebrowFont="md:text-lg lg:text-xl text-base/7 font-semibold"
          accentColor="text-jarounVeryDark"
          eyebrow={t("eyebrow")} // 4. Use localized text
          title={t("title")} // 4. Use localized text
          centered
        >
          <p className="iphone-promax:text-xl mt-4 text-lg leading-8 text-balance subpixel-antialiased md:leading-8 lg:line-clamp-[calc(var(--characters)/100)] lg:text-2xl lg:leading-9">
            {t("subtitle")} {/* 4. Use localized text */}
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <MoveToUnitButton />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <MoveToFQAButton />
            </motion.div>
          </div>
        </PageIntro>
      </div>
      <div className="mx-auto mt-8 overflow-hidden rounded-4xl md:max-w-2xl lg:max-w-4xl xl:max-w-none">
        <JarounHeroDesktopImage />
      </div>
    </div>
  );
}
