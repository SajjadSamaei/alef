"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChegallMap = dynamic(() => import("./chegall-location-map"), {
  ssr: false,
});

export default function ChegallLocationMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Enable client-side rendering
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ChegallMap />
    </div>
  );
}
