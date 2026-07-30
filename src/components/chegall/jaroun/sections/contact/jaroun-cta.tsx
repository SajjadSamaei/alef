"use client";
import Image from "next/image";
import { JarounContactCTA } from "@/components/chegall/jaroun/sections/contact/jaroun-contact";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { useTranslations } from "next-intl"; // 1. Import the hook

export default function JarounCTA() {
  const t = useTranslations("Project.Jaroun.CTA"); // 2. Get translations

  return (
    <FadeIn>
      <div className="bg-jarounSuperLight section-padding">
        <div className="section-style subsection-padding text-center">
          <h2 className="text-jarounTitleDark eyebrow-style xl:mb-2">
            {t("eyebrow")} {/* 3. Use translated text */}
          </h2>
          <p className="text-jarounGray7 title-style">
            {t("title")} {/* 3. Use translated text */}
          </p>
        </div>
        <div className="section-style bg-jarounSuperLight flex flex-col items-center justify-center">
          <Image
            width="800"
            height="800"
            alt={t("imageAlt")} // 3. Use translated text
            placeholder="blur"
            src="https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/outro-sm.png"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAAsTAAALEwEAmpwYAAADG0lEQVR4nAEQA+/8ALSflLKflLGfkq+ajrSfkodzZ1tJQVNGP1FEPFJGQU9DQFRIRVdLSUI4NlhNSj0zMgC3opi0n5Wyn5Syn5S2n5aRfnJkVUxfUEpdT0pdUExbTUpfUk5iVlNRR0JgVFFMQj0AuaSbt6KYtJ+VtJ+VuaOam4mAdWZdbF5WbF5XaF1WZVhTa15YbGBaYlZPa15aYlZPAL6qn7+sosSxqLqkm8WzqKqbjop8cpGDeY6Ad5KFfIyAdpKFfJWIfpuPhJqNgpuPhAC6pJu/rKLQvrW+qp/u39SzoZiShXq6rqKnm46/s6a/s6a6rqLVyLvbzsLRxbnRxbkA1cW+2srE59rQ3c/G8uXczL20p5qPqJyRtKeduq6iyLuvyLuv3dLE697T49bK3M7CAPbu6fnw6v307v308P/28uvf1qaWjaickaeajLSnmrSnm8W5rdXIu+TYzOvg0uvg1ADLwLnIvLfIvLfKvbfQxr6/r6eDdGhoW1JpXFJ8bmKCdmiNgHKbj4KjlYm0p5u/tacAloyGl46GlIeClYyEnJKNi311SzovFwoAMSUdQzYrTUEzW00/alxNe25fhXhqlYd6AJySjZySjZuPiZySjKGZkol5c1FANi0jGjcsIjwxJEU4LFVIOWdZS3dpW4V3aJuOfwCcko2cko2Zj4qZj4mbkIqGd3FXRjsiGA8rIRY0Jxw8MSRIPC1ZTD1nWUp3aVuCdmkAnJKMnJKMmY+KlIiElIiDhndwUUA2EwAAHRIFLiMZPDAkUEM2YlRFcmVVgnZrmIyBAJySjZySjZSIhJSHgZ2Sjox9dkIxJAAAAAEAACYeGzcuK0Q7N2NYVHZsZ21jXZCFewCWjIaUh4GZjYackoykmpOGeXFCNC4qISAnIB8jGh0WDhAkHiA/NzoZExULAAIUCw0Am5CKnJKMnJKNnJKMlIiFamJiWVJSWVBQR0BBPzc5UElIVlBOKyQlGRMWEAYLCQABAJySjZySjZmNiIqCfmtkZF1XV1xTU1lRVF5XWFtVVVlSU1FLS0U9PkU9PzgyNjEqK2MGbXoaGiRTAAAAAElFTkSuQmCC"
            className="image-card h-80 object-cover md:hidden"
          />
          <Image
            width="1000"
            height="800"
            placeholder="blur"
            alt={t("imageAlt")} // 3. Use translated text
            src="https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/outro-xl.png"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAECAIAAAA4WjmaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAh0lEQVR4nAF8AIP/AMe6t/Td1OvWy76vp7+zq62fnJSKipGIhYZ9eXdtagC6rqr/9/D/+vHazcD98ODZzsaakI+dlI+CdXFrXVcAdGpn3NHN2MnChHNpqpqKtaqhqp2bpZuWf3JtX1FLAG5kY9fNx8y+u4h+e46EgoB4eJSFgaCKf21XThIDAF5RSUtNraIlAAAAAElFTkSuQmCC"
            className="image-card hidden h-80 object-cover md:block"
          />
          <p className="text-jarounGray6 section-padding paragraph-style mx-auto text-center">
            {t("description")} {/* 3. Use translated text */}
          </p>
        </div>
        <div className="mx-auto max-w-4xl">
          {/* This component must be localized internally */}
          <JarounContactCTA className="subsection-padding" />
        </div>
      </div>
    </FadeIn>
  );
}
