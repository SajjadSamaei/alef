"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { Link as LinkIcon, Share2, Mail, Check } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane, FaFacebookF } from "react-icons/fa";
import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { Button } from "@/components/ui/button";
import { StyledSimpleToast } from "@/components/Blog/UI/Share/sonner-card"; // Adjust import path if needed

type ShareProps = {
  className?: string;
  title?: string;
  text?: string;
  url?: string;
};

export function Share({ className, title, text, url }: ShareProps) {
  const t = useTranslations("ShareComponent");
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [shareData, setShareData] = useState({
    title: "",
    text: "",
    url: "",
  });

  useEffect(() => {
    const effectiveUrl = url || window.location.href;
    setShareData({
      title: title || document.title,
      text: text || "",
      url: effectiveUrl,
    });
  }, [title, text, url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);

      // ✅ Use your custom StyledSimpleToast
      StyledSimpleToast({ title: t("linkCopied") });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const socials = [
    {
      name: t("x"),
      icon: FaXTwitter,
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareData.url,
          )}&text=${encodeURIComponent(shareData.title)}`,
          "_blank",
        ),
    },
    {
      name: t("telegram"),
      icon: FaTelegramPlane,
      action: () =>
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(
            shareData.url,
          )}&text=${encodeURIComponent(shareData.title)}`,
          "_blank",
        ),
    },
    {
      name: t("whatsapp"),
      icon: FaWhatsapp,
      action: () =>
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(
            shareData.title + " " + shareData.url,
          )}`,
          "_blank",
        ),
    },
    {
      name: t("linkedin"),
      icon: FaLinkedinIn,
      action: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareData.url,
          )}`,
          "_blank",
        ),
    },
    {
      name: t("facebook"),
      icon: FaFacebookF,
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareData.url,
          )}`,
          "_blank",
        ),
    },
    {
      name: t("email"),
      icon: Mail,
      action: () =>
        (window.location.href = `mailto:?subject=${encodeURIComponent(
          shareData.title,
        )}&body=${encodeURIComponent(shareData.url)}`),
    },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group flex items-center gap-2 rounded-full border border-transparent px-3 py-1 transition-all",
            "hover:border-neutral-200 hover:bg-neutral-50 focus:outline-none",
            "dark:hover:border-white/10 dark:hover:bg-white/5",
            className,
          )}
          aria-label={t("aria.share")}
        >
          <Share2 className="h-4 w-4 text-neutral-500 transition-colors group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white" />
          <span className="hidden text-sm font-medium text-neutral-600 transition-colors group-hover:text-neutral-900 sm:block dark:text-neutral-400 dark:group-hover:text-white">
            {t("share")}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="center"
        sideOffset={10}
        className="w-72 overflow-hidden rounded-3xl border border-neutral-200 bg-white/80 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/80"
      >
        <div className="grid grid-cols-4 gap-4">
          {socials.map((social, i) => (
            <button
              key={i}
              onClick={() => {
                social.action();
                setIsOpen(false);
              }}
              className="group flex flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 transition-colors group-hover:bg-neutral-200 dark:bg-white/5 dark:group-hover:bg-white/10">
                <social.icon className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
              </div>
              <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                {social.name}
              </span>
            </button>
          ))}
        </div>

        {/* Copy Link Section */}
        <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-white/5">
          <Button
            variant="ghost"
            onClick={handleCopy}
            className="flex w-full items-center justify-between rounded-xl bg-neutral-50 px-4 py-6 hover:bg-neutral-100 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div className="flex flex-col items-start gap-0.5 overflow-hidden">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                {copied ? t("copied") : t("copyLink")}
              </span>
              <span className="w-full truncate text-[10px] text-neutral-400">
                {shareData.url}
              </span>
            </div>
            <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white shadow-sm dark:bg-neutral-800">
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <LinkIcon className="h-4 w-4 text-neutral-900 dark:text-white" />
              )}
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
