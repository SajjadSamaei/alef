"use client";
import { ImSpinner6 } from "react-icons/im";
import Image from "next/image";
import { useTranslations } from "next-intl"; // 1. Import the hook

// 2. Define a type for the props
interface LoadingProps {
  src: string;
  alt: string;
}

export function SpinningModelLoading({ src, alt }: LoadingProps) {
  const t = useTranslations("Common"); // 3. Get translations

  return (
    <div className="relative flex aspect-4/5 h-full w-sm scale-120 items-center justify-center md:w-lg lg:w-xl xl:scale-150">
      <Image
        alt={alt}
        width={1300}
        height={1080}
        src={src}
        className="absolute bottom-1/2 left-1/2 flex aspect-4/5 h-3/4 w-full -translate-x-1/2 translate-y-1/2 scale-75 rounded-lg object-cover object-center blur-xs lg:h-9/10 xl:aspect-5/4 xl:h-full xl:scale-50"
      />
      <div className="z-10 flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center">
          <ImSpinner6 className="fill-jarounGray1 h-10 w-10 animate-spin" />
        </div>
        <span className="subtitle-style text-jarounGray1/95 md:text-jarounGray1/99 text-center">
          {t("pleaseWait")} {/* 4. Use localized text */}
        </span>
      </div>
    </div>
  );
}

export function SpinningVideoLoading({ src, alt }: LoadingProps) {
  const t = useTranslations("Common"); // 3. Get translations

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <Image
        alt={alt}
        width={1300}
        height={1080}
        src={src}
        className="absolute bottom-1/2 left-1/2 flex h-auto w-full -translate-x-1/2 translate-y-1/2 scale-200 rounded-lg object-cover object-center blur-xs xl:scale-300"
      />
      <div className="z-10 flex-col items-center justify-center">
        <span className="subtitle-style text-jarounGray1/95 md:text-jarounGray1/99 text-center">
          {t("pleaseWait")} {/* 4. Use localized text */}
        </span>
      </div>
    </div>
  );
}