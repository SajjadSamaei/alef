"use client";
import Image from "next/image";
import { FadeInStagger, FadeIn } from "@/components/chegall/studio/FadeIn";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import JarounLouvre from "@/components/chegall/jaroun/ui/jaroun-louvre";
import { useTranslations } from "next-intl"; // 1. Import the hook

// 2. Define a function to get the localized 'people' array
const getPeople = (t: (key: string) => string) => [
  {
    key: "rasoul",
    name: t("team.rasoul.name"),
    role: t("team.rasoul.role"),
    image: "https://storage.c2.liara.space/chegall/team/rasoul-sq.png",
  },
  {
    key: "mreza",
    name: t("team.mreza.name"),
    role: t("team.mreza.role"),
    image: "https://storage.c2.liara.space/chegall/team/mreza-sq.png",
  },
  {
    key: "farshid",
    name: t("team.farshid.name"),
    role: t("team.farshid.role"),
    image: "https://storage.c2.liara.space/chegall/team/farshid-sq.png",
  },
  {
    key: "pooneh",
    name: t("team.pooneh.name"),
    role: t("team.pooneh.role"),
    image: "https://storage.c2.liara.space/chegall/team/pooneh-sq.png",
  },
  {
    key: "amin",
    name: t("team.amin.name"),
    role: t("team.amin.role"),
    image: "https://storage.c2.liara.space/chegall/team/amin-sq.png",
  },
  {
    key: "sajjad",
    name: t("team.sajjad.name"),
    role: t("team.sajjad.role"),
    image: "https://storage.c2.liara.space/chegall/team/sajjad-sq.png",
  },
];

export function PeopleCards() {
  const t = useTranslations("Project.Jaroun.People"); // 3. Get translations
  const people = getPeople(t); // 4. Call the function

  return (
    <Swiper
      effect={"creative"}
      grabCursor={true}
      mousewheel={{
        forceToAxis: true,
        sensitivity: 0.5,
        releaseOnEdges: true,
      }}
      direction={"horizontal"}
      centeredSlides={true}
      breakpoints={{
        0: { slidesPerView: 1.17, spaceBetween: 16 },
        768: { slidesPerView: 3, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 24 },
      }}
      pagination={{
        el: ".custom-pagination-dark-2",
        clickable: true,
      }}
      modules={[Pagination, Mousewheel, FreeMode]}
      className="h-full w-full"
    >
      {people.map((person, index) => (
        <SwiperSlide
          key={person.key} // Use the key
          className={clsx(
            "inset-0 flex max-w-7xl flex-col items-center justify-center",
            index === 0 && "md:-ms-[13rem] lg:-ms-[17rem] xl:-ms-[27rem]",
          )}
        >
          <div
            className={clsx(
              "bg-jarounGray1 section-padding-card grid h-full w-full grid-cols-1 grid-rows-4 flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-cover bg-center shadow-2xs ring-1 inset-shadow-2xs ring-black/5 drop-shadow-xl",
              "relative",
            )}
          >
            <div className="absolute top-4 left-4">
              {/* <JarounLogo className="fill-jarounTitleDark/80 h-8 w-8 lg:h-10 lg:w-10" /> */}
            </div>

            <div className="row-span-3 mx-auto">
              <Image
                width="500"
                height="500"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAwklEQVR4nB3BscqGIBQA0As9XPQkzb1DTg3tTW0NrT1BoEhQKBJEEEQQhpRT4I8k94fvHOCcCyHWdb3ve9s2KSXnHLZtu65LKUUIGcfxeZ7jOEBr7b3PsiyKojRNvffWWnjfN4SQ53mSJIQQRPTeg3MOERljAFCWJSJ+3wfee+eclDKOY8YYIoYQYN93IcSyLMaYvx/nHAzDoJQ6z9MYY63VWiuloOs6Suk8z+sPpbRtW6iqqmmavu+naeKc13VdFMU/HR6lZCTtz+IAAAAASUVORK5CYII="
                alt={person.name} // 5. Use localized alt text
                src={person.image}
                className="inset-shadow-jarounSuperLight shadow-jarounSuperLight mx-auto h-48 w-48 rounded-full shadow-xs inset-shadow-sm lg:h-56 lg:w-56"
              />
            </div>
            <div className="row-span-1 flex flex-col items-center justify-center gap-2">
              <h3 className="text-jarounGray5 text-xl leading-7 font-semibold tracking-tight">
                {person.name}
              </h3>
              <div className="ring-jarounBlack/5 bg-jarounBurgundy flex items-center justify-center rounded-4xl px-3 py-1 shadow-2xs ring-1">
                <p className="text-jarounCard text-center text-xs">
                  {person.role}
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}

      {/* Pagination container */}
      <div className="custom-pagination-dark-2 z-50 mt-6 h-4" />
    </Swiper>
  );
}

export default function JarounPeople() {
  const t = useTranslations("Project.Jaroun.People"); // Get translations

  return (
    <FadeIn>
      <div className="section-style section-padding">
        <h2 className="text-jarounTitleDark eyebrow-style xl:mb-2">
          {t("eyebrow")} {/* 6. Use localized text */}
        </h2>
        <p className="text-jarounGray7 title-style">
          {t("title")} {/* 6. Use localized text */}
        </p>
      </div>
      <PeopleCards />
      <div className="subsection-padding xl:section-padding" />
      <JarounLouvre src="https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/louvre-3.png" />
    </FadeIn>
  );
}
