import { Container } from "@/components/chegall/studio/Container";
import { Gradient } from "@/components/chegall/radient/gradient";
import { Navbar } from "@/components/chegall/radient/Navbar";
import { ButtonCustomColor } from "@/components/ui/button";
import { TypingAnimation } from "@/components/ui/magicui/typing-animation";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react"; // Optional icon for the badge
import type { LandingPage } from "@/src/payload-types";
import type { PublicSiteSettings } from "@/src/types/site-settings";

// --- Hero Component ---
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
      {/* 1. Changed inset to bottom-2 on mobile so it doesn't touch the very edge 
        2. Added min-h-[85vh] on mobile to force it to be a full-screen experience
      */}
      <Gradient className="absolute inset-2 bottom-2 rounded-4xl ring-1 ring-black/5 ring-inset sm:bottom-0 sm:min-h-0" />

      <Container className="relative h-full">
        <Navbar settings={settings} />

        {/* LAYOUT FIX: 
           - min-h-[80vh]: Forces the hero to take up screen height on mobile.
           - flex-col justify-center: Vertically centers content in that height.
           - items-center: Horizontally centers content (mobile).
           - sm:items-start: Returns to left align on desktop.
        */}
        <div className="flex min-h-[75vh] flex-col items-center justify-center pb-16 sm:min-h-0 sm:items-start sm:justify-start sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          {/* Main Headline */}
          <div className="flex w-full flex-col items-center sm:items-start">
            <TypingAnimation
              // Added 'text-center sm:text-left'
              className="font-display text-center text-5xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-start sm:text-8xl/[0.8] md:text-9xl/[0.8]"
              duration={50}
            >
              {content?.title || t("title")}
            </TypingAnimation>
          </div>

          {/* Subtitle */}
          {/* Added 'text-center sm:text-left' and 'mx-auto sm:mx-0' */}
          <p className="mt-8 max-w-lg text-center text-lg/7 font-medium text-gray-950/75 sm:mx-0 sm:text-start sm:text-2xl/8">
            {content?.subtitle || t("subtitle")}
          </p>

          {/* Buttons */}
          {/* Added 'w-full justify-center' for mobile buttons */}
          <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:mt-12 sm:w-fit sm:flex-row">
            <ButtonCustomColor
              href="/portfolio"
              className="w-full justify-center rounded-full bg-neutral-950 px-8 py-4 font-semibold text-white hover:bg-neutral-800 sm:w-auto sm:py-3"
            >
              {content?.primaryButton || t("primaryButton")}
            </ButtonCustomColor>

            <ButtonCustomColor
              href="/contact"
              className="w-full justify-center rounded-full bg-white px-8 py-4 font-semibold text-neutral-950 ring-1 ring-neutral-950/10 hover:bg-neutral-50 sm:w-auto sm:py-3"
            >
              {content?.secondaryButton || t("secondaryButton")}
            </ButtonCustomColor>
          </div>
        </div>
      </Container>
    </div>
  );
}
