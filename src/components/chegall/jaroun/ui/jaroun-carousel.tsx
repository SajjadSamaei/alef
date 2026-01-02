"use client";
import { useState, useId, useEffect, useRef, ReactNode, Suspense } from "react";
import Image from "next/image";
import clsx from "clsx";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  PanInfo, // 1. Import PanInfo type
} from "framer-motion";
import { JarounFeatureCard } from "@/components/chegall/jaroun/sections/features/jaroun-features-card-wrapper";
import useMeasure from "react-use-measure";
import { Container } from "@/components/chegall/studio/Container";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl"; // 2. Import i18n hook

// --- (Static images and blur data remain the same) ---
const images = {
  /* ... */
};
const blurData = {
  /* ... */
};

// --- TYPE DEFINITIONS ---
// 3. Define types for props
interface SlideData {
  imageSrc: string;
  imageAlt: string;
  title: string;
  text: string;
}

interface CardProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  cardWidth?: string;
  cardHeight?: string;
  feature: { slug: string; image: string; name?: string }; // Basic shape
  imageWidth: number;
  imageHeight: number;
  titleType: number;
  bounds: any; // Type from useMeasure
  scrollX: any; // Type from framer-motion
}

interface CarouselProps {
  features: { slug: string; image: string; name?: string }[];
  imageWidth: number;
  imageHeight: number;
  titleType: number;
  cardWidth: string;
  cardHeight: string;
}

// 4. Localized Data Function
const getSlidesData = (t: ReturnType<typeof useTranslations>): SlideData[] => [
  {
    imageSrc: "/projects/jaroun/renders/interior/levels/levels-1.png",
    imageAlt: t("community.alt"),
    title: t("community.title"),
    text: t("community.description"),
  },
  {
    imageSrc: "/projects/jaroun/renders/interior/levels/levels-2.png",
    imageAlt: t("privacy.alt"),
    title: t("privacy.title"),
    text: t("privacy.description"),
  },
  {
    imageSrc: "/projects/jaroun/renders/interior/levels/skyline.png",
    imageAlt: t("skylight.alt"),
    title: t("skylight.title"),
    text: t("skylight.description"),
  },
];

// --- Card Component ---
function Card({
  cardWidth = "w-[100vw] md:w-[60vw] xl:w-[23vw]",
  cardHeight = "md:h-[60vh] ",
  feature,
  imageWidth,
  imageHeight,
  titleType,
  bounds,
  scrollX,
  ...props
}: CardProps) {
  const ref = useRef<HTMLDivElement>(null); // Type the ref

  return (
    <motion.div
      ref={ref}
      {...props}
      className={clsx([
        "relative flex shrink-0 snap-center flex-col justify-center overflow-y-hidden",
        cardWidth,
        cardHeight,
      ])}
    >
      <div className="relative mx-6" key={feature.slug}>
        <Image
          width={imageWidth}
          height={imageHeight}
          quality={100}
          alt={feature.name || "Feature Image"} // Add alt text
          src={feature.image}
          className="rounded-3xl object-cover object-center"
        />

        {feature.name && titleType === 1 && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-zinc-800/40 p-2 text-sm text-nowrap text-neutral-300 backdrop-blur-md focus:outline-hidden lg:-bottom-16 lg:text-base">
            {feature.name}
          </span>
        )}
        {feature.name && titleType === 2 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center justify-center">
            <span className="text-base text-neutral-800">{feature.name}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// --- Carousel Component ---
export function Carousel({
  features,
  imageWidth,
  imageHeight,
  titleType,
  cardWidth,
  cardHeight,
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null); // Type the ref
  const [setReferenceWindowRef, bounds] = useMeasure();
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations("Common"); // For aria-labels

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div ref={setReferenceWindowRef}>
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={scrollLeft}
          aria-label={t("scrollLeft")} // 5. Localized aria-label
          className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-zinc-800/40 p-2 shadow-lg backdrop-blur-md focus:outline-hidden"
        >
          <ChevronLeftIcon className="h-6 w-6 text-white" />
        </button>

        <button
          onClick={scrollRight}
          aria-label={t("scrollRight")} // 5. Localized aria-label
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-zinc-800/40 p-2 shadow-lg backdrop-blur-md focus:outline-hidden"
        >
          <ChevronRightIcon className="h-6 w-6 text-white" />
        </button>

        <div
          ref={scrollRef}
          className={clsx([
            "mx-auto flex",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth",
            "[--scroll-padding:max(--spacing(6),calc((100vw-(var(--container-2xl)))/2))] lg:[--scroll-padding:max(--spacing(8),calc((100vw-(var(--container-7xl)))/2))]",
          ])}
        >
          <Container>
            <div className="flex">
              {features.map((feature, featureIndex) => (
                <Card
                  bounds={bounds}
                  imageWidth={imageWidth}
                  imageHeight={imageHeight}
                  cardWidth={cardWidth}
                  cardHeight={cardHeight}
                  key={featureIndex}
                  feature={feature}
                  titleType={titleType}
                  scrollX={0} // This prop seems unused, but passing 0
                />
              ))}
            </div>
          </Container>
          <div className="w-[42rem] shrink-0 sm:w-[54rem]" />
        </div>
      </div>
    </div>
  );
}

// --- FeatureCards Component ---
export function FeatureCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const t = useTranslations("Project.Jaroun.FeatureCards"); // 6. Get translations

  // 7. Get localized slide data
  const slides = getSlidesData(t);

  const cardWidth = typeof window !== "undefined" ? window.innerWidth * 0.8 : 0;
  const offset = cardWidth * 0.1;

  // 8. Add types for PanInfo
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    const threshold = cardWidth / 4;

    if (offsetX > threshold || velocityX > 500) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    } else if (offsetX < -threshold || velocityX < -500) {
      setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
    }
  };

  useEffect(() => {
    controls.start({
      x: `-${currentIndex * (cardWidth + offset)}px`,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  }, [currentIndex, controls, cardWidth, offset]);

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="flex"
        drag="x"
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{
          width: slides.length * (cardWidth + offset),
          paddingLeft: `${offset}px`,
          paddingRight: `${offset}px`,
        }}
      >
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className="flex flex-none flex-col items-center justify-center"
            style={{
              width: `${cardWidth}px`,
              marginRight: `${offset}px`,
            }}
          >
            <div className="ring-jarounGray7 bg-jarounGray2 flex h-96 w-80 flex-col gap-2 overflow-hidden p-4 ring-1">
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                width={500}
                height={500}
              />
              <h2 className="text-2xl font-bold">{slide.title}</h2>
              <p className="text-lg">{slide.text}</p>
            </div>
            {/* ... (commented out JarounFeatureCard) ... */}
          </motion.div>
        ))}
      </motion.div>
      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={t("aria.goToSlide", { num: index + 1 })} // 9. Localized aria-label
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? "bg-gray-800" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

// // --- TestCarousel Component ---
// export const TestCarousel = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const t = useTranslations("Project.Jaroun.FeatureCards"); // 6. Get translations

//   // 7. Get localized slide data
//   const slides = getSlidesData(t);

//   const x = useMotionValue(0);
//   const xInput = [-100, 0, 100];
//   const background = useTransform(x, xInput, [
//     "linear-gradient(90deg, #ff008c 0%, rgb(211, 9, 225) 100%)",
//     "linear-gradient(90deg, #7700ff 0%, rgb(68, 0, 255) 100%)",
//     "linear-gradient(90deg, rgb(230, 255, 0) 0%, rgb(3, 209, 0) 100%)",
//   ]);

//   // 8. Add types for PanInfo
//   const handleDragEnd = (
//     event: MouseEvent | TouchEvent | PointerEvent,
//     info: PanInfo,
//   ) => {
//     const offset = info.offset.x;
//     const velocity = info.velocity.x;

//     if (Math.abs(velocity) > 500) {
//       setCurrentIndex((prev) =>
//         velocity > 0
//           ? Math.max(prev - 1, 0)
//           : Math.min(prev + 1, slides.length - 1),
//       );
//     } else if (Math.abs(offset) > 100) {
//       setCurrentIndex((prev) =>
//         offset > 0
//           ? Math.max(prev - 1, 0)
//           : Math.min(prev + 1, slides.length - 1),
//       );
//     }
//   };

//   return (
//     <div className="carousel-container">
//       {/* Carousel Track */}
//       <motion.div
//         className="carousel-track"
//         style={{ x }}
//         drag="x"
//         dragConstraints={{ left: 0, right: 0 }}
//         onDragEnd={handleDragEnd}
//       >
//         {slides.map((slide, index) => (
//           <motion.div
//             key={index}
//             className="carousel-slide inset-0 flex max-w-7xl flex-col items-center justify-center md:px-[5rem] lg:px-[8rem] xl:px-8"
//             style={{ background }}
//           >
//             <JarounFeatureCard
//               button="false"
//               imageSrc={slide.imageSrc}
//               imageAlt={slide.imageAlt}
//               title={slide.title}
//               text={slide.text}
//             />
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Pagination */}
//       <div className="carousel-pagination">
//         {slides.map((_, index) => (
//           <div
//             key={index}
//             className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
//             onClick={() => setCurrentIndex(index)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };
