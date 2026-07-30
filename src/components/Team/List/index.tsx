import { ImageMedia } from "@/components/Blog/Media/ImageMedia";
import { Border } from "@/components/ui/Border";
import { FadeIn, FadeInStagger } from "@/components/ui/FadeIn";
import { Link } from "@/src/i18n/routing";
import type { Team as TeamMember, TeamMedia } from "@/src/payload-types";
import clsx from "clsx";

type TeamGroup = {
  title: string;
  people: TeamMember[];
};

export function Team({ data }: { data: TeamGroup[] }) {
  if (!data || data.length === 0) return null;

  return (
    <FadeIn className="space-y-24">
      {data.map(
        (group) =>
          group.people.length > 0 && (
            <FadeInStagger key={group.title}>
              <Border as={FadeIn} />
              <div className="grid grid-cols-1 gap-6 pt-12 sm:pt-16 lg:grid-cols-4 xl:gap-8">
                {/* Section Title */}
                <FadeIn>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                    {group.title}
                  </h2>
                </FadeIn>

                {/* Grid */}
                <div className="lg:col-span-3">
                  <ul
                    role="list"
                    // UPDATED GRID LOGIC:
                    // grid-cols-2: Default (Mobile) - Shows 2 per row (smaller images)
                    // sm:grid-cols-3: Tablet - Shows 3 per row
                    // xl:grid-cols-4: Desktop - Shows 4 per row
                    className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 xl:grid-cols-4"
                  >
                    {group.people.map((person) => {
                      const profileImage =
                        typeof person.profilePicture === "object"
                          ? (person.profilePicture as TeamMedia)
                          : null;

                      return (
                        <li key={person.slug || person.id}>
                          <FadeIn>
                            <Link
                              href={`/team/${person.slug}`}
                              className="group block"
                            >
                              {/* Image Container */}
                              <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 shadow-sm transition-all duration-500 dark:bg-white/5">
                                {profileImage && (
                                  <ImageMedia
                                    mobileImageSize="square"
                                    resource={profileImage}
                                    fill
                                    className={clsx(
                                      "h-full w-full object-cover transition-all duration-500",
                                      "grayscale filter group-hover:scale-105 group-hover:grayscale-0",
                                    )}
                                  />
                                )}
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 ring-inset dark:ring-white/10" />
                              </div>

                              {/* Text Content */}
                              <div className="mt-3 sm:mt-4">
                                <h3 className="font-display text-lg font-semibold tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600 dark:text-white dark:group-hover:text-neutral-300">
                                  {person.name}
                                  {person.credentials && (
                                    <span className="ml-1.5 text-sm font-normal text-neutral-500 uppercase dark:text-neutral-400">
                                      {person.credentials}
                                    </span>
                                  )}
                                </h3>
                                <p className="mt-0.5 text-[10px] tracking-wide text-neutral-500 uppercase sm:mt-1 sm:text-xs dark:text-neutral-400">
                                  {person.role}
                                </p>
                              </div>
                            </Link>
                          </FadeIn>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </FadeInStagger>
          ),
      )}
    </FadeIn>
  );
}
