"use client";
import FAQ from "components/chegall/jaroun/ui/jaroun-faq";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { useTranslations } from "next-intl"; // 1. Import the hook

export default function JarounFAQ() {
  const t = useTranslations("Project.Jaroun.FAQ"); // 2. Get translations

  // 3. Get the questions array from your translations file
  const questions = t.raw("questions") as {
    question: string;
    answer: string;
  }[];

  return (
    <FadeIn>
      <div id="faq" className="section-style section-padding">
        <div className="mx-auto lg:max-w-7xl lg:px-8">
          <h2 className="text-jarounTitleDark text-base/7 font-semibold xl:mb-2">
            {t("eyebrow")} {/* 4. Use translated text */}
          </h2>
          <p className="text-jarounGray7 mt-2 max-w-lg text-4xl font-medium tracking-tight text-pretty sm:text-5xl">
            {t("title")} {/* 4. Use translated text */}
          </p>

          <div className="mt-10 sm:mt-16">
            <FAQ questions={questions} />
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
