"use client";
import { useState, useEffect } from "react";
import { useChegallContext } from "@/utils/providers/chegall/ChegallContext";
import { getPlaceholderImage } from "@/utils/sharp/placeholderImages";
import clsx from "clsx";
export default function JarounLouvre({ src }) {
  const { isIOS } = useChegallContext();
  const [placeholder, setPlaceholder] = useState(""); // Store the placeholder
  const [loaded, setLoaded] = useState(false); // Track image load state

  useEffect(() => {
    const fetchPlaceholder = async () => {
      const { placeholder } = await getPlaceholderImage(src);
      setPlaceholder(placeholder);
    };

    fetchPlaceholder();
  }, [src]);

  // Preload the full-resolution image
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true); // Mark as loaded when full image is ready
  }, [src]);

  return (
    <div
      className={clsx(
        "inset-shadow-jarounGray7/30 h-[50vh] bg-cover bg-center bg-no-repeat inset-shadow-sm md:hidden",
        isIOS ? "bg-local" : "bg-fixed",
      )}
      // style={{
      //   backgroundImage: `url('${src}')`,
      // }}
      style={{
        backgroundImage: loaded ? `url('${src}')` : `url('${placeholder}')`, // Use placeholder until the image loads
        backgroundSize: loaded ? "cover" : "contain", // Ensure proper scaling
        transition: "background-image 0.3s ease-in-out", // Smooth transition
      }}
    ></div>
  );
}
