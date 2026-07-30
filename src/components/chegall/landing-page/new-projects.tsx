import Image from "next/image";
import { clsx } from "clsx";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { AuroraText } from "@/components/ui/magicui/aurora-text";
// import { PinnedTextReveal } from "@/components/ui/magicui/text-reveal"; // Assuming this is also localized
import { useLocale, useTranslations } from "next-intl"; // 1. Import i18n hooks
import { Link } from "@/src/i18n/routing"; // 2. Import locale-aware Link
import { getDirection } from "@/utils/hooks/useDirection";

type showCaseProps = {
  className?: string;
};

const getButtonClasses = (invert = false) => {
  return clsx(
    "inline-flex items-center rounded-full px-4 py-1.5 text-base sm:text-sm font-semibold transition",
    invert
      ? "bg-white text-neutral-950 hover:bg-neutral-200"
      : "bg-neutral-950 text-white hover:bg-neutral-800",
  );
};

export default function NewProjects({ className }: showCaseProps) {
  const t = useTranslations("ProjectShowcase");
  const locale = useLocale();
  const direction = getDirection(locale);

  return (
    <div className="overflow-hidden bg-[#f6f8fc] py-16">
      {/* <PinnedTextReveal text={t("pinnedText")} /> */}

      <div className="section-style-no-mobile">
        <div
          className={clsx("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}
        >
          <FadeIn className="col-span-1 mb-8 sm:col-span-2">
            <div className="section-style mx-auto text-center">
              <h2 className="text-jarounGray7 eyebrow-style mb-2 lg:mb-3">
                {t("Upcoming.eyebrow")}
              </h2>
              <p className="text-jarounGray7 title-style text-4xl font-medium sm:text-5xl">
                {t("Upcoming.title")}
              </p>
              <p className="text-jarounGray6 paragraph-style mx-auto mt-6 max-w-3xl text-center text-xl">
                {t("Upcoming.description")}
              </p>
            </div>
          </FadeIn>
          <FadeIn
            className={clsx(
              "flex max-h-[48rem] items-center justify-center overflow-hidden bg-[#efefef] sm:max-h-[36rem]",
              direction === "rtl"
                ? "sm:rounded-r-[40px]"
                : "sm:rounded-l-[40px]",
            )}
          >
            <div className="relative w-full bg-[#6d8cc6] pt-16 sm:bg-[#d6e6fa] sm:pt-28">
              <Image
                width="1200"
                height="2000"
                alt={t("haft.alt")}
                src="https://storage.c2.liara.space/chegall/hero/haft-sm.jpg"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAJ0lEQVR4nAEcAOP/ANbb6ens+QDd4PD5/P8AbW55m5yoABAQFwQEDggIDop7vOREAAAAAElFTkSuQmCC"
                placeholder="blur"
                className="h-full w-full object-cover sm:hidden"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to top, black 70%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to top, black 70%, transparent 100%)",
                }}
              />
              <Image
                width="1200"
                height="960"
                alt={t("haft.alt")}
                src="https://storage.c2.liara.space/chegall/hero/haft-xl.jpg"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAMklEQVR4nAEnANj/APz9/97e6uPn9rvE2wCPlKBvb3tWVV+VmqgAHx8mJicyBAALLjRA3UASSs0yiK0AAAAASUVORK5CYII="
                placeholder="blur"
                className="hidden w-full object-cover sm:block"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to top, black 70%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to top, black 70%, transparent 100%)",
                }}
              />

              <div className="absolute top-1/5 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center sm:top-1/4 lg:top-1/5">
                <h3 className="title-style mt-4 text-center text-nowrap text-white sm:text-black">
                  {t("haft.title")}
                </h3>
                <h4 className="eyebrew-style mt-4 text-center text-nowrap text-white sm:text-black">
                  {t("haft.subtitle")}
                </h4>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Link
                    href="/work/haft"
                    aria-label={t("haft.ariaLabel")}
                    className={getButtonClasses(true)} // invert={true}
                  >
                    {t("tajeer.ariaLabel")}
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* --- Golkhane Project --- */}
          <FadeIn
            className={clsx(
              "bg-nirvanaGrey flex max-h-[48rem] items-center justify-center overflow-hidden sm:max-h-[36rem]",
              direction === "rtl"
                ? "sm:rounded-l-[40px]"
                : "sm:rounded-r-[40px]",
            )}
          >
            <div className="bg-golkhaneSkyBlue relative w-full pt-16 sm:bg-[#f1f1ef] sm:pt-28">
              <Image
                width="500"
                height="500"
                alt={t("tajeer.alt")}
                src="https://storage.c2.liara.space/chegall/hero/tajeer-sm.jpg"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAECAIAAAArjXluAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAJUlEQVR4nGP4/vP7r9+/GO5ePXvqwFaG+HBPAQYGhlBvOxFOBgDz8gyfaHCbVwAAAABJRU5ErkJggg=="
                placeholder="blur"
                className="h-full w-full object-cover sm:hidden"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to top, black 70%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to top, black 70%, transparent 100%)",
                }}
              />
              <Image
                width="1200"
                height="960"
                alt={t("tajeer.alt")}
                src="https://storage.c2.liara.space/chegall/hero/tajeer-xl.jpg"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAMklEQVR4nAEnANj/APv7+fz79/r18Pz8+wDr6+ZxaV1BNip4bGAAj4V5QDcrEAAAHA0ADOQT8ChKd7YAAAAASUVORK5CYII="
                placeholder="blur"
                className="hidden w-full object-cover sm:block"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to top, black 70%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to top, black 70%, transparent 100%)",
                }}
              />

              <div className="absolute top-1/5 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center sm:top-1/4 lg:top-1/5">
                <h3 className="title-style mt-4 text-center text-nowrap text-white sm:text-black">
                  {t("tajeer.title")}
                </h3>
                <h4 className="eyebrew-style mt-4 text-center text-nowrap text-white sm:text-black">
                  {t("tajeer.subtitle")}
                </h4>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Link
                    href="/work/tajeer"
                    aria-label={t("tajeer.ariaLabel")}
                    className={getButtonClasses(true)} // invert={true}
                  >
                    {t("tajeer.ariaLabel")}
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
