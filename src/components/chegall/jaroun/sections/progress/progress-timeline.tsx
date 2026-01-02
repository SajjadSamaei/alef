"use client";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useTranslations, useLocale } from "next-intl"; // 1. Import hooks
import { useDirection } from "@/utils/hooks/useDirection";

// 2. Define the prop types
interface TimelineEvent {
  name: string;
  description: string;
  date: string;
  dateTime: string;
  status: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const t = useTranslations("Project.Jaroun.Progress"); // 3. Get translations
  const direction = useDirection();

  return (
    <div className="relative mx-auto lg:max-w-5xl lg:px-4">
      {/* Vertical timeline line */}
      <div
        className={clsx(
          "bg-jarounGray1/90 absolute left-1/2 w-1 -translate-x-1/2",
          "top-[1.5rem] bottom-[1.5rem]",
        )}
        style={{
          height: `calc(100% - 3rem)`,
        }}
      ></div>

      {/* Timeline items */}
      <div className="space-y-8">
        {events.map((event, index) => {
          // 5. Use direction for left/right logic
          const isLeft =
            direction === "ltr" ? index % 2 === 0 : index % 2 !== 0;
          const isFirst = index === 0;
          const isLast = index === events.length - 1;

          return (
            <motion.div
              key={index}
              className={clsx(
                "relative flex flex-col items-center lg:flex-row",
                isLeft ? "lg:justify-end" : "lg:justify-start",
              )}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Connecting Circle */}
              <div
                className={clsx(
                  "border-jarounGray1 bg-jarounTitleDark absolute h-6 w-6 rounded-full border-4 shadow-lg",
                  "sm:translate-y-1/2",
                  // 6. Use logical properties for positioning
                  "start-1/2 right-[calc(50%-0.75rem)] -translate-x-1/2",
                )}
              >
                <span
                  className={clsx(
                    "text-jarounTitleDark absolute text-sm text-nowrap",
                    // 7. Use logical properties for positioning
                    isLeft
                      ? "-ml-15 -translate-x-1/2"
                      : "-mr-15 translate-x-1/2",
                    isFirst && "hidden lg:block",
                  )}
                >
                  {event.date}
                </span>
                <span
                  className={clsx(
                    "text-jarounTitleDark absolute text-sm font-semibold text-nowrap sm:text-center sm:text-wrap",
                    event.status !== "current" && "hidden",
                    // 8. Use logical properties for positioning
                    event.status === "current" && isLeft
                      ? "-mr-15 translate-x-1/2"
                      : "-ml-15 -translate-x-1/2",
                  )}
                >
                  {t("currentStatus")}
                </span>
                <div
                  className={clsx(
                    isFirst
                      ? "absolute -top-20 left-1/2 flex -translate-x-1/2 flex-col items-center justify-center gap-4"
                      : "hidden",
                  )}
                >
                  <div className="ring-jarounBlack/5 bg-jarounGreen flex items-center justify-center rounded-4xl px-3 py-2 shadow-2xs ring-1">
                    <span className="text-jarounSuperLight text-center text-sm font-semibold">
                      {t("startLabel")}
                    </span>
                  </div>
                  <span
                    className={clsx(
                      "text-jarounTitleDark text-sm text-nowrap lg:hidden",
                      isLeft
                        ? "-ml-15 -translate-x-1/2"
                        : "-mr-15 translate-x-1/2",
                    )}
                  >
                    {event.date}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div
                className={clsx(
                  "relative mx-4 mt-8 rounded-3xl p-6 shadow-lg md:w-[28rem] lg:w-96",
                  isLeft ? "lg:-mr-2" : "lg:-ml-2", // 9. Use logical margin
                  isFirst && "mt-0",
                  isLast && "mb-0",
                  event.status === "completed" && "bg-jarounGray1",
                  event.status === "current" && "bg-jarounCard",
                  event.status === "pending" && "bg-jarounGray1",
                )}
                style={{ maxWidth: "100%" }}
              >
                <h3 className="text-center text-lg font-semibold text-gray-800 lg:text-start">
                  {event.name}
                </h3>
                <p className="mt-2 text-center text-sm leading-5 text-pretty text-gray-600 lg:text-start">
                  {event.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
