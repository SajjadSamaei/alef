import React from "react";
import {
  englishToPersianDigits,
  toIndiaDigits,
} from "@/utils/helpers/strings-numbers";

const defaultLabels = {
  plural: "اسناد",
  singular: "سند",
};

const defaultCollectionLabels = {
  posts: {
    plural: "مقالات",
    singular: "مقاله",
  },
};

export const PageRange: React.FC<{
  className?: string;
  collection?: keyof typeof defaultCollectionLabels;
  collectionLabels?: {
    plural?: string;
    singular?: string;
  };
  currentPage?: number;
  limit?: number;
  totalDocs?: number;
}> = (props) => {
  const {
    className,
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage,
    limit,
    totalDocs,
  } = props;

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1;
  if (totalDocs && indexStart > totalDocs) indexStart = 0;

  let indexEnd = (currentPage || 1) * (limit || 1);
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs;

  const { plural, singular } =
    collectionLabelsFromProps ||
    (collection ? defaultCollectionLabels[collection] : undefined) ||
    defaultLabels ||
    {};

  return (
    <div
      className={[className, "text-appletextgray font-base text-base"]
        .filter(Boolean)
        .join(" ")}
    >
      {(typeof totalDocs === "undefined" || totalDocs === 0) &&
        "Search produced no results."}
      {typeof totalDocs !== "undefined" &&
        totalDocs > 0 &&
        toIndiaDigits(
          `نمایش ${indexStart}${indexStart > 0 ? ` - ${indexEnd}` : ""} از ${totalDocs} ${
            totalDocs > 1 ? plural : singular
          }`,
        )}
    </div>
  );
};
