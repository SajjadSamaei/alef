"use client";

import { useState, useEffect, useRef } from "react";

export const useSticky = (ref, topOffset = 0) => {
  const [isSticky, setSticky] = useState(false);
  const observer = useRef(null);

  useEffect(() => {
    // We need to check if the ref is current. If not, we do nothing.
    if (!ref.current) return;

    // The observer fires when the target leaves the viewport.
    const observerCallback = ([entry]) => {
      // The element should be sticky when it's no longer fully visible
      // and its top is at or above the desired offset.
      const shouldBeSticky =
        !entry.isIntersecting || entry.boundingClientRect.top <= topOffset;
      setSticky(shouldBeSticky);
    };

    // Create a new IntersectionObserver with a root margin to handle the offset.
    observer.current = new IntersectionObserver(observerCallback, {
      rootMargin: `-${topOffset}px 0px 0px 0px`,
      threshold: 0, // The callback fires as soon as the element crosses the root margin.
    });

    // Observe the target element.
    observer.current.observe(ref.current);

    // Cleanup function.
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [topOffset, ref]);

  return isSticky;
};
