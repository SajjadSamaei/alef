// src/components/chegall/jaroun/jaroun-data.ts

import { FaTree, FaShoppingCart, FaAnchor } from "react-icons/fa";
import { BiHealth } from "react-icons/bi";
import { IoSchoolSharp } from "react-icons/io5";
import { useTranslations, useFormatter } from "next-intl";

// 2. Define the correct types for the translation and formatter functions
type T = ReturnType<typeof useTranslations>;
type F = ReturnType<typeof useFormatter>;
export type ArchTier = ReturnType<typeof getArchTiers>[number];
export type Unit = ReturnType<typeof getUnits>[number];
export type UnitFeature = Unit["features"][number];
export type Type = ReturnType<typeof getTypes>[number];
export type Tier = ReturnType<typeof getTiers>[number];

const safeArray = (data: any) => {
  if (Array.isArray(data)) return data;
  if (typeof data === "object" && data !== null) return Object.values(data);
  return [];
};

// --- FEATURES & PLANS ---

export const getDesignFeatures = (t: T): string[] =>
  t.raw("designFeatures") as string[];
export const getLobbyFeatures = (t: T) => t.raw("lobbyFeatures") as string[];

export const getPlansImages = (t: T) => [
  {
    name: t("plansImages.underground2"),
    slug: "under-ground-floor-2",
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/plans/under-ground-floor-2.jpg",
  },
  {
    name: t("plansImages.underground1"),
    slug: "under-ground-floor-1",
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/plans/under-ground-floor-1.jpg",
  },
  {
    name: t("plansImages.ground"),
    slug: "ground-floor",
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/plans/ground-floor.jpg",
  },
  {
    name: t("plansImages.floor1"),
    slug: "1st-floor",
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/plans/1st-floor.jpg",
  },
  {
    name: t("plansImages.floor2_5_6"),
    slug: "2nd-5th-6th-floors",
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/plans/2nd-5th-6th-floors.jpg",
  },
  {
    name: t("plansImages.floor3_4_7"),
    slug: "3th-4th-7th-floor",
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/plans/3th-4th-7th-floor.jpg",
  },
];

export const getLobbyImages = (t: T) => [
  {
    slug: "lobby-1",
    name: t("lobbyImages.lobby1"),
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/lobby/lobby-1.png",
  },
  {
    slug: "lobby-2",
    name: t("lobbyImages.lobby2"),
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/lobby/lobby-2.png",
  },
  {
    slug: "lobby-cafe-1",
    name: t("lobbyImages.cafe1"),
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/lobby/cafe-1.png",
  },
  {
    slug: "lobby-cafe-2",
    name: t("lobbyImages.cafe2"),
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/renders/interior/lobby/cafe-2.png",
  },
];

export const getViewImages = (t: T) => [
  {
    name: t("viewImages.sea1"),
    slug: "sea-view-1",
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/pictures/view-sea-1.JPG",
  },
  {
    name: t("viewImages.mountain"),
    slug: "mountain-view",
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/pictures/view-mountain.JPG",
  },
  {
    name: t("viewImages.sea2"),
    slug: "sea-view-2",
    image:
      "https://storage.c2.liara.space/chegall/projects/jaroun/pictures/view-sea-2.JPG",
  },
];

// --- LOCATION BENEFITS ---

export const getLocationBenefits = (t: T) => [
  {
    name: t("location.school.name"),
    description: t("location.school.description"),
    icon: IoSchoolSharp,
    iconBG: "#565044",
    iconColor: "#0973ba",
  },
  {
    name: t("location.beach.name"),
    description: t("location.beach.description"),
    icon: FaAnchor,
    iconBG: "#395886",
    iconColor: "#8aaee0",
  },
  {
    name: t("location.mall.name"),
    description: t("location.mall.description"),
    icon: FaShoppingCart,
    iconBG: "#c9861e",
    iconColor: "#e5d695",
  },
  {
    name: t("location.park.name"),
    description: t("location.park.description"),
    icon: FaTree,
    iconBG: "#324d3e",
    iconColor: "#8ea58b",
  },
  {
    name: t("location.hospital.name"),
    description: t("location.hospital.description"),
    icon: BiHealth,
    iconBG: "#0973ba",
    iconColor: "#0973ba",
  },
];

// --- TIMELINE ---

export const getJarounTimeline = (t: T) => [
  {
    name: t("timeline.design.name"),
    description: t("timeline.design.description"),
    date: t("timeline.design.date"),
    dateTime: "2021-03", // Use ISO date for machine reading
    status: "completed",
  },
  {
    name: t("timeline.foundation.name"),
    description: t("timeline.foundation.description"),
    date: t("timeline.foundation.date"),
    dateTime: "2021-12",
    status: "completed",
  },
  {
    name: t("timeline.structure.name"),
    description: t("timeline.structure.description"),
    date: t("timeline.structure.date"),
    dateTime: "2022-05",
    status: "completed",
  },
  {
    name: t("timeline.walls.name"),
    description: t("timeline.walls.description"),
    date: t("timeline.walls.date"),
    dateTime: "2024-03",
    status: "completed",
  },
  {
    name: t("timeline.finishing.name"),
    description: t("timeline.finishing.description"),
    date: t("timeline.finishing.date"),
    dateTime: "2024-04",
    status: "current",
  },
  {
    name: t("timeline.facade.name"),
    description: t("timeline.facade.description"),
    date: t("timeline.facade.date"),
    dateTime: "2026-03",
    status: "pending",
  },
  {
    name: t("timeline.final.name"),
    description: t("timeline.final.description"),
    date: t("timeline.final.date"),
    dateTime: "2026-06",
    status: "pending",
  },
  {
    name: t("timeline.opening.name"),
    description: t("timeline.opening.description"),
    date: t("timeline.opening.date"),
    dateTime: "2026-10",
    status: "pending",
  },
];

// --- UNIT TIERS & TYPES ---

// Helper function to build translated 'types' array
const buildTierTypes = (t: T, format: F, tierKey: string, typesData: any[]) => {
  return typesData.map((type, i) => ({
    name: t(`${tierKey}.types.${i}.name`),
    orientation: t(`${tierKey}.types.${i}.orientation`),
    amount: format.number(type.amount),
    area: format.number(type.area),
    balcony: format.number(type.balcony),
    bathroom: format.number(type.bathroom),
  }));
};

export const getTiers = (t: T, format: F) => {
  // 1. Get the raw array (tiersList)
  const tiersData = t.raw("tiersList") as any[];
  if (!Array.isArray(tiersData)) return [];

  return tiersData.map((tier) => ({
    ...tier,
    // 2. Get translations from the object (tiers)
    name: t(`tiers.${tier.slug}.name`),
    bedroom: t(`tiers.${tier.slug}.bedroom`),
    // 3. Handle area range formatting
    area: t(`tiers.${tier.slug}.area`, {
      min: format.number(tier.areaRange[0]),
      max: format.number(tier.areaRange[1]),
    }),
    // 4. Map nested types
    types: tier.typesData.map((type: any, i: number) => ({
      name: t(`tiers.${tier.slug}.types.${i}.name`),
      orientation: t(`tiers.${tier.slug}.types.${i}.orientation`),
      amount: format.number(type.amount),
      area: format.number(type.area),
      balcony: format.number(type.balcony),
      bathroom: format.number(type.bathroom),
      slug: i.toString(), // Ensure slug exists for selection logic
    })),
  }));
};

export const getTypes = (t: T, format: F) => {
  const typesData = t.raw("typesList") as any[];
  if (!Array.isArray(typesData)) return [];

  return typesData.map((type) => ({
    ...type,
    name: t(`types.${type.slug}.name`),
    bedroom: t(`types.${type.slug}.bedroom`),
    area: format.number(type.areaValue),
    balcony: format.number(type.balconyValue),
    orientation: t(`types.${type.slug}.orientation`),
    // Ensure video object exists to prevent crashes
    video: type.video || "",
  }));
};

export const getArchTiers = (t: T, format: F) => {
  // DYNAMIC LOAD: Reads 'archTiers' from the translation JSON
  const tiersData = safeArray(t.raw("archTiers"));

  return tiersData.map((tier: any) => ({
    ...tier,
    // We trust the JSON has 'name', 'bedroom', 'orientation' translated
    area: tier.area ? format.number(Number(tier.area)) : "",
    amount: tier.amount ? format.number(tier.amount) : "",
    balcony: tier.balcony ? format.number(tier.balcony) : "",
  }));
};

// --- UNITS (COMPLEX) ---

// Helper to build the localized 'features' array for each unit
const buildUnitFeatures = (t: T, format: F, unit: any) => {
  const yes = t("features.yes");
  const no = t("features.no");

  const featuresList = [
    {
      section: "primary",
      name: "unitNumber",
      value: format.number(unit.unitNumber),
    },
    {
      section: "primary",
      name: "unitType",
      value: t(`types.${unit.typeSlug}.name`),
    },
    { section: "primary", name: "area", value: format.number(unit.area) },
    {
      section: "primary",
      name: "bedrooms",
      value: t(`features.bedrooms.${unit.bedrooms}`),
    },
    {
      section: "primary",
      name: "bathrooms",
      value: format.number(unit.bathrooms),
    },
    { section: "primary", name: "balcony", value: format.number(unit.balcony) },
    {
      section: "primary",
      name: "orientation",
      value: t(`types.${unit.typeSlug}.orientation`),
    },

    { section: "amenities", name: "parking", value: unit.parking ? yes : no },
    { section: "amenities", name: "storage", value: unit.storage ? yes : no },
    {
      section: "amenities",
      name: "evCharger",
      value: unit.evCharger ? yes : no,
    },
    {
      section: "amenities",
      name: "sprinkler",
      value: unit.sprinkler ? yes : no,
    },
    {
      section: "amenities",
      name: "fiberOptics",
      value: unit.fiberOptics ? yes : no,
    },

    {
      section: "complexAmenities",
      name: "roofGarden",
      value: unit.roofGarden ? yes : no,
    },
    {
      section: "complexAmenities",
      name: "reception",
      value: unit.reception ? yes : no,
    },
    { section: "complexAmenities", name: "cafe", value: unit.cafe ? yes : no },
    { section: "complexAmenities", name: "gym", value: unit.gym ? yes : no },
    {
      section: "complexAmenities",
      name: "eventHall",
      value: unit.eventHall ? yes : no,
    },
    {
      section: "complexAmenities",
      name: "childcare",
      value: unit.childcare ? yes : no,
    },
  ];

  // Map to translated names
  return featuresList.map((feat) => ({
    section: t(`features.sections.${feat.section}`),
    name: t(`features.names.${feat.name}`),
    value: feat.value,
  }));
};

export const getUnits = (t: T, format: F) => {
  const rawUnits = t.raw("units");
  const unitsData = safeArray(rawUnits);

  return unitsData.map((unit: any) => {
    // Prepare the video object if it exists
    const videoData = unit.video
      ? {
          ...unit.video,
          image: unit.video.image,
        }
      : null;

    return {
      ...unit,
      area: format.number(unit.areaValue),
      balcony: format.number(unit.balconyValue),

      images: safeArray(unit.images).map((img: any) => {
        // FIX: Use the name directly from the data object
        // Do NOT use t() here because the data is already localized in the JSON object
        const name = img.name;

        // If this is the 3D model, attach the video data to it
        if (img.slug === "3d" && videoData) {
          return {
            ...img,
            name,
            video: {
              ...videoData,
              image: videoData.image || img.image,
            },
          };
        }

        return { ...img, name };
      }),

      features: safeArray(unit.featureData).map((feat: any) => ({
        ...feat,
        value:
          typeof feat.value === "boolean"
            ? feat.value
              ? t("features.yes")
              : t("features.no")
            : feat.value,
      })),
    };
  });
};
