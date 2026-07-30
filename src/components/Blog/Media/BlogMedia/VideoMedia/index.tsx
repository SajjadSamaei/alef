"use client";

import { cn } from "@/utils/cn";
import { getMediaUrl } from "@/payload/utilities/getMediaUrl";
import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import type { Props as MediaProps } from "../types";

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const [isPaused, setIsPaused] = useState(true);
  const { onClick, resource, videoClassName } = props;

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const { current: video } = videoRef;
    if (video) {
      video.addEventListener("suspend", () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      });
    }
  }, []);

  if (resource && typeof resource === "object") {
    const { filename } = resource;

    return (
      <div className="relative aspect-video h-auto xl:max-w-304 xl:overflow-hidden xl:rounded-3xl">
        <video
          autoPlay
          className={cn(videoClassName)}
          controls={false}
          loop
          muted
          onClick={onClick}
          playsInline
          ref={videoRef}
        >
          <source src={getMediaUrl(`${filename}`)} />
        </video>
        <div className="absolute right-4 bottom-4 rounded-full bg-black/40 p-2 shadow-md backdrop-blur-md">
          <button
            onClick={togglePlayPause}
            className="flex h-10 w-10 items-center justify-center text-white"
          >
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
        </div>
      </div>
    );
  }

  return null;
};
