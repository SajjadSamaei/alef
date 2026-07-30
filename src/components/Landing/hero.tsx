import { Container } from "@/components/chegall/studio/Container";
import { Gradient } from "@/components/chegall/radient/gradient";
import { Navbar } from "@/components/chegall/radient/Navbar";
import { ButtonCustomColor } from "@/components/ui/button";
import { TypingAnimation } from "@/components/ui/magicui/typing-animation";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { LandingPage } from "@/src/payload-types";
import type { PublicSiteSettings } from "@/src/types/site-settings";

export default function Hero({
  content,
  settings,
}: {
  content?: LandingPage["hero"];
  settings: PublicSiteSettings;
}) {
  const t = useTranslations("HomePage.Hero");

  return (
    <div className="relative">
      <Gradient className="absolute inset-2 bottom-2 rounded-4xl ring-1 ring-black/5 ring-inset sm:bottom-0 sm:min-h-0" />

      <Container className="relative h-full">
        <Navbar settings={settings} />

        <div className="flex min-h-[70vh] flex-col items-center justify-center pb-16 sm:min-h-0 sm:items-start sm:justify-start sm:pt-24 sm:pb-28 md:pt-28 md:pb-36">
          {/* Main Headline with Typing Animation */}
          <div className="flex w-full flex-col items-center sm:items-start">
            <TypingAnimation
              className="font-display text-center text-5xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-start sm:text-8xl/[0.8] md:text-9xl/[0.8]"
              duration={50}
            >
              {content?.title || t("title")}
            </TypingAnimation>
          </div>

          {/* Subtitle */}
          <p className="mt-8 max-w-xl text-center text-lg/7 font-medium text-gray-950/80 sm:mx-0 sm:text-start sm:text-2xl/8">
            {content?.subtitle || t("subtitle")}
          </p>

          {/* Buttons with Animated Arrow */}
          <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:mt-12 sm:w-fit sm:flex-row">
            <ButtonCustomColor
              href="/portfolio"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-neutral-800 sm:w-auto sm:py-3.5 whitespace-nowrap"
            >
              <span className="whitespace-nowrap">{content?.primaryButton || t("primaryButton")}</span>
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </ButtonCustomColor>

            <ButtonCustomColor
              href="/contact"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-neutral-950 ring-1 ring-neutral-950/10 transition-all duration-300 hover:bg-neutral-100 hover:ring-neutral-950/20 sm:w-auto sm:py-3.5"
            >
              <span>{content?.secondaryButton || t("secondaryButton")}</span>
            </ButtonCustomColor>
          </div>
        </div>
      </Container>
    </div>
  );
}
