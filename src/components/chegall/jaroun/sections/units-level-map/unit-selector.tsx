"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApartmentInfo } from "@/components/ui/aprt-select-button";
import clsx from "clsx";
// 1. Import data getters
import {
  getArchTiers,
  getUnits,
} from "@/components/chegall/jaroun/jaroun-data";
import { GiClick } from "react-icons/gi";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { useTranslations, useFormatter } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";

// 2. Type definitions
type ArchTiersArray = ReturnType<typeof getArchTiers>;
type ArchTier = ArchTiersArray[number];

// --- (ButtonExpandedText component) ---
interface ButtonExpandedTextProps {
  bedroom: string;
  area: string;
  name: string;
  slug: string;
}
function ButtonExpandedText({
  bedroom,
  area,
  name,
  slug,
}: ButtonExpandedTextProps) {
  const t = useTranslations("Project.Jaroun.UnitSelector");
  return (
    <>
      {slug === "all" ? (
        <div className="flex items-center justify-center">
          <span className="text-jarounGray1 text-sm text-nowrap">{name}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-1">
          <span className="text-jarounGray1 text-sm text-nowrap">
            {bedroom}
          </span>
          <svg viewBox="0 0 2 2" className="fill-jarounGray1 h-1 w-1 flex-none">
            <circle cx={1} cy={1} r={1} />
          </svg>
          <span className="text-jarounGray1 text-sm text-nowrap">
            {/* Assuming 'meters' translation key handles formatting, e.g., "{area} m²" */}
            {t.rich("meters", {
              area: area,
              sup: (chunks) => <sup>{chunks}</sup>,
            })}
          </span>
        </div>
      )}
    </>
  );
}

// --- (ButtonDefaultText component) ---
interface ButtonDefaultTextProps {
  area: string;
  name: string;
  slug: string;
}
function ButtonDefaultText({ area, name, slug }: ButtonDefaultTextProps) {
  const t = useTranslations("Project.Jaroun.UnitSelector");
  return (
    <>
      {slug === "all" ? (
        <div className="flex items-center justify-center">
          <span className="text-jarounGray1 text-sm text-nowrap">{name}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span className="text-jarounGray1 text-sm text-nowrap">
            {t.rich("metersShort", {
              area: area,
              sup: (chunks) => <sup>{chunks}</sup>,
            })}
          </span>
        </div>
      )}
    </>
  );
}

// --- (LevelText component) ---
interface LevelTextProps {
  slug: string;
  mode: "unitNumber" | "unitArea";
}
function LevelText({ slug, mode }: LevelTextProps) {
  const t = useTranslations("Project.Jaroun.UnitSelector");
  const tData = useTranslations("Project.Jaroun.Data");
  const format = useFormatter();

  const archTiers = getArchTiers(tData, format);
  const modeText = t(`mode.${mode}`);
  const selectedTier = archTiers.find((tier) => tier.slug === slug);

  return (
    <>
      {slug === "all" ? (
        <span className="text-jarounGray2 subparagraph-style text-nowrap">
          {t("display.all", { mode: modeText })}
        </span>
      ) : (
        <span className="text-jarounGray2 subparagraph-style text-nowrap">
          {t.rich("display.filtered", {
            area: selectedTier?.area || "",
            mode: modeText,
            sup: (chunks) => <sup>{chunks}</sup>,
          })}
        </span>
      )}
    </>
  );
}

// --- (UnitSelector component) ---
interface UnitSelectorProps {
  handleSelection: (slug: string) => void;
}
export function UnitSelector({ handleSelection }: UnitSelectorProps) {
  const [startExperience, setStartExperience] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Controls opacity via scroll
  const [expanded, setExpanded] = useState(false);

  const t = useTranslations("Project.Jaroun.UnitSelector");
  const tData = useTranslations("Project.Jaroun.Data");
  const format = useFormatter();
  const direction = useDirection();

  // 1. Get Tier Data
  const archTiers = getArchTiers(tData, format);

  // 2. Get Unit Data
  const units = getUnits(tData, format);

  // Calculate default
  const defaultTier = archTiers.find((t) => t.slug === "all") || archTiers[0];

  const [selectedTier, setSelectedTier] = useState<ArchTier | undefined>(
    defaultTier,
  );

  // Ensure state updates if data loads late
  useEffect(() => {
    if ((!selectedTier || !selectedTier.slug) && archTiers.length > 0) {
      setSelectedTier(archTiers.find((t) => t.slug === "all") || archTiers[0]);
    }
  }, [archTiers, selectedTier]);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    document.body.style.overflow = !expanded ? "hidden" : "";
  };

  const handleCloseExapnd = () => {
    setExpanded(false);
    document.body.style.overflow = "";
  };

  const handleTierClick = (tier: ArchTier) => {
    setSelectedTier(tier);
    setExpanded(false);
    document.body.style.overflow = "";
  };

  const [mode, setMode] = useState<"unitNumber" | "unitArea">("unitNumber");
  const handleModeChange = (newMode: "unitNumber" | "unitArea") => {
    setMode(newMode);
  };

  // Auto Start Experience Timer
  useEffect(() => {
    const startElement = document.querySelector("#controller-start");
    if (!startElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startExperience) {
          const timer = setTimeout(() => {
            setStartExperience(true);
          }, 3600);
          return () => clearTimeout(timer);
        }
      },
      { root: null, threshold: 0.1 },
    );

    observer.observe(startElement);
    return () => {
      observer.unobserve(startElement);
    };
  }, [startExperience]);

  // Floating Controller Visibility on Scroll
  useEffect(() => {
    const controller = document.querySelector<HTMLElement>(
      "#floating-controller",
    );
    const start = document.querySelector<HTMLElement>("#controller-start");
    const end = document.querySelector<HTMLElement>("#controller-end");

    if (!controller || !start || !end) return;

    const updateControllerVisibility = () => {
      // 1. If experience hasn't started, force hide and return.
      // This prevents the scroll logic from overriding your CSS class.
      if (!startExperience) {
        controller.style.opacity = "0";
        controller.style.pointerEvents = "none";
        return;
      }

      const startRect = start.getBoundingClientRect();
      const endRect = end.getBoundingClientRect();

      // 2. SCROLL MATH FIX:
      // Show if:
      // A) We have scrolled past the start marker (startRect.top < window.innerHeight)
      // AND
      // B) The END marker has not yet entered the screen from the bottom (endRect.top > window.innerHeight)
      // Note: We subtract a small buffer (e.g., 50px) to fade it out slightly before it hits the footer
      const isWithinBounds =
        startRect.top < window.innerHeight &&
        endRect.top > window.innerHeight - 50;

      if (isWithinBounds) {
        controller.style.opacity = "1";
        controller.style.pointerEvents = "auto";
      } else {
        controller.style.opacity = "0";
        controller.style.pointerEvents = "none";
      }
    };

    window.addEventListener("scroll", updateControllerVisibility);
    // Run once immediately to set initial state
    updateControllerVisibility();

    return () => {
      window.removeEventListener("scroll", updateControllerVisibility);
    };
  }, [startExperience]); // <--- IMPORTANT: Add startExperience to dependency array

  // Data Mapping
  const formattedUnitData: Record<
    string,
    { unitNumber: string; area: string }
  > = {};

  units.forEach((unit) => {
    formattedUnitData[unit.slug] = {
      unitNumber: format.number(Number(unit.slug)),
      area: unit.area,
    };
  });

  if (!selectedTier) return null; // Prevent render before data

  return (
    <>
      <div id="controller-start" />
      <FadeIn className="relative h-full w-full overflow-hidden">
        <div
          onClick={() => setStartExperience(true)}
          className={clsx(
            "absolute top-2/5 left-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center",
            startExperience
              ? "pointer-events-none opacity-0 transition-all duration-500 ease-in" // Added pointer-events-none
              : "opacity-100",
          )}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <GiClick className="fill-jarounGray2/95 md:fill-jarounGray1/99 h-10 w-10" />
            <span className="subtitle-style text-jarounGray2/95 md:text-jarounGray2/99 text-center">
              {t("clickToExplore")}
            </span>
          </div>
        </div>
        <div
          style={{ aspectRatio: "1920 / 1280" }}
          className={clsx(
            "level-map iphone-x:h-[70vh] relative mx-auto h-[75vh] w-full sm:max-w-lg md:h-auto md:max-w-6xl",
            startExperience
              ? "blur-none transition-all duration-400 ease-in"
              : "blur-sm",
          )}
        >
          {/* --- UNIT BUTTONS --- */}
          {/* Unit 1 */}
          <div className="absolute top-[7.6%] right-[18%] z-20 sm:top-[16.95%] sm:right-auto sm:left-[11.17%]">
            <ApartmentInfo
              className={clsx(
                expanded && "hidden",
                !startExperience && "hidden",
                selectedTier.slug !== "2" &&
                  selectedTier.slug !== "all" &&
                  "hidden",
              )}
              title={
                mode === "unitNumber"
                  ? formattedUnitData["1"]?.unitNumber
                  : formattedUnitData["1"]?.area
              }
              titleColor="text-jarounVeryLight"
              bgColor="bg-jarounGreen/50"
              accentColor="text-jarounGreen/80"
              hoverBgColor="hover:bg-jarounTitleDark"
              hoverTextColor="text-jarounSuperLight"
              onClick={() => handleSelection("1")}
            />
          </div>

          {/* Unit 2 */}
          <div className="absolute top-[21.9%] right-[14.2%] z-20 sm:top-[18.15%] sm:right-auto sm:left-[26%]">
            <ApartmentInfo
              className={clsx(
                expanded && "hidden",
                !startExperience && "hidden",
                selectedTier.slug !== "1" &&
                  selectedTier.slug !== "all" &&
                  "hidden",
              )}
              title={
                mode === "unitNumber"
                  ? formattedUnitData["2"]?.unitNumber
                  : formattedUnitData["2"]?.area
              }
              titleColor="text-jarounVeryLight"
              bgColor="bg-jarounBlue/50"
              accentColor="text-jarounBlue/80"
              hoverBgColor="hover:bg-jarounTitleDark"
              hoverTextColor="text-jarounSuperLight"
              onClick={() => handleSelection("2")}
            />
          </div>

          {/* Unit 3 */}
          <div className="absolute top-[36.5%] right-[16.4%] z-20 sm:top-[23.9%] sm:right-auto sm:left-[40.3%]">
            <ApartmentInfo
              className={clsx(
                expanded && "hidden",
                !startExperience && "hidden",
                selectedTier.slug !== "1" &&
                  selectedTier.slug !== "all" &&
                  "hidden",
              )}
              title={
                mode === "unitNumber"
                  ? formattedUnitData["3"]?.unitNumber
                  : formattedUnitData["3"]?.area
              }
              titleColor="text-jarounVeryLight"
              bgColor="bg-jarounBlue/50"
              accentColor="text-jarounBlue/80"
              hoverBgColor="hover:bg-jarounTitleDark"
              hoverTextColor="text-jarounSuperLight"
              onClick={() => handleSelection("3")}
            />
          </div>

          {/* Unit 4 */}
          <div className="absolute top-[51.4%] right-[18.5%] z-20 sm:top-[29.5%] sm:right-auto sm:left-[54.4%]">
            <ApartmentInfo
              className={clsx(
                expanded && "hidden",
                !startExperience && "hidden",
                selectedTier.slug !== "1" &&
                  selectedTier.slug !== "all" &&
                  "hidden",
              )}
              title={
                mode === "unitNumber"
                  ? formattedUnitData["4"]?.unitNumber
                  : formattedUnitData["4"]?.area
              }
              titleColor="text-jarounVeryLight"
              bgColor="bg-jarounBlue/50"
              accentColor="text-jarounBlue/80"
              hoverBgColor="hover:bg-jarounTitleDark"
              hoverTextColor="text-jarounSuperLight"
              onClick={() => handleSelection("4")}
            />
          </div>

          {/* Unit 5 */}
          <div className="absolute top-[65.5%] right-[20.3%] z-20 sm:top-[34.9%] sm:right-auto sm:left-[68.5%]">
            <ApartmentInfo
              className={clsx(
                expanded && "hidden",
                !startExperience && "hidden",
                selectedTier.slug !== "1" &&
                  selectedTier.slug !== "all" &&
                  "hidden",
              )}
              title={
                mode === "unitNumber"
                  ? formattedUnitData["5"]?.unitNumber
                  : formattedUnitData["5"]?.area
              }
              titleColor="text-jarounVeryLight"
              bgColor="bg-jarounBlue/50"
              accentColor="text-jarounBlue/80"
              hoverBgColor="hover:bg-jarounTitleDark"
              hoverTextColor="text-jarounSuperLight"
              onClick={() => handleSelection("5")}
            />
          </div>

          {/* Unit 6 */}
          <div className="absolute top-[82.6%] right-[22.4%] z-20 sm:top-[41.2%] sm:right-[11.15%]">
            <ApartmentInfo
              className={clsx(
                expanded && "hidden",
                !startExperience && "hidden",
                selectedTier.slug !== "3" &&
                  selectedTier.slug !== "all" &&
                  "hidden",
              )}
              title={
                mode === "unitNumber"
                  ? formattedUnitData["6"]?.unitNumber
                  : formattedUnitData["6"]?.area
              }
              titleColor="text-jarounVeryLight"
              bgColor="bg-jarounGreen/50"
              accentColor="text-jarounGreen/80"
              hoverBgColor="hover:bg-jarounTitleDark"
              hoverTextColor="text-jarounSuperLight"
              onClick={() => handleSelection("6")}
            />
          </div>

          {/* Unit 11 */}
          <div className="absolute top-[16%] left-[26.5%] z-20 sm:top-[50.6%] sm:left-[11.4%]">
            <ApartmentInfo
              className={clsx(
                expanded && "hidden",
                !startExperience && "hidden",
                selectedTier.slug !== "6" &&
                  selectedTier.slug !== "all" &&
                  "hidden",
              )}
              title={
                mode === "unitNumber"
                  ? formattedUnitData["11"]?.unitNumber
                  : formattedUnitData["11"]?.area
              }
              titleColor="text-jarounVeryLight"
              bgColor="bg-jarounBurgundy/50"
              accentColor="text-jarounBurgundy/80"
              hoverBgColor="hover:bg-jarounTitleDark"
              hoverTextColor="text-jarounSuperLight"
              onClick={() => handleSelection("11")}
            />
          </div>

          {/* Unit 10 */}
          <div className="absolute top-[33.6%] left-[22.9%] z-20 sm:top-[58.3%] sm:left-[28.2%]">
            <ApartmentInfo
              className={clsx(
                expanded && "hidden",
                !startExperience && "hidden",
                selectedTier.slug !== "4" &&
                  selectedTier.slug !== "all" &&
                  "hidden",
              )}
              title={
                mode === "unitNumber"
                  ? formattedUnitData["10"]?.unitNumber
                  : formattedUnitData["10"]?.area
              }
              titleColor="text-jarounVeryLight"
              bgColor="bg-jarounGreen/50"
              accentColor="text-jarounGreen/80"
              hoverBgColor="hover:bg-jarounTitleDark"
              hoverTextColor="text-jarounSuperLight"
              onClick={() => handleSelection("10")}
            />
          </div>

          {/* Unit 9 */}
          <div className="absolute top-[49.2%] left-[21%] z-20 sm:top-[64%] sm:left-[43.6%]">
            <ApartmentInfo
              className={clsx(
                expanded && "hidden",
                !startExperience && "hidden",
                selectedTier.slug !== "4" &&
                  selectedTier.slug !== "all" &&
                  "hidden",
              )}
              title={
                mode === "unitNumber"
                  ? formattedUnitData["9"]?.unitNumber
                  : formattedUnitData["9"]?.area
              }
              titleColor="text-jarounVeryLight"
              bgColor="bg-jarounGreen/50"
              accentColor="text-jarounGreen/80"
              hoverBgColor="hover:bg-jarounTitleDark"
              hoverTextColor="text-jarounSuperLight"
              onClick={() => handleSelection("9")}
            />
          </div>

          {/* Unit 8 */}
          <div className="absolute top-[64.8%] left-[18.6%] z-20 sm:top-[70.2%] sm:left-[58.85%]">
            <ApartmentInfo
              className={clsx(
                expanded && "hidden",
                !startExperience && "hidden",
                selectedTier.slug !== "4" &&
                  selectedTier.slug !== "all" &&
                  "hidden",
              )}
              title={
                mode === "unitNumber"
                  ? formattedUnitData["8"]?.unitNumber
                  : formattedUnitData["8"]?.area
              }
              titleColor="text-jarounVeryLight"
              bgColor="bg-jarounGreen/50"
              accentColor="text-jarounGreen/80"
              hoverBgColor="hover:bg-jarounTitleDark"
              hoverTextColor="text-jarounSuperLight"
              onClick={() => handleSelection("8")}
            />
          </div>

          {/* Unit 7 */}
          <div className="absolute top-[80.4%] left-[16.65%] z-20 sm:top-[75.9%] sm:left-[73.65%]">
            <ApartmentInfo
              className={clsx(
                expanded && "hidden",
                !startExperience && "hidden",
                selectedTier.slug !== "5" &&
                  selectedTier.slug !== "all" &&
                  "hidden",
              )}
              title={
                mode === "unitNumber"
                  ? formattedUnitData["7"]?.unitNumber
                  : formattedUnitData["7"]?.area
              }
              titleColor="text-jarounVeryLight"
              bgColor="bg-jarounGreen/50"
              accentColor="text-jarounGreen/80"
              hoverBgColor="hover:bg-jarounTitleDark"
              hoverTextColor="text-jarounSuperLight"
              onClick={() => handleSelection("7")}
            />
          </div>
        </div>
        <div className="section-padding" />
      </FadeIn>

      {expanded && (
        <div
          className="fixed inset-0 h-screen w-screen backdrop-blur-xs transition-all transition-discrete"
          onClick={handleCloseExapnd}
        ></div>
      )}

      {/* FIXED: Removed 'hidden' from conditional clsx arguments to allow opacity to control visibility */}
      <div
        id="floating-controller"
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "fixed bottom-8 left-1/2 z-30 -translate-x-1/2 transform transition-opacity duration-300",
          !startExperience && "pointer-events-none opacity-0", // Only use opacity/pointer events logic here
        )}
      >
        <div className="z-40 mx-auto flex flex-col items-center justify-center gap-2">
          {!expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="subparagraph-style bg-appleTextBlack/80 rounded-full p-1 backdrop-blur-md"
            >
              <LevelText slug={selectedTier.slug} mode={mode} />
            </motion.div>
          )}
          <div
            className={clsx(
              "relative grid grid-cols-3 grid-rows-1 gap-1",
              "iphone-se:w-[75vw] iphone-pro:w-[73vw] google-pixel:w-[69vw] iphone-promax:w-[65vw]",
              "sm:w-full sm:max-w-[26rem]",
            )}
          >
            <div
              className={clsx(
                "bg-appleTextBlack/80 relative col-span-1 flex items-center justify-center rounded-4xl p-1 shadow-2xs backdrop-blur-md",
                expanded ? "w-36" : "w-24", // Fixed width to match working code
              )}
            >
              <motion.button
                className={clsx(
                  "ring-jarounBlack/5 flex items-center justify-center rounded-4xl px-3 py-2 shadow-2xs ring-1 transition-all transition-discrete duration-400",
                  selectedTier.color,
                  expanded ? "w-36" : "w-[5.5rem]", // Fixed width to match working code
                )}
                onClick={toggleExpanded}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {expanded ? (
                  <ButtonExpandedText
                    bedroom={selectedTier.bedroom}
                    area={selectedTier.area}
                    name={selectedTier.name}
                    slug={selectedTier.slug}
                  />
                ) : (
                  <ButtonDefaultText
                    area={selectedTier.area}
                    name={selectedTier.name}
                    slug={selectedTier.slug}
                  />
                )}
              </motion.button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    className="absolute bottom-[3.5rem] flex w-36 flex-col gap-4"
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {archTiers.map((tier) => (
                      <motion.div
                        key={tier.slug}
                        className={clsx(
                          tier.slug === selectedTier.slug
                            ? "hidden"
                            : "ring-jarounBlack/5 flex cursor-pointer items-center justify-evenly gap-8 rounded-4xl px-3 py-2 shadow-2xs ring-1 transition-all transition-discrete",
                          tier.color,
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          handleTierClick(tier);
                          handleCloseExapnd();
                        }}
                      >
                        <ButtonExpandedText
                          bedroom={tier.bedroom}
                          area={tier.area}
                          name={tier.name}
                          slug={tier.slug}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className={clsx(
                "col-span-2 flex items-center justify-center",
                expanded &&
                  "hidden transition-all transition-discrete duration-100",
              )}
            >
              <div className="bg-appleTextBlack/80 relative flex items-center justify-between gap-2 rounded-4xl p-1 shadow-2xs backdrop-blur-md">
                {/* Background Pill - Adjusted width and position logic */}
                <motion.div
                  className={clsx(
                    "absolute h-10 rounded-4xl bg-stone-500 p-1 shadow-2xs",
                    mode === "unitArea" ? "w-[5.35rem]" : "w-24",
                  )}
                  initial={false}
                  animate={{
                    // If RTL: '0%' is right (first item), '-100%' is left (second item)
                    // If LTR: '0%' is left (first item), '100%' is right (second item)
                    x:
                      direction === "rtl"
                        ? mode === "unitArea"
                          ? "-100%"
                          : "0%"
                        : mode === "unitArea"
                          ? "100%"
                          : "0%",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <button
                  className={clsx(
                    "relative z-10 flex w-1/2 items-center justify-center rounded-full px-3 py-2 text-sm text-nowrap",
                    mode === "unitNumber"
                      ? "text-jarounGray1"
                      : "text-jarounGray3",
                  )}
                  onClick={() => handleModeChange("unitNumber")}
                >
                  {t("toggle.unitNumber")}
                </button>
                <button
                  className={clsx(
                    "relative z-10 flex w-1/2 items-center justify-center rounded-full px-3 py-2 text-sm text-nowrap",
                    mode === "unitArea"
                      ? "text-jarounGray1"
                      : "text-jarounGray3",
                  )}
                  onClick={() => handleModeChange("unitArea")}
                >
                  {t("toggle.unitArea")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-padding" />
      <div className="section-padding-xl xl:section-padding" />
      <div className="section-padding hidden md:block" />
      <div id="controller-end" />
    </>
  );
}
