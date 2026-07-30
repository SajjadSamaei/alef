import { AuthorImage } from "@/components/Blog/Media/BlogMedia/AuthorImage";
import { AuthorSocials } from "@/components/Blog/UI/Authors/Socials";
import type { Post } from "@/src/payload-types";
import clsx from "clsx";
import { Link } from "@/src/i18n/routing";

type PopulatedAuthorType = NonNullable<Post["populatedAuthors"]>[number];

type AuthorProps = {
  author: PopulatedAuthorType;
  locale: string; // Pass locale as a prop to avoid async/await issues
  className?: string;
};

export function Author({ author, locale, className }: AuthorProps) {
  const {
    name,
    role,
    bio,
    twitter,
    linkedin,
    instagram,
    website,
    image,
    associatedTeamMember,
  } = author;

  // --- Localize ---
  // (Safe navigation ?. is good, assuming your TS types allow string indexing)
  const localizedName = typeof name === "object" ? name?.[locale as any] : name;
  const localizedRole = typeof role === "object" ? role?.[locale as any] : role;
  const localizedBio = typeof bio === "object" ? bio?.[locale as any] : bio;

  if (!localizedName) return null;

  const teamSlug =
    typeof associatedTeamMember === "object" && associatedTeamMember?.slug
      ? associatedTeamMember.slug
      : null;

  const authorHref = teamSlug
    ? `/team/${teamSlug}`
    : `/blog/archive?q=${encodeURIComponent(localizedName)}`;

  const hasSocials = twitter || linkedin || website || instagram;

  return (
    <li className={clsx("flex flex-row items-start gap-4", className)}>
      {/* 1. Image Container: Fixed size & rounded */}
      <div className="relative h-14 w-14 flex-none overflow-hidden rounded-md bg-neutral-100 ring-1 ring-neutral-200/50 sm:h-16 sm:w-16">
        {image && (
          <AuthorImage
            resource={image}
            className="h-full w-full object-cover grayscale transition-all duration-300 hover:grayscale-0"
          />
        )}
      </div>

      {/* 2. Content Container: Flex Column for perfect spacing */}
      <div className="flex flex-col justify-center">
        <Link
          href={authorHref}
          className="font-display text-lg leading-tight font-bold text-neutral-950 hover:underline dark:text-neutral-100"
        >
          {localizedName}
        </Link>

        {localizedRole && (
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {localizedRole}
          </span>
        )}

        {localizedBio && (
          <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-500">
            {localizedBio}
          </p>
        )}

        {hasSocials && (
          <div className="mt-3">
            <AuthorSocials
              instagram={instagram}
              twitter={twitter}
              website={website}
              linkedIn={linkedin}
            />
          </div>
        )}
      </div>
    </li>
  );
}
