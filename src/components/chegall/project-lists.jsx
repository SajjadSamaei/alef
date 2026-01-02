import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/chegall/studio/Container";
import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import { SectionIntro } from "@/components/chegall/studio/SectionIntro";

export function Projects() {
  const works = [
    {
      name: "کا",
      logo: "/projects/ka/logo/logomark-dark.svg",
      image: "/building/hero-2.jpg",
      service: "نوع پروژه",
      date: "تاریخ پروژه",
      href: "/work/ka",
      title: "مجموعه فلان واحدی",
      summary: [
        "FamilyFund is a crowdfunding platform for friends and family.",
      ],
    },
    {
      name: "جرون",
      logo: "/projects/jaroun/logo/logomark-dark.svg",
      image: "/building/hero-1.jpg",
      service: "نوع پروژه",
      date: "تاریخ پروژه",
      href: "/work/jaroun",
      title: "مجموعه فلان",
      summary: [
        "FamilyFund is a crowdfunding platform for friends and family.",
      ],
    },
  ];
  return (
    <>
      <SectionIntro
        title="Harnessing technology for a brighter future"
        className="mt-24 sm:mt-32 lg:mt-40"
      >
        <p>
          We believe technology is the answer to the world’s greatest
          challenges. It’s also the cause, so we find ourselves in bit of a
          catch 22 situation.
        </p>
      </SectionIntro>
      <Container className="mt-16">
        <FadeInStagger className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {works.map((works) => (
            <FadeIn key={works.href} className="flex">
              <article className="relative flex w-full flex-col rounded-3xl ring-1 ring-neutral-950/5 transition hover:bg-neutral-50">
                {/* Top Section: Photo with Logo */}
                <div className="relative basis-2/3">
                  {/* Photo */}
                  <Image
                    width={200}
                    height={200}
                    alt=""
                    src={works.image}
                    className="h-full w-full rounded-t-3xl object-cover"
                  />

                  {/* Logo */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <Link href={works.href} className="flex">
                      <Image
                        src={works.logo}
                        alt={works.name}
                        width={64}
                        height={64}
                        className="h-16 w-16"
                        unoptimized
                      />
                    </Link>
                  </div>
                </div>

                {/* Bottom Section: Title, Dates, and Summary */}
                <div className="basis-1/3 p-6">
                  <p className="flex gap-x-2 text-sm text-neutral-950">
                    <time className="font-semibold">{works.date}</time>
                    <span className="text-neutral-300" aria-hidden="true">
                      /
                    </span>
                    <span>Case study</span>
                  </p>
                  <h3 className="font-display mt-4 text-2xl font-semibold text-neutral-950">
                    {works.title}
                  </h3>
                  <p className="mt-4 text-base text-neutral-600">
                    {works.summary}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </>
  );
}
