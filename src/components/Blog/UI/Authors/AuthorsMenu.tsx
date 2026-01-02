"use client";

import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { formatAuthors } from "@/payload/utilities/formatAuthors";
import { AuthorSocials } from "@/components/Blog/UI/Authors/Socials"; // Ensure correct path
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/routing";
import type { Post } from "@/src/payload-types"; // Import Post type

// Derive the exact type from Payload
type PopulatedAuthor = NonNullable<Post["populatedAuthors"]>[number];

export function AuthorsMenu({ authors }: { authors: PopulatedAuthor[] }) {
  const locale = useLocale();

  if (!authors || authors.length === 0) return null;

  return (
    <Popover>
      {/* 1. Trigger */}
      <PopoverTrigger asChild>
        <button className="group flex items-center gap-3 rounded-full border border-transparent px-2 py-1 transition-all hover:border-neutral-200 hover:bg-neutral-50 focus:outline-none dark:hover:border-white/10 dark:hover:bg-white/5">
          <div className="flex -space-x-3">
            {authors.map((author, i) => {
              // Safe check for image object
              const imageUrl =
                author.image && typeof author.image === "object"
                  ? author.image.url
                  : undefined;

              return (
                <Avatar
                  key={i}
                  className="h-9 w-9 border-1 border-white ring-1 ring-neutral-200 transition-transform group-hover:translate-x-1 dark:border-neutral-950 dark:ring-neutral-800"
                >
                  {imageUrl && <AvatarImage src={imageUrl} />}
                  <AvatarFallback className="bg-neutral-200 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {author.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              );
            })}
          </div>

          <div className="text-sm font-medium text-neutral-900 decoration-neutral-400 underline-offset-4 group-hover:underline dark:text-white">
            {/* Now types match perfectly */}
            {formatAuthors(authors, locale)}
          </div>
        </button>
      </PopoverTrigger>

      {/* 2. Content */}
      <PopoverContent
        align="start"
        className="w-80 overflow-hidden rounded-3xl border border-neutral-200 bg-white/80 p-0 shadow-2xl backdrop-blur-xl sm:w-96 dark:border-white/10 dark:bg-neutral-900/80"
      >
        <div className="flex flex-col divide-y divide-neutral-100 dark:divide-white/5">
          {authors.map((author, index) => {
            const hasSocials =
              author.twitter ||
              author.linkedin ||
              author.website ||
              author.instagram;

            const teamSlug =
              author.associatedTeamMember &&
              typeof author.associatedTeamMember === "object"
                ? author.associatedTeamMember.slug
                : null;

            const authorHref = teamSlug
              ? `/team/${teamSlug}`
              : `/blog/archive?q=${encodeURIComponent(author.name || "")}`;

            const imageUrl =
              author.image && typeof author.image === "object"
                ? author.image.url
                : undefined;

            return (
              <div key={index} className="flex flex-col gap-4 p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 rounded-2xl border border-neutral-200 dark:border-white/10">
                    {imageUrl && <AvatarImage src={imageUrl} />}
                    <AvatarFallback className="rounded-2xl">
                      {author.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <Link
                      href={authorHref}
                      className="font-display text-lg font-bold text-neutral-950 hover:underline dark:text-white"
                    >
                      {author.name}
                    </Link>
                    {author.role && (
                      <span className="text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                        {author.role}
                      </span>
                    )}
                  </div>
                </div>

                {author.bio && (
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {author.bio}
                  </p>
                )}

                {hasSocials && (
                  <div className="pt-2">
                    <AuthorSocials
                      instagram={author.instagram}
                      twitter={author.twitter}
                      website={author.website}
                      linkedIn={author.linkedin}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
