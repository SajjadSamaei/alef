import Link from "next/link";
import clsx from "clsx";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import { useTranslations } from "next-intl";

// Use simple SVG for Instagram to match style if needed, or keep FaInstagram
import { FaInstagram } from "react-icons/fa";
import type { PublicSiteSettings } from "@/src/types/site-settings";

export function SocialMedia({
  className,
  invert = false,
  settings,
}: {
  className?: string;
  invert?: boolean;
  settings: PublicSiteSettings;
}) {
  const t = useTranslations("SocialMedia");
  const socialMediaProfiles = [
    settings.contact?.phone && { key: "phone", href: `tel:${settings.contact.phone}`, icon: MdPhone },
    settings.social?.instagram && { key: "instagram", href: settings.social.instagram, icon: FaInstagram },
    settings.social?.whatsapp && { key: "whatsapp", href: settings.social.whatsapp, icon: FaWhatsapp },
    settings.social?.telegram && { key: "telegram", href: settings.social.telegram, icon: FaTelegramPlane },
  ].filter(Boolean) as Array<{ key: string; href: string; icon: typeof MdPhone }>;

  return (
    <ul
      role="list"
      className={clsx(
        "flex gap-x-8",
        invert ? "text-white" : "text-neutral-950 dark:text-white",
        className,
      )}
    >
      {socialMediaProfiles.map((profile) => (
        <li key={profile.key}>
          <Link
            href={profile.href}
            aria-label={t(profile.key)}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              "transition-colors hover:scale-110",
              invert
                ? "hover:text-neutral-200"
                : "text-neutral-400 hover:text-neutral-950 dark:text-neutral-500 dark:hover:text-white",
            )}
          >
            <profile.icon className="h-6 w-6 fill-current" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
