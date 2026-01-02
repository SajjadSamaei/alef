"use client";

import "./globals.css";
import { Vazirmatn, Inter } from "next/font/google";
import { clsx } from "clsx";
import {
  PlusGrid,
  PlusGridItem,
  PlusGridRow,
} from "@/components/chegall/radient/plus-grid"; // Adjust path
import { Gradient } from "@/components/chegall/radient/gradient"; // Adjust path
import { ButtonCustomColor } from "@/components/ui/button"; // Adjust path
import { Container } from "@/components/chegall/studio/Container"; // Adjust path
import { ArrowPathIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

// 1. Initialize Fonts with Variables
const vazir = Vazirmatn({ subsets: ["arabic"], variable: "--font-vazir" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Error — Something went wrong",
  description: "An unexpected error has occurred.",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html
      lang="en"
      className={clsx(
        "h-full antialiased",
        vazir.variable, // Apply Farsi Variable
        inter.variable, // Apply English Variable
      )}
      suppressHydrationWarning
    >
      <body className="font-inter flex h-full flex-col bg-white">
        <main className="relative flex min-h-screen flex-col overflow-hidden">
          {/* 1. Background Gradient (Top) */}
          <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />

          {/* 2. Content Container */}
          <Container className="relative flex flex-1 flex-col justify-center">
            <PlusGrid className="h-full">
              <PlusGridRow className="h-full flex-1">
                {/* Structural Grid Item */}
                <div className="flex flex-col items-center justify-center py-24 text-center lg:py-48">
                  <PlusGridItem className="relative flex flex-col items-center p-8 sm:p-12">
                    {/* Background Architectural Text */}
                    <p
                      className={clsx(
                        "font-display absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-bold tracking-tighter text-gray-950/5 select-none sm:text-[10rem] lg:text-[14rem]",
                        inter.className,
                      )}
                    >
                      Error
                    </p>

                    {/* Messages */}
                    <div className="relative z-10 space-y-6">
                      <h1
                        className={clsx(
                          "font-display text-3xl font-medium tracking-tight text-gray-950 sm:text-5xl",
                          inter.className,
                        )}
                      >
                        Something went wrong
                      </h1>

                      <p
                        className={clsx(
                          "font-vazir text-xl text-gray-500",
                          vazir.className,
                        )}
                      >
                        خطایی رخ داده است
                      </p>

                      <p
                        className={clsx(
                          "mx-auto max-w-md font-mono text-sm text-gray-400",
                          inter.className,
                        )}
                      >
                        Code: {error.digest || "Unknown"}
                      </p>
                    </div>
                  </PlusGridItem>

                  {/* Action Buttons */}
                  <div className="z-10 mt-12 flex flex-wrap items-center justify-center gap-4">
                    {/* Primary: Try Again */}
                    <ButtonCustomColor
                      onClick={() => reset()}
                      className="rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                    >
                      <span className="flex items-center gap-2">
                        <ArrowPathIcon className="h-4 w-4" />
                      </span>
                    </ButtonCustomColor>

                    {/* Secondary: Go Back */}
                    <ButtonCustomColor
                      onClick={() => window.history.back()}
                      className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 ring-1 ring-neutral-200 transition hover:bg-neutral-50"
                    >
                      <span className="flex items-center gap-2">
                        <ChevronLeftIcon className="h-4 w-4" />
                      </span>
                    </ButtonCustomColor>
                  </div>
                </div>
              </PlusGridRow>
            </PlusGrid>
          </Container>
        </main>
      </body>
    </html>
  );
}
