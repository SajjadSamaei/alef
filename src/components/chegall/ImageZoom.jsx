"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/image";

const ImageZoom = ({
  src,
  alt,
  width,
  height,
  title = "",
  className,
  ...props
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div>
      {/* Add meta tag to disable Safari's default zoom behavior */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />

      {/* Initial Image */}
      <motion.div
        className="flex items-center justify-center"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          cursor: "pointer",
        }}
        onClick={handleZoom}
        layout
      >
        <Image
          {...props}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      </motion.div>

      {/* Zoomed Overlay */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleZoom}
          >
            <TransformWrapper
              initialScale={1}
              minScale={1} // Prevent zooming out too far
              maxScale={5} // Limit maximum zoom level
              limitToBounds={true} // Prevent image from moving out of frame
              initialPositionX={0} // Center the image horizontally
              initialPositionY={0} // Center the image vertically
              wheel={{ step: 0.1 }} // Adjust zoom speed for mouse wheel
              doubleClick={{ disabled: true }} // Disable double-tap-to-zoom
            >
              <div className="absolute top-10 right-1/2 translate-x-1/2">
                <span className="text-xs text-nowrap text-white md:text-sm">
                  {title}
                </span>
              </div>
              <TransformComponent
                wrapperStyle={{
                  width: "100vw",
                  height: "100vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  touchAction: "none", // Disable default touch behavior
                }}
                contentStyle={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={src}
                  alt={alt}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    touchAction: "none", // Disable default touch behavior
                    userSelect: "none", // Prevent text selection
                  }}
                />
              </TransformComponent>
            </TransformWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageZoom;
