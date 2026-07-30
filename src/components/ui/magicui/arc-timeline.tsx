"use client";

import {
  ComponentPropsWithoutRef,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDrag } from "@use-gesture/react";
import { cn } from "@/utils/cn"; // Assuming you have a utility for classnames
import {
  englishToPersianDigits,
  toIndiaDigits,
} from "@/utils/helpers/strings-numbers"; // Assuming you have this utility
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useLocale } from "next-intl";

export interface ArcTimelineItem {
  time: ReactNode;
  steps: Array<{
    icon: ReactNode;
    content: ReactNode;
  }>;
}

interface ArcTimelineProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * The data of the arc timeline
   */
  data: ArcTimelineItem[];
  /**
   * The configuration of the arc timeline
   */
  arcConfig?: {
    /**
     * The width of the circle, default is 5000
     */
    circleWidth?: number;
    /**
     * The angle between minor steps, default is 0.35
     */
    angleBetweenMinorSteps?: number;
    /**
     * The number of lines to fill between steps, default is 10
     */
    lineCountFillBetweenSteps?: number;
    /**
     * The number of lines to fill in before the first step and after the last step
     */
    boundaryPlaceholderLinesCount?: number;
  };
  /**
   * The default active step
   */
  defaultActiveStep?: {
    /**
     * The time of the default active step
     */
    time?: string;
    /**
     * The index of the default active step
     */
    stepIndex?: number;
  };
}

export function ArcTimeline(props: ArcTimelineProps) {
  const locale = useLocale();
  const {
    className,
    data,
    arcConfig = {},
    defaultActiveStep = {},
    ...restProps
  } = props;

  const {
    circleWidth = 5000,
    angleBetweenMinorSteps = 0.35,
    lineCountFillBetweenSteps = 10,
    boundaryPlaceholderLinesCount = 50,
  } = arcConfig;

  // Flatten the steps for easier navigation and state management
  const flatSteps = useMemo(() => {
    const steps: Array<{
      icon: ReactNode;
      content: ReactNode;
      lineIndex: number;
      stepIndex: number;
      time: ReactNode;
      angle: number;
    }> = [];
    let cumulativeStepCount = 0;
    for (let lineIndex = 0; lineIndex < data.length; lineIndex++) {
      const line = data[lineIndex];
      for (let stepIndex = 0; stepIndex < line.steps.length; stepIndex++) {
        const step = line.steps[stepIndex];
        const angle =
          angleBetweenMinorSteps *
            (lineCountFillBetweenSteps + 1) *
            (cumulativeStepCount + stepIndex) +
          angleBetweenMinorSteps * boundaryPlaceholderLinesCount;
        steps.push({
          ...step,
          lineIndex,
          stepIndex,
          time: line.time,
          angle,
        });
      }
      cumulativeStepCount += line.steps.length;
    }
    return steps;
  }, [
    data,
    angleBetweenMinorSteps,
    lineCountFillBetweenSteps,
    boundaryPlaceholderLinesCount,
  ]);

  // State to track the index of the active step in the flattened array
  const [activeStepIndex, setActiveStepIndex] = useState(() => {
    const {
      time: defaultActiveTime = data[0]?.time,
      stepIndex: defaultActiveStepIndex = 0,
    } = defaultActiveStep || {};

    const initialIndex = flatSteps.findIndex(
      (step) =>
        step.time === defaultActiveTime &&
        step.stepIndex === defaultActiveStepIndex,
    );
    return initialIndex !== -1 ? initialIndex : 0;
  });

  // State for the rotation of the circle container
  const [circleContainerRotateDeg, setCircleContainerRotateDeg] = useState(0);

  // Effect to update the rotation whenever the active step changes

  useEffect(() => {
    if (flatSteps[activeStepIndex]) {
      const newAngle = flatSteps[activeStepIndex].angle;
      requestAnimationFrame(() => setCircleContainerRotateDeg(-1 * newAngle));
    }
  }, [activeStepIndex, flatSteps]);

  // Navigation functions
  const handleNext = () => {
    setActiveStepIndex((prevIndex) =>
      Math.min(prevIndex + 1, flatSteps.length - 1),
    );
  };

  const handlePrev = () => {
    setActiveStepIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  // Set up the drag/swipe gesture
  const bind = useDrag(
    ({ last, movement: [mx] }) => {
      if (last) {
        const swipeThreshold = 50; // Minimum pixels to be considered a swipe
        if (mx < -swipeThreshold) {
          handleNext(); // Swiped left
        } else if (mx > swipeThreshold) {
          handlePrev(); // Swiped right
        }
      }
    },
    { axis: "x", filterTaps: true },
  );

  const isAtStart = activeStepIndex === 0;
  const isAtEnd = activeStepIndex === flatSteps.length - 1;

  let currentFlatIndex = 0;

  return (
    <div className={cn("relative w-full", className)}>
      <div
        {...bind()}
        {...restProps}
        className="relative h-[25rem] w-full cursor-grab overflow-hidden active:cursor-grabbing sm:h-[22rem]"
        style={{ touchAction: "pan-y" }}
      >
        <div
          style={{
            transform: `translateX(-50%) rotate(${circleContainerRotateDeg}deg)`,
            width: `${circleWidth}px`,
          }}
          className="absolute top-28 left-1/2 aspect-square origin-center rounded-full transition-transform duration-500 ease-in-out"
        >
          {data.map((line, lineIndex) => {
            return (
              <div key={`${lineIndex}`}>
                {line.steps.map((step, stepIndex) => {
                  const flatIndex = currentFlatIndex;
                  currentFlatIndex++; // Increment for the next iteration

                  const angle = flatSteps[flatIndex]?.angle ?? 0;
                  const isLastStep =
                    lineIndex === data.length - 1 &&
                    stepIndex === line.steps.length - 1;
                  const isFirstStep = lineIndex === 0 && stepIndex === 0;
                  const isActive = activeStepIndex === flatIndex;

                  return (
                    <div key={`${lineIndex}-${stepIndex}`}>
                      {isFirstStep && (
                        <PlaceholderLines
                          isFirstStep={true}
                          isLastStep={false}
                          angle={angle}
                          angleBetweenMinorSteps={angleBetweenMinorSteps}
                          lineCountFillBetweenSteps={lineCountFillBetweenSteps}
                          boundaryPlaceholderLinesCount={
                            boundaryPlaceholderLinesCount
                          }
                          lineIndex={lineIndex}
                          stepIndex={stepIndex}
                          circleWidth={circleWidth}
                          circleContainerRotateDeg={circleContainerRotateDeg}
                        />
                      )}
                      <div
                        className={cn(
                          "absolute top-0 left-1/2 -translate-x-1/2 cursor-pointer transition-all duration-200",
                          isActive ? "h-[120px] w-[2px]" : "h-16 w-[1.5px]",
                        )}
                        style={{
                          transformOrigin: `50% ${circleWidth / 2}px`,
                          transform: `rotate(${angle}deg)`,
                        }}
                        onClick={() => {
                          setActiveStepIndex(flatIndex);
                        }}
                      >
                        <div
                          className={cn(
                            "h-full w-full transition-colors duration-200",
                            isActive
                              ? "bg-[var(--step-line-active-color,#888888)] dark:bg-[var(--step-line-active-color,#9780ff)]"
                              : "bg-[var(--step-line-inactive-color,#b1b1b1)] dark:bg-[var(--step-line-inactive-color,#737373)]",
                          )}
                          style={{
                            transformOrigin: "center top",
                            transform: `rotate(${
                              -1 * angle - circleContainerRotateDeg
                            }deg)`,
                          }}
                        >
                          <div
                            className={cn(
                              "absolute bottom-0 left-1/2 aspect-square -translate-x-1/2",
                              isActive
                                ? "translate-y-[calc(100%_+_14px)] scale-[1.2] text-[var(--icon-active-color,#555555)] dark:text-[var(--icon-active-color,#d4d4d4)]"
                                : "translate-y-[calc(100%_+_4px)] scale-100 text-[var(--icon-inactive-color,#a3a3a3)] dark:text-[var(--icon-inactive-color,#a3a3a3)]",
                            )}
                          >
                            {step.icon}
                          </div>
                          <p
                            className={cn(
                              "absolute -bottom-4 left-1/2 line-clamp-3 flex w-[240px] -translate-x-1/2 translate-y-[calc(100%_+_42px)] items-center justify-center text-center text-sm transition-opacity duration-300 ease-in",
                              "text-white dark:text-[var(--description-color,#d4d4d4)]",
                              isActive ? "opacity-100" : "opacity-0",
                            )}
                          >
                            {locale === "en"
                              ? step.content
                              : toIndiaDigits(step.content)}
                          </p>
                        </div>
                        {stepIndex === 0 && (
                          <div
                            className={cn(
                              "absolute top-0 left-1/2 z-10 -translate-x-1/2 translate-y-[calc(-100%-24px)] whitespace-nowrap",
                              isActive
                                ? "text-white dark:text-[var(--time-active-color,#d4d4d4)]"
                                : "text-white/50 dark:text-[var(--time-inactive-color,#a3a3a3)]",
                            )}
                          >
                            {locale === "en"
                              ? line.time
                              : englishToPersianDigits(line.time)}
                          </div>
                        )}
                      </div>
                      <PlaceholderLines
                        isFirstStep={false}
                        isLastStep={isLastStep}
                        angle={angle}
                        angleBetweenMinorSteps={angleBetweenMinorSteps}
                        lineCountFillBetweenSteps={lineCountFillBetweenSteps}
                        boundaryPlaceholderLinesCount={
                          boundaryPlaceholderLinesCount
                        }
                        lineIndex={lineIndex}
                        stepIndex={stepIndex}
                        circleWidth={circleWidth}
                        circleContainerRotateDeg={circleContainerRotateDeg}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div
        dir="ltr"
        className="bg-appleTextBlack absolute bottom-0 left-4/5 z-20 flex -translate-x-1/2 transform justify-center gap-4 overflow-hidden rounded-full px-2 py-1 sm:left-9/10"
      >
        <button
          onClick={handlePrev}
          disabled={isAtStart}
          className="hover:bg-appletextgray/30 rounded-full p-2 text-sm font-medium text-white backdrop-blur-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <button
          onClick={handleNext}
          disabled={isAtEnd}
          className="hover:bg-appletextgray/30 rounded-full p-2 text-sm font-medium text-white backdrop-blur-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface PlaceholderLinesProps {
  isFirstStep: boolean;
  angleBetweenMinorSteps: number;
  angle: number;
  lineCountFillBetweenSteps: number;
  boundaryPlaceholderLinesCount: number;
  isLastStep: boolean;
  lineIndex: number;
  stepIndex: number;
  circleWidth: number;
  circleContainerRotateDeg: number;
}
function PlaceholderLines(props: PlaceholderLinesProps) {
  const {
    isFirstStep,
    isLastStep,
    angle,
    angleBetweenMinorSteps,
    lineCountFillBetweenSteps,
    boundaryPlaceholderLinesCount,
    lineIndex,
    stepIndex,
    circleWidth,
    circleContainerRotateDeg,
  } = props;

  const getAngle = (index: number) => {
    if (isFirstStep) {
      return index * angleBetweenMinorSteps;
    } else {
      return angle + (index + 1) * angleBetweenMinorSteps;
    }
  };

  return (
    <>
      {Array(
        isLastStep || isFirstStep
          ? boundaryPlaceholderLinesCount
          : lineCountFillBetweenSteps,
      )
        .fill("")
        .map((_, fillIndex) => {
          const fillAngle = getAngle(fillIndex);
          return (
            <div
              key={`${lineIndex}-${stepIndex}-${fillIndex}`}
              className="absolute top-0 left-1/2 h-[34px] w-[1px] -translate-x-1/2"
              style={{
                transformOrigin: `50% ${circleWidth / 2}px`,
                transform: `rotate(${fillAngle}deg)`,
              }}
            >
              <div
                className="h-full w-full bg-[var(--placeholder-line-color,#a1a1a1)] dark:bg-[var(--placeholder-line-color,#737373)]"
                style={{
                  transformOrigin: "center top",
                  transform: `rotate(${
                    -1 * fillAngle - circleContainerRotateDeg
                  }deg)`,
                }}
              ></div>
            </div>
          );
        })}
    </>
  );
}
