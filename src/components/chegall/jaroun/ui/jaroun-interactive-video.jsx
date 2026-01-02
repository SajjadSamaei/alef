"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { SpinningVideoLoading } from "@/components/chegall/jaroun/ui/jaroun-loading";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useChegallContext } from "@/utils/providers/chegall/ChegallContext";
gsap.registerPlugin(ScrollTrigger);
import { FaPause, FaPlay } from "react-icons/fa";

export function IntroVideo() {
  const { isIOS } = useChegallContext();
  return isIOS ? <InteractiveVideo /> : <AutoplayVideo />;
}

export function SpinningUnit({ videoSource }) {
  const { isIOS } = useChegallContext();
  return isIOS ? (
    <SpinningUnitVideoIOS src={videoSource} />
  ) : (
    <SpinningUnitVideo src={videoSource} />
  );
}

export function InteractiveVideo() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(
    "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro.mp4",
  );
  const playbackProgress = useRef(0);
  const maxSpeed = 0.2;
  const minSpeed = 0.1;
  const easingFactor = 0.1;
  const rafId = useRef(null);

  // Initialize ScrollTrigger and video playback
  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure code runs only on the client

    const videoElement = videoRef.current;
    if (!videoElement) return;

    let scrollTriggerInstance;

    const updateVideoPlayback = () => {
      if (!scrollTriggerInstance) return;

      const targetProgress =
        scrollTriggerInstance.progress * (videoElement.duration || 4);

      // Compute delta with easing
      let progressDelta = Math.abs(targetProgress - playbackProgress.current);
      progressDelta = Math.max(Math.min(progressDelta, maxSpeed), minSpeed);

      playbackProgress.current +=
        (targetProgress - playbackProgress.current) * easingFactor;

      // Avoid jerking by snapping to nearest frame at low speeds
      if (progressDelta < 0.01) {
        playbackProgress.current =
          Math.round(playbackProgress.current * 30) / 30; // Assuming 30 FPS
      }

      videoElement.currentTime = playbackProgress.current;

      // Request the next frame
      rafId.current = requestAnimationFrame(updateVideoPlayback);
    };

    const initScrollTrigger = () => {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight}`,
        pin: true,
        scrub: true,
        onUpdate: () => {
          // Start the RAF loop
          if (!rafId.current) {
            rafId.current = requestAnimationFrame(updateVideoPlayback);
          }
        },
      });
    };

    // Preload and load the video
    videoElement.preload = "auto";
    videoElement.load();

    // Initialize ScrollTrigger after the video is loaded
    videoElement.onloadeddata = () => {
      ScrollTrigger.refresh();
      initScrollTrigger();
    };

    // Cleanup on unmount
    return () => {
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Update video source based on screen size
  // useEffect(() => {
  //   const updateVideoSource = () => {
  //     const newVideoSrc = window.matchMedia("(max-width: 1024px)").matches
  //       ? "/projects/jaroun/animations/intro.mp4" // For small screens
  //       : "/projects/jaroun/animations/intro-xl.mp4"; // For larger screens

  //     if (newVideoSrc !== videoSrc) {
  //       setVideoSrc(newVideoSrc);

  //       // Refresh ScrollTrigger after the video source changes
  //       if (videoRef.current) {
  //         videoRef.current.src = newVideoSrc;
  //         videoRef.current.load();
  //         videoRef.current.onloadeddata = () => {
  //           ScrollTrigger.refresh();
  //         };
  //       }
  //     }
  //   };

  //   // Call on mount
  //   updateVideoSource();

  //   // Add event listener for screen resize
  //   window.addEventListener("resize", updateVideoSource);

  //   // Cleanup on unmount
  //   return () => {
  //     window.removeEventListener("resize", updateVideoSource);
  //   };
  // }, [videoSrc]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100vh] items-center justify-center"
    >
      <div className="sticky top-0 h-screen w-screen">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          className="h-full w-full object-cover"
          data-idm="no"
          type="video/mp4"
        />
      </div>
    </section>
  );
}

// Debounce function to limit the frequency of function calls
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export function AutoplayVideo() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [videoSrc, setVideoSrc] = useState({
    webm: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro.webm",
    mp4: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro.mp4",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVideoSrc({
          webm: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro-xl.webm",
          mp4: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro-xl.mp4",
        });
      } else {
        setVideoSrc({
          webm: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro.webm",
          mp4: "https://storage.c2.liara.space/chegall/projects/jaroun/animations/intro.mp4",
        });
      }
    };

    // Run on mount to set the initial video source
    handleResize();

    // Add resize listener
    const debounceResize = debounce(handleResize, 200);
    window.addEventListener("resize", debounceResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", debounceResize);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        root: null, // Use the viewport
        threshold: 0.5, // Trigger when 50% of the section is visible
      },
    );

    const sectionNode = sectionRef.current;
    if (sectionNode) {
      observer.observe(sectionNode);
    }

    return () => {
      if (sectionNode) {
        observer.unobserve(sectionNode);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleEnded = () => {
        setHasEnded(true);
        setIsPaused(true); // Ensure the UI reflects the paused state
      };

      video.addEventListener("ended", handleEnded);

      return () => {
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  useEffect(() => {
    if (isIntersecting && !hasEnded) {
      videoRef.current?.play();
      setIsPaused(false); // Autoplay when entering the viewport for the first time
    } else if (!isIntersecting) {
      videoRef.current?.pause();
    }
  }, [isIntersecting, hasEnded]);

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

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100vh] items-center justify-center xl:h-auto xl:pt-16"
    >
      <div
        className={clsx(
          "relative top-0 h-screen w-screen lg:aspect-video",
          "xl:h-auto xl:max-w-[76rem] xl:overflow-hidden xl:rounded-3xl",
        )}
      >
        <video
          key={videoSrc.webm} // Force re-render on source change
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        >
          <source src={videoSrc.webm} type="video/webm" />
          <source src={videoSrc.mp4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Custom Controls */}
        <div className="absolute right-4 bottom-4 rounded-full bg-black/40 p-2 shadow-md backdrop-blur-md">
          <button
            onClick={togglePlayPause}
            className="flex h-10 w-10 items-center justify-center text-white"
          >
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
        </div>
      </div>
    </section>
  );
}

export function SpinningUnitVideo({ src }) {
  const [videoSrc] = useState({
    webm: src.webm,
    mp4: src.mp4,
    image: src.image,
    alt: src.name,
  });
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const velocity = useRef(0);
  const animation = useRef(null);
  const [isInteracted, setIsInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autoplayTimeout = useRef(null);
  const isHorizontalSwipe = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleError = () => {
      setIsLoading(false); // Stop loading if error occurs
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleLoadedData);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleLoadedData);
    };
  }, []);

  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    const handleTouchMove = (e) => {
      if (!isDragging.current) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startX.current);
      const deltaY = Math.abs(touch.clientY - startY.current);

      // Only prevent default if we've determined it's a horizontal swipe
      // or if we haven't determined direction yet but movement is significant
      if (!isHorizontalSwipe.current && deltaX > 5 && deltaY > 5) {
        // Determine if this is primarily horizontal (ratio of 2:1)
        isHorizontalSwipe.current = deltaX > deltaY * 2;
      }

      if (isHorizontalSwipe.current) {
        e.preventDefault();
        handleMove(touch.clientX, touch.clientY);
      }
    };

    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      container.removeEventListener("touchmove", handleTouchMove);
      if (autoplayTimeout.current) clearTimeout(autoplayTimeout.current);
      if (animation.current) animation.current.kill();
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !isInteracted) return;

    const video = videoRef.current;
    animation.current = gsap.to(video, {
      currentTime: video.currentTime,
      ease: "power3.out",
      paused: true,
      onUpdate: () => {
        if (video.currentTime >= video.duration) {
          video.currentTime = 0;
        } else if (video.currentTime < 0) {
          video.currentTime = video.duration;
        }
      },
    });

    return () => {
      if (animation.current) animation.current.kill();
    };
  }, [isInteracted]);

  const startAutoplayTimeout = () => {
    clearTimeout(autoplayTimeout.current);
    autoplayTimeout.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) return;
      videoRef.current?.play();
    }, 3000);
  };

  const handleStart = (clientX, clientY) => {
    if (!isInteracted) setIsInteracted(true);
    isDragging.current = true;
    startX.current = clientX;
    startY.current = clientY;
    startTime.current = videoRef.current.currentTime;
    velocity.current = 0;
    isHorizontalSwipe.current = false;

    if (animation.current) animation.current.pause();
    if (!videoRef.current.paused) videoRef.current.pause();
    clearTimeout(autoplayTimeout.current);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging.current || !videoRef.current) return;

    const deltaX = clientX - startX.current;
    const duration = videoRef.current.duration;
    const seekTime =
      startTime.current +
      (deltaX / videoContainerRef.current.offsetWidth) * duration;

    if (seekTime >= duration) {
      videoRef.current.currentTime = seekTime - duration;
    } else if (seekTime < 0) {
      videoRef.current.currentTime = duration + seekTime;
    } else {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleEnd = () => {
    if (!isDragging.current || !videoRef.current) return;
    isDragging.current = false;

    if (isHorizontalSwipe.current && animation.current) {
      animation.current.vars.currentTime =
        videoRef.current.currentTime + velocity.current * 100;
      animation.current.play();
    }

    isHorizontalSwipe.current = false;
    startAutoplayTimeout();
  };

  const handleMouseDown = (e) => handleStart(e.clientX, e.clientY);
  const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const handleMouseUp = () => handleEnd();

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  return (
    <div
      ref={videoContainerRef}
      id="spinning-video"
      className={clsx(
        "relative flex h-full w-full touch-none items-center justify-center",
        isDragging.current ? "cursor-grabbing" : "cursor-grab",
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: isInteracted ? "pan-y" : "none" }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 w-48 -translate-x-1/2 -translate-y-1/2 text-center md:w-64 lg:w-96 xl:w-36">
          <SpinningVideoLoading src={videoSrc.image} alt={videoSrc.alt} />
        </div>
      )}

      <video
        key={videoSrc.mp4}
        ref={videoRef}
        style={{ transform: "translateZ(0)" }}
        className="h-auto w-full max-w-2xl cursor-grab object-cover active:cursor-grabbing"
        loop
        muted
        playsInline
        preload="auto"
        autoPlay
      >
        <source src={videoSrc.webm} type="video/webm" />
        <source src={videoSrc.mp4} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export function SpinningUnitVideoIOS({ src }) {
  const [videoSrc] = useState({
    webm: src.webm,
    mp4: src.mp4,
    image: src.image,
    alt: src.name,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isInteracted, setIsInteracted] = useState(false);

  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const velocity = useRef(0);
  const animation = useRef(null);
  const autoplayTimeout = useRef(null);
  const isHorizontalSwipe = useRef(false);

  // --- Handlers ---
  // Define handlers before they are used in useEffect hooks.

  const handleStart = (clientX, clientY) => {
    if (!isInteracted) setIsInteracted(true);
    isDragging.current = true;
    startX.current = clientX;
    startY.current = clientY;
    startTime.current = videoRef.current.currentTime;
    velocity.current = 0;
    isHorizontalSwipe.current = false;

    if (animation.current) animation.current.pause();
    if (videoRef.current && !videoRef.current.paused) videoRef.current.pause();
    clearTimeout(autoplayTimeout.current);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging.current || !videoRef.current) return;

    if (!isHorizontalSwipe.current) {
      const deltaX = Math.abs(clientX - startX.current);
      const deltaY = Math.abs(clientY - startY.current);
      isHorizontalSwipe.current = deltaX > Math.max(5, deltaY * 1.5);
    }

    if (isHorizontalSwipe.current) {
      const deltaX = clientX - startX.current;
      const duration = videoRef.current.duration;
      let seekTime =
        startTime.current +
        (deltaX / videoContainerRef.current.offsetWidth) * duration;

      // Wrap the time around if it goes beyond the duration
      seekTime = ((seekTime % duration) + duration) % duration;
      videoRef.current.currentTime = seekTime;
    }
  };

  const startAutoplayTimeout = () => {
    clearTimeout(autoplayTimeout.current);
    autoplayTimeout.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) return;
      videoRef.current?.play();
    }, 3000);
  };

  const handleEnd = () => {
    if (!isDragging.current || !videoRef.current) return;
    isDragging.current = false;

    if (isHorizontalSwipe.current && animation.current) {
      animation.current.vars.currentTime =
        videoRef.current.currentTime + velocity.current * 50;
      animation.current.play();
    }

    isHorizontalSwipe.current = false;
    startAutoplayTimeout();
  };

  // Memoize handleTouchMove because it's a useEffect dependency
  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current) return;

    const touch = e.touches[0];
    // Prevent vertical page scroll only when a horizontal swipe is detected
    if (isHorizontalSwipe.current) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleMove(touch.clientX, touch.clientY);
    // Add an empty dependency array to ensure the function reference is stable
  }, []);

  // Mouse and Touch Event Handlers
  const handleMouseDown = (e) => handleStart(e.clientX, e.clientY);
  const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const handleMouseUp = () => handleEnd();
  const handleTouchStart = (e) =>
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchEnd = () => handleEnd();

  // --- Effects ---

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handleError = () => setIsLoading(false);

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleLoadedData);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleLoadedData);
    };
  }, []);

  // GSAP animation initialization
  useEffect(() => {
    if (!videoRef.current || !isInteracted) return;

    const video = videoRef.current;
    animation.current = gsap.to(video, {
      currentTime: video.currentTime,
      ease: "power3.out",
      paused: true,
      onUpdate: () => {
        // Ensure currentTime wraps around correctly
        if (video.currentTime >= video.duration) {
          video.currentTime = 0;
        } else if (video.currentTime < 0) {
          video.currentTime = video.duration - 0.01; // Subtract a small amount to avoid loop
        }
      },
    });

    return () => {
      if (animation.current) animation.current.kill();
    };
  }, [isInteracted]);

  // Touchmove listener and cleanup
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    // We pass { passive: false } to allow e.preventDefault() inside the handler
    const opts = { passive: false };
    container.addEventListener("touchmove", handleTouchMove, opts);

    return () => {
      container.removeEventListener("touchmove", handleTouchMove, opts);
      if (autoplayTimeout.current) clearTimeout(autoplayTimeout.current);
      if (animation.current) animation.current.kill();
    };
  }, [handleTouchMove]); // Now handleTouchMove is defined above

  return (
    <>
      <div
        ref={videoContainerRef}
        id="spinning-video-ios"
        className={clsx(
          "section-padding-xl relative flex h-full w-full touch-none items-center justify-center",
          isDragging.current ? "cursor-grabbing" : "cursor-grab",
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: "pan-y", // Allow vertical scroll, but we'll prevent it on horizontal swipe
          overscrollBehavior: "contain",
        }}
      >
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 w-48 -translate-x-1/2 -translate-y-1/2 text-center md:w-64 lg:w-96 xl:w-36">
            <SpinningVideoLoading src={videoSrc.image} alt={videoSrc.alt} />
          </div>
        )}

        <video
          key={videoSrc.mp4}
          ref={videoRef}
          style={{ transform: "translateZ(0)" }} // Promote to its own composite layer for smoother animation
          className="h-auto w-full max-w-2xl cursor-grab object-cover active:cursor-grabbing"
          loop
          muted
          playsInline
          preload="auto"
          autoPlay
        >
          <source src={videoSrc.mp4} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
}
