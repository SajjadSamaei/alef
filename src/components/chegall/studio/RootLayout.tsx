"use client";

import {
  useChegallContext,
  ChegallProvider,
} from "@/utils/providers/chegall/ChegallContext";
import { useEffect, useState } from "react";
import { usePathname } from "@/src/i18n/routing";
import { Toaster } from "@/components/ui/shadcn/sonner";

// --- Components ---
import { Navbar } from "@/components/chegall/radient/Navbar";
import { Footer } from "@/components/chegall/studio/Footer";
import { Container } from "@/components/chegall/studio/Container";

import {
  GradientBackground,
  Gradient,
} from "@/components/Layout/GradientBackground";

/* -------------------------------------------------------------------------- */
/* BROWSER CHECK LOGIC                                                        */
/* -------------------------------------------------------------------------- */
function BrowserCheck() {
  const {
    setUserAgent,
    setBrowser,
    setIsBrowserOld,
    isBrowserOld,
    setIsIOS,
    setIosVersion,
  } = useChegallContext();

  const [message, setMessage] = useState("");

  useEffect(() => {
    const userAgentString = window.navigator.userAgent;
    setUserAgent(userAgentString);
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgentString);
    setIsIOS(isIOSDevice);
  }, [setBrowser, setUserAgent, setIsIOS, setIosVersion, setIsBrowserOld]);

  return isBrowserOld ? (
    <div className="bg-red-600 p-2 text-center font-sans text-sm text-white">
      Update Browser Warning: {message}
    </div>
  ) : null;
}

/* -------------------------------------------------------------------------- */
/* ROOT LAYOUT INNER                                                          */
/* -------------------------------------------------------------------------- */

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const getVariant = () => {
    if (pathname.includes("/about") || pathname.includes("/contact"))
      return "about";

    if (pathname.includes("/projects") || pathname.includes("/case-studies"))
      return "projects";
    return "home"; // Default / Home
  };

  const currentVariant = getVariant();

  // --- 1. HOME PAGE LAYOUT ---
  if (isHomePage) {
    return (
      <>
        <BrowserCheck />
        <main className="w-full flex-auto overflow-hidden bg-white">
          {children}
        </main>
        <Toaster />
      </>
    );
  }

  // --- 2. INNER PAGE LAYOUT ---
  return (
    <>
      <BrowserCheck />
      <Toaster />

      {/* FIX FOR STICKY + OVERFLOW:
        1. We inject `overflow-x: clip` on html/body. This cuts off horizontal overflow 
           (like ribbons) without creating a scroll container that breaks 'sticky'.
        2. We removed all overflow classes from <main>.
      */}
      <style
        dangerouslySetInnerHTML={{ __html: `html, body { overflow-x: clip; }` }}
      />

      <main className="relative flex min-h-screen flex-col bg-white selection:bg-neutral-950 selection:text-white">
        {/* TOP HEADER SECTION */}
        <div className="relative z-10">
          {/* Background Gradient: Full width, flush to top */}
          {/* <Gradient className="absolute inset-x-0 top-0 bottom-0 h-full ring-1 ring-black/5 ring-inset" /> */}
          <Gradient
            variant={currentVariant}
            className="absolute inset-x-0 top-0 bottom-0 h-full ring-1 ring-black/5 ring-inset"
          />
          {/* Fade Effect */}
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-white to-transparent" />

          {/* Navbar Container: No top padding, matches Home Page */}
          <Container className="relative z-20 pb-8 sm:pb-12">
            <Navbar />
          </Container>
        </div>

        {/* Background Glow */}
        <GradientBackground variant={currentVariant} />

        {/* Page Content */}
        <div className="relative z-10 flex-auto">{children}</div>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN EXPORT                                                                */
/* -------------------------------------------------------------------------- */

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ChegallProvider>
      <RootLayoutInner key={pathname}>{children}</RootLayoutInner>
    </ChegallProvider>
  );
}
