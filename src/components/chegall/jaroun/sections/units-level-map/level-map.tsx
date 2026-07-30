"use client";
import { useState, Suspense, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SpinningModelLoading,
  SpinningVideoLoading,
} from "@/components/chegall/jaroun/ui/jaroun-loading";
import Image from "next/image";
import { CheckIcon, MinusIcon } from "@heroicons/react/24/solid";
import { BsBadge3dFill } from "react-icons/bs";
import { TbAugmentedReality, TbAugmentedRealityOff } from "react-icons/tb";
import ImageZoom from "@/components/chegall/ImageZoom";
import {
  MdSwipe,
  MdSwipeVertical,
  MdPinch,
  MdOutlineArrowBack,
  MdTouchApp,
} from "react-icons/md";
import { IoMdHelpCircle } from "react-icons/io";
import clsx from "clsx";
import { DrawerWrapper } from "@/components/chegall/DrawerWrapper";
import { ModelViewer } from "@/components/ui/ModelViewer";
import { FadeIn } from "@/components/chegall/studio/FadeIn";
import { SpinningUnit } from "@/components/chegall/jaroun/ui/jaroun-interactive-video";
import { getUnits } from "@/components/chegall/jaroun/jaroun-data";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { UnitSelector } from "@/components/chegall/jaroun/sections/units-level-map/unit-selector";
import { useTranslations, useFormatter } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";

// --- TYPE DEFINITIONS ---
type Unit = ReturnType<typeof getUnits>[number];
type UnitFeature = Unit["features"][number];

const unitsBlurData = {
  plan: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAECAYAAABGM/VAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAX0lEQVR4nAFUAKv/AAAAAAC/v78ItLSuKaOjmhyfn58IAJ+ffwienJWrlJKL75CNh9jExLANAKOjow6hoJnwn52W/5uZkuWZmZkKAKqqqgyin51jk5CHUZqWjkL///8BsA8rXNoiPCwAAAAASUVORK5CYII=",
  livingRoom:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAECAYAAABGM/VAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAX0lEQVR4nAFUAKv/AMC+tfyysqqkgYF3ZHh4bmsDAwAwALCyq/6amI//bGlj/3NybP4yMiz8ALS6uf29ubL8JSMi/DAvKv2tqaL/AP/99////fP/UE9J/3Ryaf77+fL+kL8xvg877tEAAAAASUVORK5CYII=",
  overview:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAECAYAAABGM/VAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAT0lEQVR4nGNgYGBgePPmDcehQ4e89l24wA/ig8HpU0dmbNm09v+atWvOLti9mwsseOHs8TVHj+77P2/e7B64yv//3wkcOrrPh4GBgRkkAADOsSEJoYZkYwAAAABJRU5ErkJggg==",
};

export function LevelMap() {
  const t = useTranslations("Project.Jaroun.LevelMap");
  const tData = useTranslations("Project.Jaroun.Data"); // Used for data values (Yes/No)
  const format = useFormatter();
  const direction = useDirection();

  // FIX 1: MEMOIZE DATA
  // We use useMemo to prevent 'units' from being recreated on every single render.
  // This stops the dependency arrays in useEffects from triggering incorrectly.
  const units = useMemo(() => {
    return getUnits(tData, format);
  }, [tData, format]);

  const [selectedSlug, setSelectedSlug] = useState("1");
  const selectedUnit =
    units.find((unit) => unit.slug === selectedSlug) || units[0];

  // Safety check
  if (!selectedUnit) {
    return null;
  }

  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [modelMode, setModelMode] = useState("video");
  const [isModeChange, setIsModeChange] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isHelpActive, setIsHelpActive] = useState(false);
  const [start3D, setStart3D] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleSelection = (id: string) => {
    setSelectedSlug(id);
    setIsMoreInfoOpen(true);
  };

  // FIX 2: START 3D EFFECT WITH CLEANUP
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (start3D) {
      setExpanded(true);
      timer = setTimeout(() => {
        setExpanded(false);
        // Note: Resetting start3D or modeChange logic here if needed
        setIsModeChange(false);
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [start3D]);

  // FIX 3: MODE CHANGE EFFECT WITH CLEANUP
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isModeChange) {
      setExpanded(true);
      timer = setTimeout(() => {
        setExpanded(false);
        setIsModeChange(false);
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [isModeChange]);

  // FIX 4: HELP ACTIVE EFFECT WITH CLEANUP
  // This prevents the "flash" where previous timers turn off the help immediately after you turn it on.
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isHelpActive) {
      timer = setTimeout(() => {
        setIsHelpActive(false);
      }, 3500);
    }

    return () => clearTimeout(timer);
  }, [isHelpActive]);

  // FIX 5: TAB CHANGE LOGIC
  // We calculate the index number first. This is a stable primitive (number), unlike the array.
  const threeDTabIndex = selectedUnit.images.findIndex(
    (img: any) => img.slug === "3d",
  );

  useEffect(() => {
    let expandTimer: NodeJS.Timeout;
    let helpTimer: NodeJS.Timeout;

    if (selectedTabIndex === threeDTabIndex && threeDTabIndex !== -1) {
      setExpanded(true);
      setIsHelpActive(true);

      expandTimer = setTimeout(() => {
        setExpanded(false);
      }, 1500);

      helpTimer = setTimeout(() => {
        setIsHelpActive(false);
      }, 4500);
    }

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(helpTimer);
    };
    // Crucial: Depend on the index NUMBER (threeDTabIndex), not the image ARRAY.
  }, [selectedTabIndex, threeDTabIndex]);

  const toggleMode = () => {
    if (modelMode === "video") {
      setIsModeChange(true);
      setIsHelpActive(true);
      setModelMode("3d");
    }
    if (modelMode === "3d") {
      setIsModeChange(true);
      setIsHelpActive(true);
      setModelMode("video");
    }
  };

  const toggleHelp = () => {
    setIsHelpActive((prev) => !prev);
  };

  const uniqueSections = [
    ...new Set(
      selectedUnit.features.map((feature: UnitFeature) => feature.section),
    ),
  ];

  return (
    <>
      {/* More Info Drawer */}
      <DrawerWrapper
        bgColor="bg-jarounGray1"
        isOpen={isMoreInfoOpen}
        onClose={() => {
          setIsMoreInfoOpen(false);
          setModelMode("video");
          setSelectedTabIndex(0);
        }}
        className="overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <FadeIn>
          <div className="section-style"></div>
          <div className="mx-4">
            <TabGroup
              selectedIndex={selectedTabIndex}
              onChange={setSelectedTabIndex}
              className="flex flex-col-reverse"
            >
              {/* Image selector */}
              <div className="mx-auto mt-4 w-full max-w-2xl lg:max-w-none">
                <TabList className="flex items-center justify-center gap-6">
                  {selectedUnit.images.map((image: any) => (
                    <Tab
                      key={image.slug}
                      className={clsx(
                        "group focus:ring-opacity-50 text-jarounGray7 bg-jarounDark focus:ring-jarounNeutralLight relative flex cursor-pointer items-center justify-center rounded-lg text-sm font-medium uppercase focus:ring focus:ring-offset-4 focus:outline-none",
                        "data-[selected]:bg-appleBackgorundGray",
                        "h-12 w-12",
                        image.slug === "3d" &&
                          "inset-shadow-appleBackgorundGray/50 inset-shadow-sm" &&
                          selectedUnit.color,
                      )}
                    >
                      {image.slug !== "3d" && (
                        <div>
                          <span className="sr-only">{image.name}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <Image
                              width="100"
                              height="100"
                              placeholder="blur"
                              blurDataURL={
                                image.slug === "overview"
                                  ? unitsBlurData.overview
                                  : image.slug === "plan"
                                    ? unitsBlurData.plan
                                    : unitsBlurData.livingRoom
                              }
                              alt={image.name}
                              src={image.src as string}
                              className={clsx(
                                "aspect-square h-full w-full object-cover object-center",
                                image.slug === "overview" && "p-1",
                                image.slug === "plan" && "p-1",
                              )}
                            />
                          </span>
                          <span
                            aria-hidden="true"
                            className="group-data-[selected]:ring-jarounTitleDark pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2"
                          />
                        </div>
                      )}
                      {image.slug === "3d" && (
                        <div className="flex items-center justify-center">
                          <BsBadge3dFill className="fill-jarounGray1 h-7 w-7" />
                        </div>
                      )}
                    </Tab>
                  ))}
                </TabList>
              </div>

              {/* Main Content Panel */}
              <TabPanels
                id="model-container"
                className={clsx(
                  "section-rounded shadow-jarounTitleDark bg-modelContainerBlack mx-auto aspect-4/5 overflow-hidden shadow-2xs",
                  "w-full sm:aspect-5/4 sm:w-[24rem] md:aspect-square md:w-xl lg:w-2xl xl:aspect-5/4 xl:h-[74vh] xl:w-3xl",
                  "relative",
                )}
              >
                {selectedUnit.images.map((image: any) => (
                  <TabPanel
                    key={image.slug}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <div
                      className={clsx(
                        "absolute top-5 z-50 flex items-center",
                        // Dynamic spacing: This gap ensures the distance stays constant
                        "gap-4",
                        // Handle LTR vs RTL layout direction
                        direction === "rtl"
                          ? "right-5 flex-row-reverse"
                          : "left-5 flex-row",
                        image.slug !== "3d" && "hidden",
                      )}
                    >
                      <motion.div
                        className={clsx(
                          "relative flex items-center justify-center rounded-4xl",
                          // We remove the static w- classes here and rely on animate prop below
                        )}
                        initial={false}
                        animate={{
                          width: expanded ? "9rem" : "4rem", // 9rem = w-36, 4rem = w-16
                        }}
                        transition={{
                          duration: 0.4,
                          ease: "easeInOut",
                        }}
                      >
                        <motion.button
                          className={clsx(
                            "ring-jarounBlack/5 flex items-center justify-center rounded-4xl px-3 py-2 ring-1 transition-all transition-discrete duration-400",
                            "bg-jarounGray1/30",
                            "h-full w-full",
                          )}
                          onClick={toggleMode}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          animate={{
                            width: expanded ? "9rem" : "5.5rem",
                            opacity: expanded ? 1 : 0.9,
                          }}
                          transition={{
                            duration: 0.4,
                            ease: "easeInOut",
                          }}
                        >
                          {modelMode === "video" ? (
                            expanded ? (
                              <div className="text-jarounGray1/75 flex items-center justify-center gap-2">
                                <span className="text-xs text-nowrap sm:text-sm">
                                  {t("mode.basic")}
                                </span>
                                <TbAugmentedRealityOff className="icon-line h-5 w-5" />
                              </div>
                            ) : (
                              <div className="text-jarounGray1/75 flex items-center justify-center">
                                <TbAugmentedRealityOff className="icon-line h-5 w-5" />
                              </div>
                            )
                          ) : expanded ? (
                            <div className="text-jarounGray1/75 flex items-center justify-center gap-2">
                              <span className="text-xs text-nowrap sm:text-sm">
                                {t("mode.advanced")}
                              </span>
                              <TbAugmentedReality className="icon-line z-30 h-5 w-5" />
                            </div>
                          ) : (
                            <div className="text-jarounGray1/75 flex items-center justify-center">
                              <TbAugmentedReality className="icon-line z-30 h-5 w-5" />
                            </div>
                          )}
                        </motion.button>
                      </motion.div>
                      {image.slug === "3d" && (
                        <div
                          className={clsx(
                            "flex items-center gap-2", // Gap between text and arrow
                            "transition-opacity duration-300 ease-in-out",
                            // Flip arrow/text order based on direction
                            direction === "rtl"
                              ? "flex-row"
                              : "flex-row-reverse",
                            // Opacity logic
                            isHelpActive ? "opacity-100" : "opacity-0",
                            // Hide completely when expanded to avoid layout jumps if desired,
                            // or just opacity-0 if you want it to hold space.
                            // Using 'hidden' removes it from flow, 'opacity-0' keeps it in flow.
                            // Based on your previous code, you likely want it to fade out but stay close.
                            expanded && "pointer-events-none",
                          )}
                        >
                          <span
                            className={clsx(
                              "text-jarounGray1/75 text-xs text-nowrap sm:text-sm",
                              expanded
                                ? "opacity-0"
                                : "opacity-100 transition-opacity duration-300 ease-in",
                            )}
                          >
                            {modelMode === "3d"
                              ? t("mode.changeToBasic")
                              : t("mode.changeToAdvanced")}
                          </span>
                          <MdOutlineArrowBack
                            className={clsx(
                              "fill-jarounGray1/75 z-30 h-5 w-5",
                              // Rotate arrow for RTL if needed
                              direction === "rtl" && "rotate-180",
                              expanded
                                ? "opacity-0"
                                : "opacity-100 transition-opacity duration-300 ease-in",
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {/* Help Overlay */}
                    <div
                      className={clsx(
                        "absolute bottom-15 left-1/2 isolate z-200 flex -translate-x-1/2 items-center",
                      )}
                    >
                      {image.slug !== "3d" && (
                        <div
                          className={clsx(
                            "flex flex-col items-center justify-center gap-2",
                            isHelpActive
                              ? "opacity-100"
                              : "opacity-0 transition-opacity duration-300 ease-out",
                          )}
                        >
                          <MdTouchApp className="fill-jarounGray1/75 h-5 w-5" />
                          <span className="text-jarounGray1/75 text-xs text-nowrap sm:text-sm">
                            {t("help.zoom")}
                          </span>
                        </div>
                      )}
                      {image.slug === "3d" && modelMode === "video" && (
                        <div
                          className={clsx(
                            "flex flex-col items-center justify-center gap-2",
                            isHelpActive
                              ? "opacity-100"
                              : "opacity-0 transition-opacity duration-300 ease-out",
                          )}
                        >
                          <MdSwipe className="fill-jarounGray1/75 h-5 w-5" />
                          <span className="text-jarounGray1/75 text-xs text-nowrap sm:text-sm">
                            {t("help.rotate")}
                          </span>
                        </div>
                      )}
                      {image.slug === "3d" && modelMode === "3d" && (
                        <div
                          className={clsx(
                            "flex flex-col justify-center gap-2",
                            isHelpActive
                              ? "opacity-100"
                              : "opacity-0 transition-opacity duration-300 ease-out",
                          )}
                        >
                          <div className="flex items-center justify-start gap-1">
                            <MdSwipe
                              className="fill-jarounGray1/75 h-5 w-5"
                              aria-hidden="true"
                            />
                            <span className="text-jarounGray1/75 text-xs text-nowrap sm:text-sm">
                              {t("help.rotate")}
                            </span>
                          </div>
                          <div className="flex items-center justify-start gap-1">
                            <MdSwipeVertical
                              className="fill-jarounGray1/75 h-5 w-5"
                              aria-hidden="true"
                            />
                            <span className="text-jarounGray1/75 text-xs text-nowrap sm:text-sm">
                              {t("help.pan")}
                            </span>
                          </div>
                          <div className="flex items-center justify-start gap-1">
                            <MdPinch
                              className="fill-jarounGray1/75 h-5 w-5"
                              aria-hidden="true"
                            />
                            <span className="text-jarounGray1/75 text-xs text-nowrap sm:text-sm">
                              {t("help.pinch")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={clsx("absolute bottom-5 z-40", "end-5")}>
                      <IoMdHelpCircle
                        onClick={toggleHelp}
                        className={clsx("fill-jarounGray1/30 h-7 w-7")}
                      />
                    </div>

                    <div
                      className={clsx(
                        "absolute bottom-4 left-1/2 z-10 -translate-x-1/2",
                        image.slug === "3d" && isHelpActive
                          ? "opacity-100"
                          : "opacity-0 transition-opacity duration-300 ease-out",
                      )}
                    >
                      <span className="bg-jarounVeryDark/40 text-jarounGray1/75 mt-2 mb-2 ml-2 rounded-full px-3 py-1 text-xs text-nowrap sm:text-sm">
                        {image.name}
                      </span>
                    </div>

                    {image.slug !== "3d" && (
                      <ImageZoom
                        priority={true}
                        placeholder="blur"
                        blurDataURL={
                          image.slug === "overview"
                            ? unitsBlurData.overview
                            : image.slug === "plan"
                              ? unitsBlurData.plan
                              : unitsBlurData.livingRoom
                        }
                        title={image.name}
                        alt={image.name}
                        width={1000}
                        height={1000}
                        src={image.src as string}
                        className={clsx(
                          "w-full rounded-lg object-cover object-center",
                          image.slug === "overview" &&
                            "h-3/4 lg:h-9/10 xl:h-full",
                          image.slug === "plan" && "h-2/3 lg:h-8/9 xl:h-full",
                          image.slug === "living-room" &&
                            "aspect-4/5 object-cover xl:aspect-5/4",
                        )}
                      />
                    )}
                    {image.slug === "3d" && (
                      <div>
                        {modelMode === "3d" && (
                          <Suspense
                            fallback={
                              <SpinningModelLoading
                                src={image.image as string}
                                alt={image.name}
                              />
                            }
                          >
                            <div className="flex aspect-4/5 h-full w-sm items-center justify-center sm:w-lg lg:w-xl">
                              <ModelViewer modelPath={image.file as string} />
                            </div>
                          </Suspense>
                        )}
                        {modelMode === "video" && (
                          <Suspense
                            fallback={
                              <SpinningVideoLoading
                                src={image.image as string}
                                alt={image.name}
                              />
                            }
                          >
                            <div className="flex h-full w-full scale-120 items-center justify-center xl:w-md xl:scale-150">
                              <SpinningUnit
                                videoSource={
                                  image.video as { mp4: string; webm: string }
                                }
                              />
                            </div>
                          </Suspense>
                        )}
                      </div>
                    )}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          </div>
          <div className="subsection-padding" />
          <div className="section-style flex items-center justify-center sm:w-2xl lg:w-[50rem]">
            <table className="w-full rounded-3xl text-center">
              <colgroup>
                <col className="w-1/7 sm:w-1/7" />
                <col className="w-1/7 data-selected:table-column max-sm:hidden sm:w-1/7" />
              </colgroup>

              {(uniqueSections as string[]).map((section) => (
                <tbody key={section} className="group">
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={2}
                      className="text-jarounGray1 px-0 pt-10 pb-0 group-first-of-type:pt-0"
                    >
                      <div
                        className={clsx(
                          "bg-jarounBlack rounded-3xl px-4 py-3 text-start text-sm/6 font-semibold",
                          "iphone-pro:-mx-4 -mx-3 sm:-mx-3 xl:-mx-4",
                        )}
                      >
                        {section}
                      </div>
                    </th>
                  </tr>
                  {selectedUnit.features
                    // Ensure type safety here as well
                    .filter((feature: any) => feature.section === section)
                    .map(({ name, value }: any) => (
                      <tr
                        key={name}
                        className="border-jarounGray2 text-jarounGray2 border-b last:border-none"
                      >
                        <th
                          scope="row"
                          className="text-jarounGray7 p-4 px-0 py-4 text-start text-sm/6 font-normal text-nowrap"
                        >
                          {name}
                        </th>
                        <td className="p-2">
                          {/* Comparison Logic */}
                          {value === tData("features.yes") ? (
                            <div className="flex items-center justify-end">
                              <CheckIcon className="fill-jarounNeutralDark size-5" />
                              <span className="sr-only">
                                {t("features.available")}
                              </span>
                            </div>
                          ) : value === tData("features.no") ? (
                            <div className="flex items-center justify-end">
                              <MinusIcon className="size-4 fill-gray-400" />
                              <span className="sr-only">
                                {t("features.notAvailable")}
                              </span>
                            </div>
                          ) : (
                            <div className="text-jarounNeutralDark flex items-center justify-end text-sm/6 text-nowrap">
                              {value}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              ))}
            </table>
          </div>
        </FadeIn>
      </DrawerWrapper>

      {/* Map */}
      <FadeIn>
        <div className="section-padding xl:hidden" />
        <div className="section-style">
          <h2 className="text-jarounTitleDark eyebrow-style text-center xl:mb-2">
            {t("intro.eyebrow")}
          </h2>
          <p className="text-jarounTitleLight title-style text-center">
            {t("intro.title")}
          </p>
          <p className="text-jarounNeutralDark section-style subsection-padding text-center text-xs">
            {t("intro.description")}
          </p>
        </div>
        <UnitSelector handleSelection={handleSelection} />
      </FadeIn>
    </>
  );
}
