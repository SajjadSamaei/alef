import { WordRotate } from "@/components/ui/magicui/word-rotate";
import { Container } from "@/components/chegall/studio/Container";
import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import Image from "next/image";
import { useTranslations } from "next-intl"; // 1. Import the hook
import clsx from "clsx";

// 2. Remove hardcoded Farsi 'name' from the data array.
// The slug will now be used as the translation key.
const clients = [
  {
    slug: "shouder",
    logo: "/logos/companies/shouder.svg",
    url: "https://shouder.com",
  },
  {
    slug: "rak-ceramics",
    logo: "/logos/companies/rak.png",
    url: "http://luxarch.ir/",
  },
  {
    slug: "fakhar-tile",
    logo: "/logos/companies/fakhar.png",
    url: "http://fakhar-group.com/",
  },
  {
    slug: "leca",
    logo: "/logos/companies/leca.png",
    url: "https://leca.ir/",
  },
];

export function Mantras() {
  const t = useTranslations("Partners.Mantras"); // 3. Get translations

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <p className="text-center text-xl font-bold text-nowrap text-white">
        {t("title")} {/* 4. Use translated title */}
      </p>
      <WordRotate
        className="max-w-lg text-center text-2xl font-bold text-nowrap text-white sm:text-3xl"
        words={t.raw("texts")} // 5. Use t.raw() to get the array
        duration="7000"
      />
    </div>
  );
}

export function Partners() {
  const t = useTranslations("Partners"); // 6. Get translations

  return (
    <div className="mt-20 bg-neutral-950 py-44 sm:mb-20 sm:py-20 md:rounded-[40px]">
      <Container>
        {/* <Mantras /> */}
        <FadeIn className="flex items-center gap-x-8">
          <h2 className="font-display text-center text-sm font-semibold tracking-wider text-white sm:text-left">
            {t("title")} {/* 7. Use translated title */}
          </h2>
          <div className="h-px flex-auto bg-neutral-800" />
        </FadeIn>
        <FadeInStagger faster>
          <ul
            role="list"
            className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4"
          >
            {clients.map((client) => (
              <li
                className="flex items-center justify-center"
                key={client.slug}
              >
                <FadeIn>
                  {/* 8. Wrap in <a> tag to make logo clickable */}
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      width={200}
                      height={200}
                      src={client.logo}
                      alt={t(`clients.${client.slug}`)} // 9. Use slug to get localized alt text
                      className="h-20 w-20 object-contain xl:h-15"
                      unoptimized
                    />
                  </a>
                </FadeIn>
              </li>
            ))}
          </ul>
        </FadeInStagger>
      </Container>
    </div>
  );
}
