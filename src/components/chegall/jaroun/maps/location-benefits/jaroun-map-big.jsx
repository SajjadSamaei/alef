"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DynamicMapLocation = dynamic(() => import("./jaroun-dynamic-map-big"), {
  ssr: false,
});

export default function LocationBenefitsMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Enable client-side rendering
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DynamicMapLocation />
    </div>
  );
}
