import "./globals.css";
import { Vazirmatn, Inter } from "next/font/google";
import { clsx } from "clsx";
import {
  PlusGrid,
  PlusGridItem,
  PlusGridRow,
} from "@/components/chegall/radient/plus-grid"; // Adjust path
import { Gradient } from "@/components/chegall/radient/gradient"; // Adjust path
import { Container } from "@/components/chegall/studio/Container"; // Adjust path

// Initialize Fonts
const vazir = Vazirmatn({ subsets: ["arabic"], variable: "--font-vazir" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "404 — Page not found",
  description: "The requested page could not be found.",
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={clsx("h-full antialiased", vazir.variable, inter.variable)}
      suppressHydrationWarning
    >
      <body className="flex h-full flex-col bg-white">
        <main className="relative flex min-h-screen flex-col overflow-hidden">
          {/* 1. Background Gradient (Top) */}
          <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />

          {/* 2. Content Container */}
          <Container className="relative flex flex-1 flex-col justify-center">
            <PlusGrid className="h-full">
              <PlusGridRow className="h-full flex-1">
                {/* We use the PlusGridItem to frame the 404 message 
                   like a structural element.
                */}
                <div className="flex flex-col items-center justify-center py-24 text-center lg:py-48">
                  <PlusGridItem className="relative flex flex-col items-center p-8 sm:p-12">
                    {/* Architectural 404 Number */}
                    <p
                      className={clsx(
                        "font-display text-9xl font-bold tracking-tighter text-gray-950/10 sm:text-[12rem]",
                        inter.className,
                      )}
                    >
                      404
                    </p>

                    {/* Messages */}
                    <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 space-y-6">
                      <h1
                        className={clsx(
                          "font-display text-2xl font-medium tracking-tight text-gray-950 sm:text-4xl",
                          inter.className,
                        )}
                      >
                        Page not found
                        <span
                          className={clsx(
                            "font-vazir mt-1 block text-xl text-gray-500 sm:text-3xl",
                            vazir.className,
                          )}
                        >
                          صفحه مورد نظر یافت نشد
                        </span>
                      </h1>
                    </div>
                  </PlusGridItem>
                </div>
              </PlusGridRow>
            </PlusGrid>
          </Container>
        </main>
      </body>
    </html>
  );
}
