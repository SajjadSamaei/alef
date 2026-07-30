"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ProjectMap = dynamic(() => import("./project-location-map"), {
  ssr: false,
});

export default function ProjectLocation({ location }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Enable client-side rendering
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  if (!location) {
    return null; // or a loading state
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ProjectMap latitude={location.latitude} longitude={location.longitude} />
    </div>
  );
}
