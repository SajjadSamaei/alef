"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, Suspense } from "react";

const DynamicMap = dynamic(() => import("./jaroun-dynamic-map"), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
});

export default function JarounMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Enable client-side rendering
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {isClient && (
        <Suspense fallback={<div>Loading map...</div>}>
          <DynamicMap />
        </Suspense>
      )}
    </div>
  );
}
