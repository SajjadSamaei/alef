"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import type { Props as MediaProps } from "../types";
import { FaPause, FaPlay } from "react-icons/fa";
import { getMediaUrl } from "@/payload/utilities/getMediaUrl";

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const [isPaused, setIsPaused] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const { onClick, resource, videoClassName } = props;

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
        setHasEnded(false); // Reset the ended flag
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  // const [showFallback] = useState<boolean>()

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
      <div className="relative aspect-video h-auto xl:max-w-[76rem] xl:overflow-hidden xl:rounded-3xl">
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
          {/* <source src={getMediaUrl(`/media/${filename}`)} /> */}
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

// export function AutoplayVideo({ url }) {
//   const sectionRef = useRef(null);
//   const videoRef = useRef(null);
//   const [isIntersecting, setIsIntersecting] = useState(false);
//   const [hasEnded, setHasEnded] = useState(false);
//   const [isPaused, setIsPaused] = useState(true);
//   const [videoSrc, setVideoSrc] = useState({
//     webm: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro.webm",
//     mp4: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro.mp4",
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1280) {
//         setVideoSrc({
//           webm: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro-xl.webm",
//           mp4: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro-xl.mp4",
//         });
//       } else {
//         setVideoSrc({
//           webm: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro.webm",
//           mp4: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro.mp4",
//         });
//       }
//     };

//     // Run on mount to set the initial video source
//     handleResize();

//     // Add resize listener
//     const debounceResize = debounce(handleResize, 200);
//     window.addEventListener("resize", debounceResize);

//     // Cleanup listener on unmount
//     return () => {
//       window.removeEventListener("resize", debounceResize);
//     };
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsIntersecting(entry.isIntersecting);
//       },
//       {
//         root: null, // Use the viewport
//         threshold: 0.5, // Trigger when 50% of the section is visible
//       },
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (videoRef.current) {
//       const handleEnded = () => {
//         setHasEnded(true);
//         setIsPaused(true); // Ensure the UI reflects the paused state
//       };

//       videoRef.current.addEventListener("ended", handleEnded);

//       return () => {
//         if (videoRef.current) {
//           videoRef.current.removeEventListener("ended", handleEnded);
//         }
//       };
//     }
//   }, []);

//   useEffect(() => {
//     if (isIntersecting && !hasEnded) {
//       videoRef.current?.play();
//       setIsPaused(false); // Autoplay when entering the viewport for the first time
//     } else if (!isIntersecting) {
//       videoRef.current?.pause();
//     }
//   }, [isIntersecting, hasEnded]);

//   const togglePlayPause = () => {
//     if (videoRef.current) {
//       if (videoRef.current.paused) {
//         videoRef.current.play();
//         setIsPaused(false);
//         setHasEnded(false); // Reset the ended flag
//       } else {
//         videoRef.current.pause();
//         setIsPaused(true);
//       }
//     }
//   };

//   return (
//     <section
//       ref={sectionRef}
//       className="relative flex h-[100vh] items-center justify-center xl:h-auto xl:pt-16"
//     >
//       <div
//         className={clsx(
//           "relative top-0 h-screen w-screen lg:aspect-video",
//           "xl:h-auto xl:max-w-[76rem] xl:overflow-hidden xl:rounded-3xl",
//         )}
//       >
//         <video
//           key={videoSrc.webm} // Force re-render on source change
//           ref={videoRef}
//           muted
//           playsInline
//           preload="auto"
//           className="h-full w-full object-cover"
//         >
//           <source src={videoSrc.webm} type="video/webm" />
//           <source src={videoSrc.mp4} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//         {/* Custom Controls */}
//         <div className="absolute right-4 bottom-4 rounded-full bg-black/40 p-2 shadow-md backdrop-blur-md">
//           <button
//             onClick={togglePlayPause}
//             className="flex h-10 w-10 items-center justify-center text-white"
//           >
//             {isPaused ? <FaPlay /> : <FaPause />}
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
