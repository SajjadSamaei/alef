"use client";

import React, {
  useState,
  useRef,
  useCallback,
  MouseEvent,
  TouchEvent,
} from "react";
import Image from "next/image";
import clsx from "clsx";

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  initialPosition?: number;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  beforeImage,
  afterImage,
  beforeAlt = "Before image",
  afterAlt = "After image",
  initialPosition = 50,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(initialPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  // We now use a ref for the outer container to calculate dimensions
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newPosition = ((clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, newPosition)));
    },
    [isDragging],
  );

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
  };

  const handleInteractionEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      handleMove(e.clientX);
    },
    [handleMove],
  );

  const handleTouchMove = useCallback(
    (e: globalThis.TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    },
    [handleMove],
  );

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", handleInteractionEnd);
      window.addEventListener("touchend", handleInteractionEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleInteractionEnd);
      window.removeEventListener("touchend", handleInteractionEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleInteractionEnd]);

  return (
    // FIX 2: Added a new outer div for positioning context.
    // The handle will be a sibling to the image container, not a child.
    <div dir="ltr" ref={containerRef} className="relative w-full select-none">
      {/* This container now only holds the images and clips them */}
      <div className="relative aspect-video overflow-hidden rounded-[40px]">
        {/* After Image (Bottom Layer) */}
        <Image
          src={afterImage}
          alt={afterAlt}
          fill
          priority
          className="object-cover"
        />

        {/* Before Image (Top Layer, clipped with polygon) */}
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            // FIX 1: Using polygon for more direct and reliable clipping.
            // This creates a rectangle from the left edge to the slider's position.
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          <Image
            src={beforeImage}
            alt={beforeAlt}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* FIX 2: The handle is now outside the overflow-hidden container.
          It's positioned absolutely relative to the new outer div.
      */}
      <div
        className="absolute inset-y-0 z-20 flex -translate-x-1/2 cursor-ew-resize items-center justify-center"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute inset-y-0 w-[3px] bg-white/80 shadow-lg backdrop-blur-xl" />
        <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 bg-white/80 shadow-xl backdrop-blur-xl transition-transform duration-200 hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5 -translate-x-0.5 transform text-slate-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5 translate-x-0.5 transform text-slate-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface BeforeAfterProps {
  beforeImage: string;
  beforeImageBlurData: string;
  afterImage: string;
  afterImageBlurData: string;
  beforeAlt?: string;
  afterAlt?: string;
  initialPosition?: number;
  aspect: string;
  className?: string;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  beforeImage,
  beforeImageBlurData,
  afterImage,
  afterImageBlurData,
  beforeAlt = "Before image",
  afterAlt = "After image",
  initialPosition = 50,
  aspect = "aspect-square",
  className,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(initialPosition);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  // We now use a ref for the outer container to calculate dimensions
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newPosition = ((clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, newPosition)));
    },
    [isDragging],
  );

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
  };

  const handleInteractionEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      handleMove(e.clientX);
    },
    [handleMove],
  );

  const handleTouchMove = useCallback(
    (e: globalThis.TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    },
    [handleMove],
  );

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", handleInteractionEnd);
      window.addEventListener("touchend", handleInteractionEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleInteractionEnd);
      window.removeEventListener("touchend", handleInteractionEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleInteractionEnd]);

  return (
    // FIX 2: Added a new outer div for positioning context.
    // The handle will be a sibling to the image container, not a child.
    <div
      dir="ltr"
      ref={containerRef}
      className={clsx(
        "relative w-full overflow-hidden rounded-[40px] select-none",
        className,
      )}
    >
      {/* This container now only holds the images and clips them */}
      <div className={clsx(aspect)}>
        {/* After Image (Bottom Layer) */}
        <Image
          src={afterImage}
          placeholder="blur"
          blurDataURL={afterImageBlurData}
          alt={afterAlt}
          fill
          priority
          className="object-cover"
        />

        {/* Before Image (Top Layer, clipped with polygon) */}
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            // FIX 1: Using polygon for more direct and reliable clipping.
            // This creates a rectangle from the left edge to the slider's position.
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          <Image
            src={beforeImage}
            alt={beforeAlt}
            placeholder="blur"
            blurDataURL={beforeImageBlurData}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* FIX 2: The handle is now outside the overflow-hidden container.
          It's positioned absolutely relative to the new outer div.
      */}
      <div
        className="absolute inset-y-0 z-20 flex -translate-x-1/2 cursor-ew-resize items-center justify-center"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute inset-y-0 w-[3px] bg-white/80 shadow-lg backdrop-blur-xl" />
        <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 bg-white/80 shadow-xl backdrop-blur-xl transition-transform duration-200 hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5 -translate-x-0.5 transform text-slate-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5 translate-x-0.5 transform text-slate-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
