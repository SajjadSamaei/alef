"use client";
import Image from "next/image";
import {
  JarounDesignInfo,
  JarounLobbyInfo,
  JarounViewInfo,
} from "@/components/chegall/jaroun/sections/features/jaroun-features-wrapper"; // Assuming this is the correct path
import { useTranslations } from "next-intl"; // 1. Import the hook

// --- Image constants remain the same ---
const images = {
  entranceImage:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/jaroun-render-3.png",
  lobbyImage:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/lobby/front-desk-2.png",
  skylineImage:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/levels/skyline.png",
  levels1Image:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/levels/levels-1.png",
  levels2Image:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/levels/levels-2.png",
  roofGardenImage:
    "https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/roof-garden.png",
};
const blurData = {
  entranceImage:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAUCAIAAADkwkEeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEG0lEQVR4nAEQBO/7AM/Ivd7Yy8rDtmNiaZOTmsrDuMjAtsG5scfAtuLayMS+uHt5gmNjbnZ6hqqjn8vAsbuyqADEvbPX0MPIwLQ2MDyBgInNxbzGvrTAuK/Ox7zMw7NwZml+fINvbniAgIm7sqjMw7O2r6YAuLKny8S5zcS5j4uPjY6YyMK6yMC2xLuvzse8zMO0YlZYc3J6aWdxhoaQsaqjuLKnp6KfAKeflrKsoLy1qnZ0e46OlsjCt8vCtsS7scvEud3VxJ+Yl3BueF1dZnZ6hpqVla+qpaehnQCWjojIwre+tqwvJzV7eoPOx7zIwLbCu7LIwrbd1sW+uLN3dn9gYGxwdYGjnZrEua2yqqAAqKGX1c7A0Mi7c25zgoOLycO4ycC2v7aty8W7yb6yYFJWeHR9amlzfH2Gtq2jyb6utK2jAJeOh9TOwMW+snBucH5+hMK7ssrAtMK5rsjCuM7EtnNlZW5td1xbZX+Ai62jn7+2rKqjnwB/eHDLxbaWjoYgGSV6eoPIwLbEvLK9tKzGv7Xe1cWjnJttbHZXWGRscICWk5OrqKOfnJsAeXFtsauhjYaBW1hgfHyFxr61x7+3wbmyubKs1c2/19HHgXyEYV9sZWl4k4+QrKejoJ2cAHt0b4+Ig4uFgXl3fXp6g6efm4+Hh2liZkhAST03P11WXXdyem5teGNodpKOjq2qpqCemwBsZWKnoZm2r6Y3MDpmaXd2doBsZ21DOUElISwrJzZBP013c3p9eX92d4GSjpCppqKbmZcAd3Ft29TIvLWuVlJdgH+LqaqwtbCwin5/UE1ZbGlykI6QnZSUnpSQlJOTnJiXpqSin5ydAJKJhN7XzdvUx7i1sKOipaqssby4tqOammJjcpKNkLeyqrKnn6qemJiUkpSOjYiFhXl0dgByaGuNhIR1bHCEgIOrqKuvr7TEwLu5sKqDeHmbhXeoloi1q6d/cXM6N0IyLTkyKjdUTVsAkImGnpSRYVlif3yBrKuso6SquLWzvbCqmYeDpINsmH5subKtkISGR0VUQD1KY11iyMS2ALSvnu/q0O3q0O7t1JiXn8rLvuHbxpiRlnd2gZmRjMe/q8S5rm1LUj9BVGJmeJ6dnf/+2gCGeniWjY2nopnc0ruel5jUzrni2sK2savX1sLj38q8urOro59oXGJKSVZ0doK7ubT//doAZVdVeGxlSEBDb2Rgf3BoeGdidmNge2lhdWJbbVtYZVNSXU1PYFFSbV9ccmNgf3BrhXhzAD88MiAgEg0GBgAAAR8YIRUJFxMHFhYIFh8THCYZIi0fJCYYHSoaIDgoLDsrMEAwMkw6PAAAAAACAwAAAABFQ0ZPS1IPBRccFiIaFCEXDxwSCxoRCRkVDRobEh0nHSUxIys5KjBFNTnJhSEpFnh5rQAAAABJRU5ErkJggg==",

  lobbyImage:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/APbq2vvw4v7x4//z5P/15v/36P/36P/56//76//57AD67t/78OL+8eL/8+T/8+T/9+j//O3//PD/++z//O0A+eva9+rY7+DO6NjC6djF8d/L9OHP+erV//Hf//DeANzKtdK8o7Kfh72qkMmsiqaPc8W0n8W2ourUt/bkyACbgWCDZ0jGtJ7i0LvOtpvcyrHAr5lWPSZTNR5dQi0AgmQ+VDAQRy4alINv7+LQv6uYZkcsWzEJckENc0ERAFQ0FE0uDzkZACUAAEgpETcUAEAYAFYwDl86FmM8GDwyiPq6MJtfAAAAAElFTkSuQmCC",

  skylineImge:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/AGpjdmxleaacrcbB1sXB2/Xr+tzQ3Ozf6NrY8KKmzQBqY3djXG5qY3Klm6jf1d757vf/+P/27v/d3fb27vkAZl9xUktYNi87OjRCRj5NbWVyn5Whz8bN8ObovLC5AF9XaE1DUpKUrsXK5KyvxoeDlEY+TzMtPDw4RionNABVTlxTTFx+d4ezrrnCu8WVjZlMR1U8OEZLQ1BcUVoASEBNUkxbPTdAKyUvDQAMLiUtPzhEPjhBSkFKRTxFWkdbjmfbh98AAAAASUVORK5CYII=",

  levels1Image:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/AJ+YoZ+Yn5mSma2jqq+qr7Kqr7Onq3dudyMUHicWIACso63Z1+Dh4ez79/v/+//9+fr69PWUjJhFN0ZJOkcAQSszX0tSgHF5npGXurGzwLS44NbWiYCLU0ZTTkFNAHJhaWZVX2hXY4V0fW1fYpuPkt/V1ZyRm2laZkY6RgA7KTU+M0FdUWKtnqOcjI+Id3nEtbWPgo9gUmBKPEgAFAALHA0WHRIaSDlEhHFu07yqo5CPem5+T0FNQjRAM5BZyJ5EFJQAAAAASUVORK5CYII=",

  levels2Image:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/ALm4wNrb4Pr69vT18ff49vb29fPz8vj49cvIzn97ggAdFh5OSFBoYWZuaG18dXh+eHx0bXFpYWgzKzQXCBUAIRkkGREdJB0qNCw6S0JNVU1WNy48KiIuIxomDgMSAE1LWEVAT1FOX2hmcm1mb29ocHZyfVtWY0lFUSknMwBQTl9bWmhcWmpvbnluYmJ2aWaIgopaXGtVU2JPTlwANTRCOjhIQ0JSMS88LSo0OjM+NTRAPzxONDRCMS8/jiNFxAZamOkAAAAASUVORK5CYII=",

  roofGardenImage:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAADCAIAAAAlXwkiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAZklEQVR4nGMoTQmNjfB3dbYJ8XcNCfZNjQvJzYwP9HXRVleIDXJhcLEydLAyjo0MzklPmjWxdUpP/frlU/s7ygUF2EJ9nBj09XTFJBXCQsMjQ0Pjw4K3Lpv6/8ftKV2VLOwMmqqyAIyLH4eMIiScAAAAAElFTkSuQmCC",
};

export default function JarounFeaturesMD() {
  const t = useTranslations("Project.Jaroun.FeaturesMD"); // 2. Get translations

  return (
    <div className="grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-6 lg:grid-rows-2">
      {/* --- Architecture Card --- */}
      <div className="relative lg:col-span-3">
        <div className="max-lg:rounded-t-3xl-t-[2rem] lg:rounded-tl-3xl-[2rem] bg-jarounGray1 absolute inset-px rounded-3xl" />
        <div className="max-lg:rounded-t-3xl-[calc(2rem+1px)] lg:rounded-tl-3xl-[calc(2rem+1px)] relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-3xl)+1px)]">
          <Image
            width={1250}
            height={1437}
            alt={t("architecture.alt")}
            src={images.entranceImage}
            blurDataURL={blurData.entranceImage}
            placeholder="blur"
            className="h-80 object-cover"
          />
          <div className="p-10 pt-4">
            <p className="text-jarounGray7 mt-2 text-lg/7 font-medium tracking-tight">
              {t("architecture.title")}
            </p>
            <p className="text-jarounGray5 mt-2 mb-3 max-w-lg text-sm/6">
              {t("architecture.description")}
            </p>
          </div>
          <div className="absolute bottom-0 left-0">
            <JarounDesignInfo />
          </div>
        </div>
        <div className="max-lg:rounded-t-3xl-[2rem] lg:rounded-tl-3xl-[2rem] pointer-events-none absolute inset-px rounded-3xl shadow-2xs ring-1 ring-black/5" />
      </div>

      {/* --- Lobby Card --- */}
      <div className="relative lg:col-span-3">
        <div className="max-lg:rounded-t-3xl-t-[2rem] lg:rounded-tl-3xl-[2rem] bg-jarounGray1 absolute inset-px rounded-3xl" />
        <div className="max-lg:rounded-t-3xl-[calc(2rem+1px)] lg:rounded-tl-3xl-[calc(2rem+1px)] relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-3xl)+1px)]">
          <Image
            width={1157}
            height={768}
            alt={t("lobby.alt")}
            src={images.lobbyImage}
            blurDataURL={blurData.lobbyImage}
            placeholder="blur"
            className="h-80 object-cover"
          />
          <div className="p-10 pt-4">
            <p className="text-jarounGray7 mt-2 text-lg/7 font-medium tracking-tight">
              {t("lobby.title")}
            </p>
            <p className="text-jarounGray5 mt-2 mb-3 max-w-lg text-sm/6">
              {t("lobby.description")}
            </p>
          </div>
          <div className="absolute bottom-0 left-0">
            <JarounLobbyInfo />
          </div>
        </div>
        <div className="max-lg:rounded-t-3xl-[2rem] lg:rounded-tl-3xl-[2rem] pointer-events-none absolute inset-px rounded-3xl shadow-2xs ring-1 ring-black/5" />
      </div>

      {/* --- Skylight Card --- */}
      <div className="relative lg:col-span-2">
        <div className="max-lg:rounded-t-3xl-t-[2rem] lg:rounded-tl-3xl-[2rem] bg-jarounGray1 absolute inset-px rounded-3xl" />
        <div className="max-lg:rounded-t-3xl-[calc(2rem+1px)] lg:rounded-tl-3xl-[calc(2rem+1px)] relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-3xl)+1px)]">
          <Image
            width={1862}
            height={1063}
            alt={t("skylight.alt")}
            src={images.skylineImage}
            blurDataURL={blurData.skylineImge}
            placeholder="blur"
            className="h-80 object-cover"
          />
          <div className="p-10 pt-4">
            <p className="text-jarounGray7 mt-2 text-lg/7 font-medium tracking-tight">
              {t("skylight.title")}
            </p>
            <p className="text-jarounGray5 mt-2 mb-3 max-w-lg text-sm/6">
              {t("skylight.description")}
            </p>
          </div>
        </div>
        <div className="max-lg:rounded-t-3xl-[2rem] lg:rounded-tl-3xl-[2rem] pointer-events-none absolute inset-px rounded-3xl shadow-2xs ring-1 ring-black/5" />
      </div>

      {/* --- Community Card --- */}
      <div className="relative lg:col-span-2">
        <div className="max-lg:rounded-t-3xl-t-[2rem] lg:rounded-tl-3xl-[2rem] bg-jarounGray1 absolute inset-px rounded-3xl" />
        <div className="max-lg:rounded-t-3xl-[calc(2rem+1px)] lg:rounded-tl-3xl-[calc(2rem+1px)] relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-3xl)+1px)]">
          <Image
            width={1236}
            height={768}
            alt={t("community.alt")}
            src={images.levels1Image}
            blurDataURL={blurData.levels1Image}
            placeholder="blur"
            className="h-80 object-cover"
          />
          <div className="p-10 pt-4">
            <p className="text-jarounGray7 mt-2 text-lg/7 font-medium tracking-tight">
              {t("community.title")}
            </p>
            <p className="text-jarounGray5 mt-2 mb-3 max-w-lg text-sm/6">
              {t("community.description")}
            </p>
          </div>
        </div>
        <div className="max-lg:rounded-t-3xl-[2rem] lg:rounded-tl-3xl-[2rem] pointer-events-none absolute inset-px rounded-3xl shadow-2xs ring-1 ring-black/5" />
      </div>

      {/* --- Units Card --- */}
      <div className="relative lg:col-span-2">
        <div className="max-lg:rounded-t-3xl-t-[2rem] lg:rounded-tl-3xl-[2rem] bg-jarounGray1 absolute inset-px rounded-3xl" />
        <div className="max-lg:rounded-t-3xl-[calc(2rem+1px)] lg:rounded-tl-3xl-[calc(2rem+1px)] relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-3xl)+1px)]">
          <Image
            width={1236}
            height={768}
            alt={t("units.alt")}
            src={images.levels2Image}
            blurDataURL={blurData.levels2Image}
            placeholder="blur"
            className="h-80 object-cover"
          />
          <div className="p-10 pt-4">
            <p className="text-jarounGray7 mt-2 text-lg/7 font-medium tracking-tight">
              {t("units.title")}
            </p>
            <p className="text-jarounGray5 mt-2 mb-3 max-w-lg text-sm/6">
              {t("units.description")}
            </p>
          </div>
          <div className="absolute bottom-0 left-0">
            <JarounViewInfo />
          </div>
        </div>
        <div className="max-lg:rounded-t-3xl-[2rem] lg:rounded-tl-3xl-[2rem] pointer-events-none absolute inset-px rounded-3xl shadow-2xs ring-1 ring-black/5" />
      </div>

      {/* --- Rooftop Card --- */}
      <div className="relative lg:col-span-6">
        <div className="max-lg:rounded-t-3xl-t-[2rem] lg:rounded-tl-3xl-[2rem] bg-jarounGray1 absolute inset-px rounded-3xl" />
        <div className="max-lg:rounded-t-3xl-[calc(2rem+1px)] lg:rounded-tl-3xl-[calc(2rem+1px)] relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-3xl)+1px)]">
          <Image
            width={2500}
            height={666}
            alt={t("rooftop.alt")}
            src={images.roofGardenImage}
            blurDataURL={blurData.roofGardenImage}
            placeholder="blur"
            className="h-80 object-cover"
          />
          <div className="p-10 pt-4">
            <p className="text-jarounGray7 mt-2 text-lg/7 font-medium tracking-tight">
              {t("rooftop.title")}
            </p>
            <p className="text-jarounGray5 mt-2 mb-3 max-w-lg text-sm/6">
              {t("rooftop.description")}
            </p>
          </div>
        </div>
        <div className="max-lg:rounded-t-3xl-[2rem] lg:rounded-tl-3xl-[2rem] pointer-events-none absolute inset-px rounded-3xl shadow-2xs ring-1 ring-black/5" />
      </div>
    </div>
  );
}
