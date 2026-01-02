"use client";
import clsx from "clsx";
import Image from "next/image";
import { useState, ReactNode } from "react"; // Added ReactNode
import { motion } from "framer-motion";
import { SectionIntroForDrawer } from "@/components/chegall/SectionIntroForDrawer";
import { DrawerWrapper } from "@/components/chegall/DrawerWrapper";
import { PlusIcon, CheckIcon } from "@heroicons/react/24/solid";
import { MoreInfoButton } from "@/components/ui/more-info-button";
import { ImageCoverFlow } from "@/components/chegall/jaroun/ui/jaroun-card-stack";
import {
  getDesignFeatures,
  getLobbyFeatures,
  getPlansImages,
  getLobbyImages,
  getViewImages,
} from "@/components/chegall/jaroun/jaroun-data"; // 1. Import the new functions
import { useTranslations } from "next-intl"; // 2. Import the hook

// 3. Add types and fix 'ariaLabel' typo
interface ShowFeatureButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  ariaLabel?: string;
}

function ShowFeatureButton({
  onClick,
  children,
  className = "",
  ariaLabel = "",
  ...props
}: ShowFeatureButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center"
    >
      <button
        aria-label={ariaLabel} // Fixed typo
        onClick={onClick}
        className={clsx(
          className,
          "inline-flex rounded-full px-2 py-2 text-sm font-semibold text-white transition",
        )}
        {...props}
      >
        <span className="relative top-px">{children}</span>
      </button>
    </motion.div>
  );
}

export function JarounDesignInfo() {
  const [isDesignOpen, setIsDesignDialogOpen] = useState(false);
  const t = useTranslations("Project.Jaroun.DesignDrawer"); // 4. Get translations
  const tData = useTranslations("Project.Jaroun.Data"); // 4. Get translations
  const tLeanMore = useTranslations("CommonButtons");
  // 5. Call functions to get localized data
  const designFeatures = getDesignFeatures(tData);
  const plansImages = getPlansImages(tData);

  return (
    <>
      <DrawerWrapper
        isOpen={isDesignOpen}
        onClose={() => setIsDesignDialogOpen(false)}
        className="overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <SectionIntroForDrawer
          eyebrow={t("eyebrow")}
          eyebrowColor="text-jarounLight"
          title={t("title")}
          className="mb-16"
        >
          <p className="paragraph-style">{t("description")}</p>
        </SectionIntroForDrawer>
        <div className="mx-auto mb-16">
          <div className="w-full rounded-none md:rounded-4xl">
            <Image
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAKCAIAAAAGpYjXAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nAH6AAX/AKmln762rszCudvPxO/e0O3bzfzo2P/56gCNhXyUi4Gjl4y1qp3AtKi+r6PIuarVxbYAjoV5hYB2bWxnbW5pdHRvendwhYF6g393AGxpZHhyaZCJfoiGgJWOhJqTiJeSiHdxZgCGfnWQiIaYlI7Gua+1qpyspZnZzryWj4MAdXN1h4SFdXN1lIuGva+h9+PK/+/VgHpvAFxcY5WQipGHg4uDf8W4qP/r0P/v1Y6FdwBUU1WOioeDf36VioLJuan/8tbt3ciUh34AHyIleHFsgnp6h4B8yr+u49TDeW5nbFdGAAADAyQfG0dCQXFpZZeNhENDQ05BOXlpVebziL/57r38AAAAAElFTkSuQmCC"
              width={800}
              height={800}
              quality={100}
              alt={t("alt")}
              src="https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/jaroun-render-2.png"
              className="object-cover md:mx-auto md:max-w-2xl md:rounded-4xl"
            />
          </div>
        </div>

        <SectionIntroForDrawer
          className="my-16"
          eyebrow=""
          title={t("featuresTitle")}
          invert={true}
        >
          <ul
            role="list"
            className="checkmark-style grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
          >
            {designFeatures.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  aria-hidden="true"
                  className="text-jarounNeutralLight h-6 w-5 flex-none"
                />
                {feature}
              </li>
            ))}
          </ul>
        </SectionIntroForDrawer>
        <SectionIntroForDrawer
          className="my-16"
          eyebrow=""
          title={t("plansTitle")}
          invert={true}
        >
          <p className="paragraph-style">{t("plansDescription")}</p>
        </SectionIntroForDrawer>

        <div className="mx-auto max-w-2xl pb-16 md:max-w-lg lg:max-w-none">
          <ImageCoverFlow features={plansImages} width={1080} height={1460} />
        </div>
      </DrawerWrapper>
      <ShowFeatureButton
        onClick={() => setIsDesignDialogOpen(true)}
        className="bg-jarounBurgundy mx-auto md:hidden"
        ariaLabel={t("buttonAriaLabel")}
      >
        <div className="flex items-center justify-between gap-2">
          <PlusIcon className="h-4 w-4 fill-white" />
          <span>{t("buttonText")}</span>
        </div>
      </ShowFeatureButton>
      <MoreInfoButton
        divClassName="hidden md:block"
        className="mb-4 ml-4"
        bgColor="bg-jarounTitleDark"
        hoverBgColor="hover:bg-jarounTitleDark"
        textColor="text-jarounSuperLight"
        hoverText={tLeanMore("learn-more")}
        // fillColor="fill-jarounSuperLight"
        onClick={() => setIsDesignDialogOpen(true)}
      >
        <PlusIcon className="h-4 w-4 fill-white" />
      </MoreInfoButton>
    </>
  );
}

export function JarounLobbyInfo() {
  const [isLobbyOpen, setIsLobbyDialogOpen] = useState(false);
  const t = useTranslations("Project.Jaroun.LobbyDrawer"); // Get translations
  const tData = useTranslations("Project.Jaroun.Data"); // 4. Get translations
  const tLeanMore = useTranslations("CommonButtons");

  // Get localized data
  const lobbyFeature = getLobbyFeatures(tData);
  const lobbyImages = getLobbyImages(tData);

  return (
    <>
      <DrawerWrapper
        isOpen={isLobbyOpen}
        onClose={() => setIsLobbyDialogOpen(false)}
        className="hide-scrollbar overflow-x-auto overscroll-x-contain scroll-smooth"
      >
        <SectionIntroForDrawer
          eyebrowColor="text-jarounLight"
          eyebrow={t("eyebrow")}
          title={t("title")}
        >
          <p className="paragraph-style paragraph-word-spacing">
            {t("description")}
          </p>
        </SectionIntroForDrawer>

        <div className="mx-auto my-12 max-w-2xl pb-16 md:max-w-2xl">
          <ImageCoverFlow
            caption={false}
            features={lobbyImages}
            width={1152}
            height={768}
          />
        </div>
        <SectionIntroForDrawer
          className="mb-16"
          eyebrow=""
          title={t("featuresTitle")}
          invert={true}
        >
          <ul
            role="list"
            className="checkmark-style grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
          >
            {lobbyFeature.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon
                  aria-hidden="true"
                  className="text-jarounNeutralLight h-6 w-5 flex-none"
                />
                {feature}
              </li>
            ))}
          </ul>
        </SectionIntroForDrawer>
      </DrawerWrapper>
      <ShowFeatureButton
        onClick={() => setIsLobbyDialogOpen(true)}
        className="bg-jarounBurgundy mx-auto md:hidden"
        ariaLabel={t("buttonAriaLabel")}
      >
        <div className="flex items-center justify-between gap-2">
          <PlusIcon className="h-4 w-4 fill-white" />
          <span>{t("buttonText")}</span>
        </div>
      </ShowFeatureButton>
      <MoreInfoButton
        divClassName="hidden md:block"
        className="mb-4 ml-4"
        bgColor="bg-jarounTitleDark"
        hoverBgColor="hover:bg-jarounTitleDark"
        textColor="text-jarounSuperLight"
        hoverText={tLeanMore("learn-more")}
        // fillColor="fill-jarounSuperLight"
        onClick={() => setIsLobbyDialogOpen(true)}
      >
        <PlusIcon className="h-4 w-4 fill-white" />
      </MoreInfoButton>
    </>
  );
}

export function JarounViewInfo() {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const t = useTranslations("Project.Jaroun.ViewDrawer"); // Get translations
  const tData = useTranslations("Project.Jaroun.Data"); // 4. Get translations
  const tLeanMore = useTranslations("CommonButtons");

  // Get localized data
  const viewImages = getViewImages(tData);

  return (
    <>
      <DrawerWrapper
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        className="overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <SectionIntroForDrawer
          eyebrowColor="text-jarounLight"
          eyebrow={t("eyebrow")}
          title={t("title")}
        >
          <p className="paragraph-style">{t("description")}</p>
        </SectionIntroForDrawer>

        <div className="mx-auto my-12 max-w-3xl pb-16">
          <ImageCoverFlow
            caption={false}
            features={viewImages}
            width={1440}
            height={1080}
          />
        </div>
      </DrawerWrapper>
      <ShowFeatureButton
        onClick={() => setIsViewOpen(true)}
        className="bg-jarounBurgundy mx-auto md:hidden"
        ariaLabel={t("buttonAriaLabel")}
      >
        <div className="flex items-center justify-between gap-2">
          <PlusIcon className="h-4 w-4 fill-white" />
          <span>{t("buttonText")}</span>
        </div>
      </ShowFeatureButton>
      <MoreInfoButton
        divClassName="hidden md:block"
        className="mb-4 ml-4"
        bgColor="bg-jarounTitleDark"
        hoverBgColor="hover:bg-jarounTitleDark"
        textColor="text-jarounSuperLight"
        hoverText={tLeanMore("learn-more")}
        // fillColor="fill-jarounSuperLight"
        onClick={() => setIsViewOpen(true)}
      >
        <PlusIcon className="h-4 w-4 fill-white" />
      </MoreInfoButton>
    </>
  );
}
