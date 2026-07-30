// src/components/ui/share/ShareButton.tsx

"use client";
import { Link } from "@/src/i18n/routing"; // Use locale-aware Link
import clsx from "clsx";
import { ChegallSimpleToast } from "@/components/ui/sonner-card";
import { LinkIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { ShareIcon } from "@heroicons/react/16/solid";
import { IoMdMail } from "react-icons/io";
import { FaWhatsapp, FaTelegramPlane, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useEffect, useState, ReactNode } from "react";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownLabel,
} from "@/components/ui/share/share-dropdown";
import { useLocale, useTranslations } from "next-intl";

// --- Button Component ---
type ButtonProps = {
  invert?: boolean;
  outline?: boolean;
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
    "inline-flex items-center rounded-full px-4 py-1.5 text-base sm:text-sm font-semibold transition",
    invert
      ? "bg-white text-neutral-950 hover:bg-neutral-200"
      : "bg-neutral-950 text-white hover:bg-neutral-800",
    outline ? "outline-neutral-950 outline-1" : "",
  );

  let inner = <span className="relative">{children}</span>;

  if (typeof props.href === "undefined") {
    return (
      <button className={className} {...props}>
        {inner}
      </button>
    );
  }

  return (
    <Link className={className} {...props} href={props.href}>
      {inner}
    </Link>
  );
}

// --- ShareButton (Web Share API) Component ---
type ShareButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  text?: string;
  url?: string;
};

export function ShareButton({
  className,
  children,
  title,
  text,
  url,
  ...props
}: ShareButtonProps) {
  const t = useTranslations("ShareComponent");
  className = clsx(
    className,
    "inline-flex rounded-full px-4 py-1.5 text-md font-semibold transition relative top-px",
  );

  const handleShare = async () => {
    const shareData = {
      title: title || t("defaultTitle"),
      text: text || t("defaultText"),
      url: url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      ChegallSimpleToast({
        title: t("linkCopied"),
      });
    }
  };

  return (
    <button onClick={handleShare} className={className} {...props}>
      {children}
    </button>
  );
}

// --- Main Share Component (with Dropdown) ---
type ShareProps = {
  className?: string;
  title?: string;
  text?: string;
  url?: string;
  buttonName?: string;
};

export function Share({ className, title, text, url, buttonName }: ShareProps) {
  const t = useTranslations("ShareComponent");
  const locale = useLocale();
  const direction = locale === "fa" ? "rtl" : "ltr";

  className = clsx(
    className,
    "rounded-full p-2 text-md font-semibold transition relative top-px",
  );

  const [shareData, setShareData] = useState({
    title: title || t("defaultTitle"),
    text: text || t("defaultText"),
    url: "",
    absoluteUrl: "",
  });

  useEffect(() => {
    let finalUrl;

    if (url) {
      // A specific URL prop was provided (e.g., "/work/dey")
      // We must construct the locale-aware path.
      // We assume 'fa' is your default locale and has no prefix.
      const localePath = locale === "fa" ? url : `/${locale}${url}`;

      // Create the absolute URL from the new, localized path
      finalUrl = new URL(localePath, window.location.origin).href;
    } else {
      // No URL prop was provided, so just use the current page's URL,
      // which is already fully localized.
      finalUrl = window.location.href;
    }

    setShareData({
      title: title || t("defaultTitle"),
      text: text || t("defaultText"),
      url: finalUrl,
      absoluteUrl: finalUrl, // Use the same final URL
    });

    // Add `locale` to the dependency array
  }, [title, text, url, t, locale]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareData.url);
      ChegallSimpleToast({
        title: t("linkCopied"),
      });
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(
        shareData.absoluteUrl || window.location.href,
      );
      ChegallSimpleToast({
        title: t("linkCopied"),
      });
    } catch (err) {}
  };

  const handleShareTelegram = () => {
    const urlToShare = `https://t.me/share/url?url=${encodeURIComponent(
      shareData.absoluteUrl || window.location.href,
    )}&text=${encodeURIComponent(title || "")}`;
    window.open(urlToShare, "_blank", "noopener,noreferrer");
  };

  const handleShareWhatsApp = () => {
    const urlWP = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      (title || "") + " " + (shareData.absoluteUrl || window.location.href),
    )}`;
    window.open(urlWP, "_blank", "noopener,noreferrer");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(title || "");
    const body = encodeURIComponent(
      t("emailBody", { url: shareData.absoluteUrl || window.location.href }),
    );
    const urlForEmail = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = urlForEmail;
  };

  const handleShareX = () => {
    const urlForX = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareData.absoluteUrl || window.location.href,
    )}&text=${encodeURIComponent(title || "")}`;
    window.open(urlForX, "_blank", "noopener,noreferrer");
  };

  const handleShareFacebook = () => {
    const urlFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareData.absoluteUrl || window.location.href,
    )}`;
    window.open(urlFacebook, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        href={url}
        aria-label={t("aria.readCaseStudy", { title: title || t("untitled") })}
      >
        {buttonName || t("viewProject")}
      </Button>
      <button
        onClick={handleShare}
        className={clsx(className, "text-neutral-950 hover:bg-neutral-200")}
      >
        <ShareIcon className="fill-jarounBlack h-6 w-6 sm:h-5 sm:w-5" />
      </button>
      <button
        onClick={handleCopyUrl}
        className={clsx(className, "text-neutral-950 hover:bg-neutral-200")}
      >
        <LinkIcon className="fill-jarounBlack h-6 w-6 sm:h-5 sm:w-5" />
      </button>
      <Dropdown>
        <DropdownButton plain>
          <EllipsisHorizontalIcon className="fill-jarounBlack h-5 w-5" />
        </DropdownButton>
        <DropdownMenu dir={direction}>
          <DropdownItem onClick={handleShareTelegram}>
            <FaTelegramPlane className="h-5 w-5 fill-neutral-200" />
            <DropdownLabel className="text-neutral-200">
              {t("telegram")}
            </DropdownLabel>
          </DropdownItem>
          <DropdownItem onClick={handleShareWhatsApp}>
            <FaWhatsapp className="h-5 w-5 fill-neutral-200" />
            <DropdownLabel className="text-neutral-200">
              {t("whatsapp")}
            </DropdownLabel>
          </DropdownItem>
          <DropdownItem onClick={handleShareX}>
            <FaXTwitter className="h-5 w-5 fill-neutral-200" />
            <DropdownLabel className="text-neutral-200">{t("x")}</DropdownLabel>
          </DropdownItem>
          <DropdownItem onClick={handleShareFacebook}>
            <FaFacebookF className="h-5 w-5 fill-neutral-200" />
            <DropdownLabel className="text-neutral-200">
              {t("facebook")}
            </DropdownLabel>
          </DropdownItem>
          <DropdownItem onClick={handleShareEmail}>
            <IoMdMail className="h-5 w-5 fill-neutral-200" />
            <DropdownLabel className="text-neutral-200">
              {t("email")}
            </DropdownLabel>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
