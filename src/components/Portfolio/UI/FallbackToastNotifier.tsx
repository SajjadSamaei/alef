"use client";

import { StyledSimpleToast } from "@/components/Blog/UI/Share/sonner-card"; // Adjust this path
import { useEffect } from "react";

type FallbackToastProps = {
  title: string;
  description: string;
};

// This key will be used to show the toast only once per browser session
const TOAST_SHOWN_KEY = "fallbackToastShown";

export function FallbackToastNotifier({
  title,
  description,
}: FallbackToastProps) {
  useEffect(() => {
    // Check if the toast has already been shown in this session
    const hasBeenShown = sessionStorage.getItem(TOAST_SHOWN_KEY);

    if (!hasBeenShown) {
      // Show the toast
      StyledSimpleToast({
        title: title,
        description: description,
      });

      // Mark it as shown for this session
      sessionStorage.setItem(TOAST_SHOWN_KEY, "true");
    }

    // We only want this effect to run once when the component props are available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description]);

  // This component does not render any visible UI
  return null;
}
