"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { FaCompass } from "react-icons/fa";
import { BsFillHousesFill } from "react-icons/bs";
import { MdDesignServices } from "react-icons/md";
import { MoreInfoButton } from "@/components/ui/more-info-button";
import {
  Listbox,
  ListboxLabel,
  ListboxOption,
} from "@/components/ui/chegall-listbox";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination, Mousewheel, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

import { FadeIn, FadeInStagger } from "@/components/chegall/studio/FadeIn";
import { useTranslations, useFormatter } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";

// Import the data getters
import {
  getTiers,
  getTypes,
  getArchTiers,
  type ArchTier, // Import the type
} from "@/components/chegall/jaroun/jaroun-data";

// --- PillSelectMenu ---
export default function PillSelectMenu() {
  const t = useTranslations("Project.Jaroun.Components.PillSelect");
  const [isOpen, setIsOpen] = useState(false);

  // Safely get options array
  const rawOptions = t.raw("options");
  const options = Array.isArray(rawOptions) ? rawOptions : [];
  const [selected, setSelected] = useState(options[0] || "Option 1");

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleMenu}
        className="ring-jarounBlack/5 flex items-center justify-between gap-2 rounded-4xl bg-white px-4 py-2 shadow-2xs ring-1 transition-all duration-400 hover:shadow-sm"
      >
        <span className="text-sm font-medium">{selected}</span>
        <svg
          className={`h-4 w-4 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="ring-jarounBlack/5 absolute z-10 mt-2 w-full rounded-4xl bg-white shadow-lg ring-1"
          >
            <ul className="divide-y divide-gray-100">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelect(option)}
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {option}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- ApartTiers ---
export function ApartTiers() {
  // 1. Translations for UI Labels (metersLabel, etc.)
  const tUI = useTranslations("Project.Jaroun.Components.ApartTiers");
  // 2. Translations for Data (Project.Jaroun.Data)
  const tData = useTranslations("Project.Jaroun.Data");
  const tButton = useTranslations("CommonButtons");
  const format = useFormatter();

  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTier, setSelectedTier] = useState("1");
  const [selectedMdTier, setSelectedMdTier] = useState("0"); // Default to index 0 string

  // 3. Fetch Data
  const tiers = getTiers(tData, format);

  // Helper to get the currently selected sub-type data
  const activeTier = tiers.find((t) => t.slug === selectedTier);
  // Find selected type or default to first
  const activeType =
    activeTier?.types.find((t: any) => t.slug === selectedMdTier) ||
    activeTier?.types[0];

  const handleFlip = (slug: string) => {
    if (slug !== selectedTier && isFlipped) {
      setIsFlipped((prev) => !prev);
    }
    setSelectedTier(slug);
    setIsFlipped((prev) => !prev);
    setSelectedMdTier("0"); // Reset sub-selection on flip
  };

  return (
    <FadeIn className="section-style grid grid-cols-1 grid-rows-3 gap-1 md:grid-cols-3 md:grid-rows-1 md:gap-3">
      {tiers.map((tier) => (
        <div
          key={tier.slug}
          className="relative row-span-1 mt-4 cursor-pointer md:col-span-1"
          style={{ perspective: "1200px", height: "400px", width: "100%" }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d", borderRadius: "1rem" }}
            animate={{
              rotateY: isFlipped && tier.slug === selectedTier ? 180 : 0,
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Front Side */}
            <div
              className="bg-appleTextBlack section-rounded absolute inset-0 flex flex-col items-center justify-start overflow-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="relative h-full w-full">
                <div className="grid h-full grid-rows-[auto_1fr]">
                  <div className="section-style row-span-1 flex flex-col items-center justify-center gap-4 px-3 py-6">
                    <span className="text-jarounGray1 subtitle-style text-center text-nowrap">
                      {tier.name}
                    </span>
                    <div
                      className={clsx(
                        "ring-jarounBlack/5 flex items-center justify-center gap-2 rounded-4xl px-4 py-2 shadow-2xs ring-1",
                        tier.color,
                      )}
                    >
                      <span className="text-jarounLight eyebrow-style md:hidden xl:block">
                        {tier.bedroom}
                      </span>
                      <svg
                        viewBox="0 0 2 2"
                        className="fill-jarounLight h-1 w-1 flex-none md:hidden xl:block"
                      >
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <span className="text-jarounLight eyebrow-style text-nowrap">
                        {/* Use tUI for labels */}
                        {tUI("metersLabel", { area: tier.area })}
                      </span>
                    </div>
                  </div>
                  <div className="relative row-span-1 flex w-full items-center justify-center pb-4">
                    <div className="relative h-full w-2/3">
                      {/* Only render image if src exists */}
                      {tier.image && (
                        <Image
                          src={tier.image}
                          alt={tier.name}
                          fill
                          className="object-contain"
                          placeholder="blur"
                          blurDataURL={
                            tier.blurData ||
                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => handleFlip(tier.slug)}
                className="absolute bottom-4 left-4"
              >
                <MoreInfoButton
                  bgColor={tier.color}
                  hoverBgColor={`hover:${tier.color}`}
                  buttonPosition="left-6/10"
                  textColor="text-jarounSuperLight"
                  hoverText={tButton("learn-more")}
                >
                  <PlusIcon className="h-5 w-5 fill-white" />
                </MoreInfoButton>
              </div>
            </div>

            {/* Back Side */}
            <div
              className="bg-appleBackgorundGray section-rounded absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            >
              {/* Back content logic */}
              <div className="relative flex h-full w-full flex-col items-center justify-center">
                {/* If multiple types, show dropdown logic */}
                <div
                  className={clsx(
                    tier.types.length <= 1 && "hidden",
                    "flex flex-col items-center gap-4",
                  )}
                >
                  <div className="mt-2">
                    {tier.types ? (
                      <Select
                        value={selectedMdTier}
                        onValueChange={setSelectedMdTier}
                      >
                        <SelectTrigger className="bg-jarounTitleDark section-rounded w-full max-w-36 border-none text-white focus:ring-0 focus:ring-offset-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tier.types.map((type: any) => (
                            <SelectItem key={type.slug} value={type.slug}>
                              {/* Ensure 't' or 'tUI' matches your translation hook variable name */}
                              {tUI("metersLabel", { area: type.area })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <ArrowPathIcon className="h-5 w-5 animate-spin text-white" />
                    )}
                  </div>
                  {/* Render details for the selected sub-type (activeType) */}
                  {activeType && (
                    <div className="grid grid-cols-2 gap-4 p-4">
                      <div className="bg-jarounGray6 section-rounded flex flex-col items-center p-4">
                        <span className="text-jarounTitleDark text-xs">
                          {tUI("designLabel")}
                        </span>
                        <span className="text-jarounTitleLight text-sm font-bold">
                          {activeType.name}
                        </span>
                      </div>
                      <div className="bg-jarounGray6 section-rounded flex flex-col items-center p-4">
                        <span className="text-jarounTitleDark text-xs">
                          {tUI("orientationLabel")}
                        </span>
                        <span className="text-jarounTitleLight text-sm font-bold">
                          {activeType.orientation}
                        </span>
                      </div>
                      <div className="bg-jarounGray6 section-rounded col-span-2 flex flex-col items-center p-4">
                        <span className="text-jarounTitleDark text-xs">
                          {tUI("countLabel")}
                        </span>
                        <span className="text-jarounTitleLight text-sm font-bold">
                          {tUI("unitsPerFloor", { count: activeType.amount })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* If only 1 type, show static details */}
                <div
                  className={clsx(
                    tier.types.length > 1 && "hidden",
                    "flex flex-col gap-4",
                  )}
                >
                  {tier.types[0] && (
                    <div className="grid grid-cols-2 gap-4 p-4">
                      <div className="bg-jarounGray6 section-rounded flex flex-col items-center p-4">
                        <span className="text-jarounTitleDark text-xs">
                          {tUI("designLabel")}
                        </span>
                        <span className="text-jarounTitleLight text-sm font-bold">
                          {tier.types[0].name}
                        </span>
                      </div>
                      <div className="bg-jarounGray6 section-rounded flex flex-col items-center p-4">
                        <span className="text-jarounTitleDark text-xs">
                          {tUI("orientationLabel")}
                        </span>
                        <span className="text-jarounTitleLight text-sm font-bold">
                          {tier.types[0].orientation}
                        </span>
                      </div>
                      <div className="bg-jarounGray6 section-rounded col-span-2 flex flex-col items-center p-4">
                        <span className="text-jarounTitleDark text-xs">
                          {tUI("countLabel")}
                        </span>
                        <span className="text-jarounTitleLight text-sm font-bold">
                          {tUI("unitsPerFloor", {
                            count: tier.types[0].amount,
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                onClick={() => handleFlip(tier.slug)}
                className="absolute bottom-4 left-4"
              >
                <MoreInfoButton
                  hoverButton={false}
                  bgColor="bg-jarounTitleDark"
                  hoverBgColor="hover:bg-jarounTitleDark"
                  textColor="text-jarounSuperLight"
                  hoverText={tButton("learn-more")}
                >
                  <XMarkIcon className="h-5 w-5 fill-white" />
                </MoreInfoButton>
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </FadeIn>
  );
}

// --- TypeCardStackFlip ---
export function TypeCardStackFlip() {
  const tUI = useTranslations("Project.Jaroun.Components.TypeCardStack");
  const tData = useTranslations("Project.Jaroun.Data");
  const format = useFormatter();

  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedType, setSelectedType] = useState("1");

  const types = getTypes(tData, format);

  const handleFlip = (slug: string) => {
    setSelectedType(slug);
    setIsFlipped(true);
  };
  const handleFlipBack = () => {
    setIsFlipped(false);
  };

  return (
    <Swiper
      effect={"cards"}
      cardsEffect={{
        perSlideOffset: 8,
        perSlideRotate: 2,
        slideShadows: false,
      }}
      grabCursor={true}
      modules={[EffectCards]}
      className="h-full w-full"
    >
      {types.map((type) => (
        <SwiperSlide key={type.slug}>
          <div
            className="iphone-pro:h-[70vh] iphone-pro:w-[100vw] relative h-[70vh] w-[65vw] cursor-pointer"
            style={{ perspective: "1200px" }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d", borderRadius: "1rem" }}
              animate={{
                rotateY: isFlipped && type.slug === selectedType ? 180 : 0,
              }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Front Side */}
              <div
                className={clsx(
                  "bg-jarounGray1 absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-4xl py-4 ring-1 ring-black/5 drop-shadow-xl",
                  type.color,
                )}
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex h-full w-full flex-col overflow-hidden rounded-4xl">
                  <div
                    onClick={() => handleFlip(type.slug)}
                    className="flex cursor-pointer items-center justify-center p-4"
                  >
                    <p className="text-jarounDark text-lg font-semibold">
                      {type.name}
                    </p>
                  </div>
                  {/* Add image here if available in JSON */}
                </div>
              </div>

              {/* Back Side */}
              <div
                className={clsx(
                  "bg-jarounGray1 absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-4xl py-4 ring-1 ring-black/5 drop-shadow-xl",
                  type.color,
                )}
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="relative flex h-full w-full flex-col">
                  <button
                    dir="ltr"
                    className="bg-jarounVeryDark/40 absolute top-2 right-2 z-10 rounded-full p-2 backdrop-blur-md focus:outline-hidden"
                    onClick={handleFlipBack}
                  >
                    <ChevronRightIcon className="text-jarounVeryLight h-5 w-5" />
                  </button>

                  <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
                    <p className="text-lg font-bold">{type.name}</p>
                    <div className="grid w-full grid-cols-2 gap-4">
                      <div className="rounded-xl bg-white/50 p-2 text-center">
                        <span className="block text-xs text-neutral-600">
                          {tUI("typeLabel", { slug: type.slug })}
                        </span>
                        <span className="font-semibold">{type.area} m²</span>
                      </div>
                      <div className="rounded-xl bg-white/50 p-2 text-center">
                        <span className="block text-xs text-neutral-600">
                          Bedrooms
                        </span>
                        <span className="font-semibold">{type.bedroom}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

// --- TypeCardStack ---
export function TypeCardStack() {
  const t = useTranslations("Project.Jaroun.Components.TypeCardStack");
  const tData = useTranslations("Project.Jaroun.Data");
  const format = useFormatter();

  const types = getTypes(tData, format);

  return (
    <Swiper
      effect={"cards"}
      cardsEffect={{
        perSlideOffset: 8,
        perSlideRotate: 2,
        slideShadows: false,
      }}
      grabCursor={true}
      modules={[EffectCards]}
      className="h-full w-full"
    >
      {types.map((type) => (
        <SwiperSlide key={type.slug}>
          <div className="iphone-pro:h-[70vh] iphone-pro:w-[100vw] relative h-[70vh] w-[65vw] cursor-pointer">
            <div
              className={clsx(
                "bg-jarounGray1 absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-4xl py-4 ring-1 ring-black/5 drop-shadow-xl",
                type.color,
              )}
            >
              <div className="flex h-full w-full flex-col overflow-hidden rounded-4xl">
                <div className="flex items-center justify-center p-4">
                  <p className="text-jarounDark text-lg font-semibold">
                    {type.name}
                  </p>
                </div>
                <div className="relative flex-1">
                  {/* Video or Image */}
                  {type.video && (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    >
                      <source src={type.video.webm} type="video/webm" />
                      <source src={type.video.mp4} type="video/mp4" />
                    </video>
                  )}
                </div>
                <div className="p-6">
                  <dl className="bg-jarounGray7 ring-jarounBlack/5 flex items-center justify-evenly gap-4 rounded-4xl p-2 shadow-2xs ring-1">
                    <dt className="text-jarounTitleLight text-base font-semibold">
                      {type.name}
                    </dt>
                    <dt className="text-jarounTitleLight text-base font-semibold">
                      {t("metersLabel", { area: type.area })}
                    </dt>
                    <dt className="text-jarounTitleLight text-base font-semibold">
                      {type.bedroom}
                    </dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

// --- PillSelector ---
export const PillSelector = () => {
  const t = useTranslations("Project.Jaroun.Components.PillSelector");
  const tData = useTranslations("Project.Jaroun.Data");
  const format = useFormatter();

  const archTiers = getArchTiers(tData, format);
  const [expanded, setExpanded] = useState(false);

  // Default to first item, safe check
  const [selectedTier, setSelectedTier] = useState<ArchTier>(
    archTiers[0] || {},
  );

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const handleTierClick = (tier: ArchTier) => {
    setSelectedTier(tier);
    setExpanded(false);
  };

  if (!selectedTier) return null; // Loading state

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <motion.button
        className={clsx(
          "ring-jarounBlack/5 flex items-center justify-evenly gap-8 rounded-4xl p-2 shadow-2xs ring-1 transition-all duration-300",
          selectedTier.color,
          expanded ? "w-36" : "w-24",
        )}
        onClick={toggleExpanded}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className={clsx(
            "flex flex-col items-center justify-center gap-2",
            expanded ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex items-center justify-start gap-2">
            {expanded && (
              <>
                <span className="text-jarounLight eyebrow-style text-nowrap">
                  {selectedTier.bedroom}
                </span>
                <svg
                  viewBox="0 0 2 2"
                  className="fill-jarounLight h-1 w-1 flex-none"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>
              </>
            )}
            <span className="text-jarounLight eyebrow-style text-nowrap">
              {t("metersLabel", { area: selectedTier.area })}
            </span>
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="absolute right-0 bottom-12 flex flex-col gap-4"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {archTiers.map((tier) => (
              <motion.div
                key={tier.slug}
                className={clsx(
                  "ring-jarounBlack/5 flex cursor-pointer items-center justify-evenly gap-8 rounded-4xl p-2 shadow-2xs ring-1",
                  tier.color,
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTierClick(tier)}
              >
                <div className="flex w-36 items-center justify-start gap-2">
                  <span className="text-jarounLight eyebrow-style text-nowrap">
                    {tier.bedroom}
                  </span>
                  <svg
                    viewBox="0 0 2 2"
                    className="fill-jarounLight h-1 w-1 flex-none"
                  >
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <span className="text-jarounLight eyebrow-style text-nowrap">
                    {t("metersLabel", { area: tier.area })}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
