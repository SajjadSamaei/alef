"use client";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export function JarounHeroDesktopImage() {
  const { scrollYProgress } = useScroll();

  // Transform scroll progress into a scale value
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.1]); // Scale from 1 to 0.8
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]); // Fade slightly as the image scales
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]); // Move the image up by 100px
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 5]); // Blur from 0px to 5px

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{ scale, opacity, y, filter: `blur(${blur}px)` }} // Add y for parallax
      transition={{
        type: "tween", // Use tween for fixed duration
        duration: 1, // Duration in seconds
        ease: "easeOut", // Easing function
      }}
    >
      <Image
        placeholder="blur"
        // priority={true}
        alt="Jaroun Project Exterior Design"
        src="https://storage.c2.liara.space/chegall/projects/jaroun/renders/exterior/jaroun-hero-lg.png"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AGlqe39/kJKUoaClrZueoba8vdbe2+Xu5unx6e727QBsa3iPkJuHiJBGRElIQ0ZjXFi+wLnz/PLu+e7y/O8AYGBjqq+4i4qNOzU6RD1CWE1Kp6ef3+Xb+P/0+P/0ACwsK4qQkJSUljUyOEM/Q19VUaqnodjc0sDHu2NkWwACAQAcHBxAPUE/PEEwKzBLQkGsrabe4teIiYElIhwAOC0jOjEqMCwsGRgaMSwuNCwslJOQfHlxLSokIyAaADEsJ1hUSzAtKBIQDjs2M1BLRzw5NQQFBBgXFRILAVa1XOzAlRFVAAAAAElFTkSuQmCC"
        width={1320}
        quality={100} // Set the largest image width
        height={880} // Adjust this height based on your aspect ratio
        className="hidden overflow-hidden rounded-4xl object-cover sm:block"
      />
    </motion.div>
  );
}
