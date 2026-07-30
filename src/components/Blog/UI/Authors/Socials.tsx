import { Link } from "@/src/i18n/routing";
import clsx from "clsx";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaGlobe,
  FaInstagram,
} from "react-icons/fa6";

type AuthorsSocialsProps = {
  className?: string;
  linkedIn?: string | null;
  twitter?: string | null;
  website?: string | null;
  instagram?: string | null;
};

export function AuthorSocials({
  className,
  website,
  linkedIn,
  twitter,
  instagram,
}: AuthorsSocialsProps) {
  // Common icon style matching your search bar icons
  const iconClass = clsx(
    "flex h-8 w-8 items-center justify-center rounded-full transition-all",
    "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900",
    "dark:bg-white/10 dark:text-neutral-400 dark:hover:bg-white/20 dark:hover:text-white",
  );

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      {twitter && (
        <Link
          href={twitter}
          target="_blank"
          className={iconClass}
          aria-label="Twitter"
        >
          <FaXTwitter className="h-3.5 w-3.5" />
        </Link>
      )}
      {instagram && (
        <Link
          href={instagram}
          target="_blank"
          className={iconClass}
          aria-label="Instagram"
        >
          <FaInstagram className="h-3.5 w-3.5" />
        </Link>
      )}
      {linkedIn && (
        <Link
          href={linkedIn}
          target="_blank"
          className={iconClass}
          aria-label="LinkedIn"
        >
          <FaLinkedinIn className="h-3.5 w-3.5" />
        </Link>
      )}
      {website && (
        <Link
          href={website}
          target="_blank"
          className={iconClass}
          aria-label="Website"
        >
          <FaGlobe className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
