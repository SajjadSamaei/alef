import React from "react";

import type { Props } from "./types";

import { ImageMedia } from "./ImageMedia";
import { VideoMedia } from "./VideoMedia";

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = "div", resource } = props;

  const isVideo =
    typeof resource === "object" && resource?.mimeType?.includes("video");

  // 1. Prepare the content that will be rendered inside the wrapper.
  const mediaContent = isVideo ? (
    <VideoMedia {...props} />
  ) : (
    <ImageMedia {...props} />
  );

  // 2. Use a simple conditional to render the correct wrapper.
  // This removes all ambiguity for TypeScript.
  if (htmlElement === null) {
    return <>{mediaContent}</>; // Use a Fragment when htmlElement is null
  }

  // If htmlElement is not null, we need to use React.createElement
  // to dynamically render a tag from a string variable.
  return React.createElement(htmlElement, { className }, mediaContent);
};
