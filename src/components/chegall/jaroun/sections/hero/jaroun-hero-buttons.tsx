"use client";
import { Link } from "@/src/i18n/routing"; // 1. Use locale-aware Link
import clsx from "clsx";
import React, { ReactNode } from "react"; // 2. Import React/ReactNode
import { useTranslations } from "next-intl"; // 3. Import i18n hook

// 4. Define prop types for the polymorphic Button
type ButtonProps = {
  invert?: boolean;
  outline?: boolean;
  className?: string;
  children: ReactNode;
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<"button"> & { href?: undefined })
);

export function Button({
  invert = false,
  outline = false,
  className,
  children,
  ...props
}: ButtonProps) {
  className = clsx(
    className,
    "inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition",
    invert
      ? "bg-jarounVeryLight text-neutral-950 hover:bg-jarounLight"
      : "bg-jarounBlack text-white hover:bg-jarounVeryDark",
    outline ? "outline-jarounBlack outline " : "",
  );

  let inner = <span className="relative top-px">{children}</span>;

  if (typeof props.href === "undefined") {
    return (
      <button className={className} {...props}>
        {inner}
      </button>
    );
  }

  // 'props' will include 'href', so it will be treated as LinkProps
  return (
    <Link className={className} {...props} href={props.href}>
      {inner}
    </Link>
  );
}

export function MoveToUnitButton() {
  const t = useTranslations("CommonButtons"); // 5. Get translations

  const handleScrollToSection = () => {
    const section = document.getElementById("controller-start");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Button
      onClick={handleScrollToSection}
      aria-label={t("aria.readUnitFeatures")} // 6. Use translated aria-label
    >
      {t("unitFeatures")} {/* 7. Use translated text */}
    </Button>
  );
}

export function MoveToFQAButton() {
  const t = useTranslations("CommonButtons"); // 5. Get translations

  const handleScrollToFAQ = () => {
    const section = document.getElementById("faq");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Button
      invert={true} // 8. Use boolean prop
      outline={true} // 8. Use boolean prop
      onClick={handleScrollToFAQ}
      aria-label={t("aria.readFAQ")} // 6. Use translated aria-label
    >
      {t("yourQuestions")} {/* 7. Use translated text */}
    </Button>
  );
}
