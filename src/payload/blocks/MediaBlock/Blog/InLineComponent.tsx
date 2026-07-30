import type { StaticImageData } from "next/image";

import { cn } from "@/utils/cn";
import React from "react";
import RichText from "@/components/RichText/Caption";

import type { BlogMediaBlock as MediaBlockProps } from "@/src/payload-types";

import { ImageMedia } from "@/components/Blog/Media/BlogMedia/ImageMedia";

type Props = MediaBlockProps & {
  breakout?: boolean;
  captionClassName?: string;
  className?: string;
  enableGutter?: boolean;
  imgClassName?: string;
  staticImage?: StaticImageData;
  disableInnerContainer?: boolean;
};

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props;

  let caption;
  if (media && typeof media === "object") caption = media.caption;

  return (
    <div
      className={cn(
        "my-4",
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) && (
        <ImageMedia
          imgClassName={cn("border border-border rounded-[40px]", imgClassName)}
          resource={media}
          src={staticImage}
        />
      )}
      {caption && (
        <div
          className={cn(
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  );
};
