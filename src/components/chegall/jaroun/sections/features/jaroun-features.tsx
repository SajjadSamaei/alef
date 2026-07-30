"use client";
import Image from "next/image";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import JarounLouvre from "@/components/chegall/jaroun/ui/jaroun-louvre";
import JarounFeaturesMD from "@/components/chegall/jaroun/sections/features/jaroun-features-md";
import {
  JarounDesignInfo,
  JarounLobbyInfo,
  JarounViewInfo,
} from "@/components/chegall/jaroun/sections/features/jaroun-features-wrapper";
import { FeatureCards } from "@/components/chegall/jaroun/ui/jaroun-card-stack";
import { useTranslations } from "next-intl"; // 1. Import the hook

// --- Image constants remain the same ---
const images = {
  entranceImage:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/jaroun-render-3.png",
  lobbyImage:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/lobby/front-desk-2.png",
  exteriorImage:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/jaroun-render-2-sm.png",
};

const blurData = {
  entranceImage:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAUCAIAAADkwkEeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEG0lEQVR4nAEQBO/7AM/Ivd7Yy8rDtmNiaZOTmsrDuMjAtsG5scfAtuLayMS+uHt5gmNjbnZ6hqqjn8vAsbuyqADEvbPX0MPIwLQ2MDyBgInNxbzGvrTAuK/Ox7zMw7NwZml+fINvbniAgIm7sqjMw7O2r6YAuLKny8S5zcS5j4uPjY6YyMK6yMC2xLuvzse8zMO0YlZYc3J6aWdxhoaQsaqjuLKnp6KfAKeflrKsoLy1qnZ0e46OlsjCt8vCtsS7scvEud3VxJ+Yl3BueF1dZnZ6hpqVla+qpaehnQCWjojIwre+tqwvJzV7eoPOx7zIwLbCu7LIwrbd1sW+uLN3dn9gYGxwdYGjnZrEua2yqqAAqKGX1c7A0Mi7c25zgoOLycO4ycC2v7aty8W7yb6yYFJWeHR9amlzfH2Gtq2jyb6utK2jAJeOh9TOwMW+snBucH5+hMK7ssrAtMK5rsjCuM7EtnNlZW5td1xbZX+Ai62jn7+2rKqjnwB/eHDLxbaWjoYgGSV6eoPIwLbEvLK9tKzGv7Xe1cWjnJttbHZXWGRscICWk5OrqKOfnJsAeXFtsauhjYaBW1hgfHyFxr61x7+3wbmyubKs1c2/19HHgXyEYV9sZWl4k4+QrKejoJ2cAHt0b4+Ig4uFgXl3fXp6g6efm4+Hh2liZkhAST03P11WXXdyem5teGNodpKOjq2qpqCemwBsZWKnoZm2r6Y3MDpmaXd2doBsZ21DOUElISwrJzZBP013c3p9eX92d4GSjpCppqKbmZcAd3Ft29TIvLWuVlJdgH+LqaqwtbCwin5/UE1ZbGlykI6QnZSUnpSQlJOTnJiXpqSin5ydAJKJhN7XzdvUx7i1sKOipaqssby4tqOammJjcpKNkLeyqrKnn6qemJiUkpSOjYiFhXl0dgByaGuNhIR1bHCEgIOrqKuvr7TEwLu5sKqDeHmbhXeoloi1q6d/cXM6N0IyLTkyKjdUTVsAkImGnpSRYVlif3yBrKuso6SquLWzvbCqmYeDpINsmH5subKtkISGR0VUQD1KY11iyMS2ALSvnu/q0O3q0O7t1JiXn8rLvuHbxpiRlnd2gZmRjMe/q8S5rm1LUj9BVGJmeJ6dnf/+2gCGeniWjY2nopnc0ruel5jUzrni2sK2savX1sLj38q8urOro59oXGJKSVZ0doK7ubT//doAZVdVeGxlSEBDb2Rgf3BoeGdidmNge2lhdWJbbVtYZVNSXU1PYFFSbV9ccmNgf3BrhXhzAD88MiAgEg0GBgAAAR8YIRUJFxMHFhYIFh8THCYZIi0fJCYYHSoaIDgoLDsrMEAwMkw6PAAAAAACAwAAAABFQ0ZPS1IPBRccFiIaFCEXDxwSCxoRCRkVDRobEh0nHSUxIys5KjBFNTnJhSEpFnh5rQAAAABJRU5ErkJggg==",
  lobbyImage:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/APbq2vvw4v7x4//z5P/15v/36P/36P/56//76//57AD67t/78OL+8eL/8+T/8+T/9+j//O3//PD/++z//O0A+eva9+rY7+DO6NjC6djF8d/L9OHP+erV//Hf//DeANzKtdK8o7Kfh72qkMmsiqaPc8W0n8W2ourUt/bkyACbgWCDZ0jGtJ7i0LvOtpvcyrHAr5lWPSZTNR5dQi0AgmQ+VDAQRy4alINv7+LQv6uYZkcsWzEJckENc0ERAFQ0FE0uDzkZACUAAEgpETcUAEAYAFYwDl86FmM8GDwyiPq6MJtfAAAAAElFTkSuQmCC",
  exteriorImage:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAKCAIAAAAGpYjXAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nAH6AAX/AKmln762rszCudvPxO/e0O3bzfzo2P/56gCNhXyUi4Gjl4y1qp3AtKi+r6PIuarVxbYAjoV5hYB2bWxnbW5pdHRvendwhYF6g393AGxpZHhyaZCJfoiGgJWOhJqTiJeSiHdxZgCGfnWQiIaYlI7Gua+1qpyspZnZzryWj4MAdXN1h4SFdXN1lIuGva+h9+PK/+/VgHpvAFxcY5WQipGHg4uDf8W4qP/r0P/v1Y6FdwBUU1WOioeDf36VioLJuan/8tbt3ciUh34AHyIleHFsgnp6h4B8yr+u49TDeW5nbFdGAAADAyQfG0dCQXFpZZeNhENDQ05BOXlpVebziL/57r38AAAAAElFTkSuQmCC",
};

export default function JarounFeatures() {
  const t = useTranslations("Project.Jaroun.Features"); // 2. Get translations

  return (
    <>
      <FadeIn className="bg-jarounSuperLight section-padding xl:section-padding-xl hidden md:block">
        <div className="section-style">
          <h2 className="text-jarounTitleDark eyebrow-style xl:mb-2">
            {t("eyebrow")}
          </h2>
          <p className="text-jarounGray7 title-style">{t("title")}</p>
          <JarounFeaturesMD />
          <div className="section-padding-end" />
        </div>
      </FadeIn>

      {/* --- Mobile Section 1: Lobby --- */}
      <FadeIn className="bg-jarounSuperLight md:hidden">
        <div className="relative pt-32">
          <Image
            width="500"
            height="500"
            alt={t("lobby.alt")}
            src={images.lobbyImage}
            placeholder="blur"
            blurDataURL={blurData.lobbyImage}
            className="h-80 w-full object-cover"
            style={{
              WebkitMaskImage:
                "linear-gradient(to top, black 70%, transparent 100%)",
              maskImage: "linear-gradient(to top, black 70%, transparent 100%)",
            }}
          />
          <div className="absolute top-1/4 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-jarounTitleDark eyebrow-style text-center">
              {t("lobby.eyebrow")}
            </h2>
            <p className="text-jarounGray7 title-style text-center">
              {t("lobby.title")}
            </p>
          </div>
        </div>
        <div className="section-style">
          <p className="text-jarounGray6 section-padding paragraph-style text-center">
            {t("lobby.description")}
          </p>
          <JarounLobbyInfo />
        </div>
        <div className="section-padding" />
      </FadeIn>

      {/* --- Mobile Section 2: Architecture --- */}
      <JarounLouvre src="https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/louvre-1.png" />
      <div className="md:hidden">
        <FadeIn>
          <div className="section-padding section-style">
            <h2 className="text-jarounTitleDark eyebrow-style">
              {t("architecture.eyebrow")}
            </h2>
            <p className="text-jarounGray7 title-style">
              {t("architecture.title")}
            </p>
          </div>
          <div className="section-style flex flex-col items-center justify-center">
            <Image
              placeholder="blur"
              width="500"
              height="500"
              alt={t("architecture.alt")}
              src={images.entranceImage}
              blurDataURL={blurData.entranceImage}
              className="image-card h-80 object-cover"
            />
            <p className="text-jarounGray6 section-padding paragraph-style text-center">
              {t("architecture.description")}
            </p>
            <JarounDesignInfo />
          </div>
          <div className="section-padding" />
        </FadeIn>
        <FadeIn className="md:subsection-padding">
          <h3 className="text-jarounGray7 subtitle-style subsection-padding section-style">
            {t("architecture.featuresTitle")}
          </h3>
          <FeatureCards />
          <div className="subsection-padding" />
        </FadeIn>
        <JarounLouvre src="https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/louvre-2.png" />
        <div className="section-padding" />
      </div>

      {/* --- Mobile Section 3: Rooftop --- */}
      <FadeIn className="md:hidden">
        <div className="relative">
          <Image
            placeholder="blur"
            width={1080}
            height={1350}
            alt={t("rooftop.alt")}
            src={images.exteriorImage}
            blurDataURL={blurData.exteriorImage}
            className="object-cover"
            style={{
              maskImage: "linear-gradient(to top, black 85%, transparent 100%)",
            }}
          />
          <div className="absolute top-1/5 left-1/2 -translate-x-1/2 -translate-y-1/5 transform">
            <h2 className="eyebrow-style shadow-jarounBlack text-center text-white shadow-2xl">
              {t("rooftop.eyebrow")}
            </h2>
            <p className="text-jarounSuperLight title-style shadow-jarounDark text-center text-nowrap shadow-2xl">
              {t("rooftop.title")}
            </p>
          </div>
        </div>
        <div className="section-style">
          <p className="text-jarounGray6 section-padding paragraph-style text-center">
            {t("rooftop.description")}
          </p>
          <JarounViewInfo />
        </div>
        <div className="section-padding-end" />
      </FadeIn>
    </>
  );
}
