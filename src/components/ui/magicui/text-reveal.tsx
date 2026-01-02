// components/PinnedTextReveal.jsx

"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/utils/cn";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PinnedTextReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const triggerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Target the words with a class instead of a ref
      const words = gsap.utils.toArray(".reveal-word");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true, // Pin the entire trigger container
          scrub: 1,
          start: "top top",
          end: "+=300%",
        },
      });

      tl.to(words, {
        color: "#FAFAFA",
        stagger: 0.5,
      });
    }, triggerRef);

    return () => ctx.revert();
  }, [text]);

  const words = text.split(" ");

  return (
    // This outer container is the trigger and the element that gets pinned.
    // Its height is determined by the content inside.
    <div ref={triggerRef} className={cn(className)}>
      {/* This new inner div acts as a full-screen "stage."
        It is exactly the height of the screen and uses flexbox
        to perfectly center the text, regardless of the text's height.
      */}
      <div className="flex h-[100vh] items-center justify-center">
        <p className="flex max-w-4xl flex-wrap p-5 text-2xl leading-snug font-bold text-neutral-500 md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-6xl">
          {words.map((word, i) => (
            // We give the individual words a class for GSAP to target
            <span key={i} className="reveal-word mr-3">
              {word}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
