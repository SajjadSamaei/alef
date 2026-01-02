import Link from "next/link";
import clsx from "clsx";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import { useTranslations } from "next-intl";

// Use simple SVG for Instagram to match style if needed, or keep FaInstagram
import { FaInstagram } from "react-icons/fa";

export const socialMediaProfiles = [
  { key: "phone", href: "tel:+989177609917", icon: MdPhone },
  {
    key: "instagram",
    href: "https://www.instagram.com/alef_group",
    icon: FaInstagram,
  }, // Updated to 'alef_group' placeholder
  { key: "whatsapp", href: "https://wa.me/989177609917", icon: FaWhatsapp },
  {
    key: "telegram",
    href: "https://t.me/rasooldabirinasab",
    icon: FaTelegramPlane,
  },
];

export function SocialMedia({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  const t = useTranslations("SocialMedia");

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
