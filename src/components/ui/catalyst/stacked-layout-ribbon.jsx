"use client";

import * as Headless from "@headlessui/react";
import React, { useState, useEffect, useRef } from "react"; // Import useRef
import clsx from "clsx";
import { NavbarItem } from "./navbar";

// ... (OpenMenuIcon, CloseMenuIcon, MobileSidebar components remain the same)
function OpenMenuIcon() {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  );
}

function CloseMenuIcon() {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function MobileSidebar({ open, close, children }) {
  return (
    <Headless.Transition show={open}>
      <Headless.Dialog onClose={close} className="lg:hidden">
        <Headless.TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Headless.TransitionChild>
        <Headless.TransitionChild
          enter="ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Headless.DialogPanel className="fixed inset-y-0 right-0 w-full max-w-80 p-2 transition">
            <div
              dir="rtl"
              className="flex h-full flex-row-reverse rounded-lg bg-white shadow-2xs ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10"
            >
              <div className="-mb-3 px-4 pt-3">
                <Headless.CloseButton
                  as={NavbarItem}
                  aria-label="Close navigation"
                >
                  <CloseMenuIcon />
                </Headless.CloseButton>
              </div>
              {children}
            </div>
          </Headless.DialogPanel>
        </Headless.TransitionChild>
      </Headless.Dialog>
    </Headless.Transition>
  );
}

export function StackedLayout({ navbar, sidebar, ribbonMenu, children }) {
  // Added ribbonMenu prop
  const [showSidebar, setShowSidebar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollThreshold = 10;

  const headerRef = useRef(null);
  const ribbonRef = useRef(null);

  const [navbarHeight, setNavbarHeight] = useState(0);
  const [ribbonHeight, setRibbonHeight] = useState(0);
  const [isLgScreen, setIsLgScreen] = useState(false);

  // Detect LG screen size for accurate offset calculation
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateScreenSize = () => setIsLgScreen(mediaQuery.matches);
    updateScreenSize(); // Initial check
    mediaQuery.addEventListener("change", updateScreenSize);
    return () => mediaQuery.removeEventListener("change", updateScreenSize);
  }, []);

  // Scroll listener for navbar style changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  // Measure heights of navbar and ribbon for sticky positioning
  useEffect(() => {
    const calculateHeights = () => {
      let currentHeaderHeight = 0;
      if (headerRef.current) {
        currentHeaderHeight = headerRef.current.offsetHeight;
        setNavbarHeight(currentHeaderHeight);
      }
      if (ribbonMenu && ribbonRef.current) {
        setRibbonHeight(ribbonRef.current.offsetHeight);
      } else {
        setRibbonHeight(0);
      }
    };

    calculateHeights();
    // Re-calculate on window resize and when ribbonMenu presence changes
    window.addEventListener("resize", calculateHeights);
    return () => {
      window.removeEventListener("resize", calculateHeights);
    };
  }, [ribbonMenu, isScrolled, isLgScreen]); // Re-calc if isScrolled or isLgScreen changes, as this can affect header layout/height

  // Determine the actual top offset of the main navbar (0px or ~8px for lg:top-2)
  // lg:top-2 is 0.5rem, assuming 1rem = 16px, so 8px.
  const actualNavbarVisualOffsetPx = isLgScreen && !isScrolled ? 8 : 0;

  const ribbonStickyTopPx = actualNavbarVisualOffsetPx + navbarHeight;
  const mainContentPaddingTopPx = ribbonStickyTopPx + ribbonHeight;

  // Main Navbar classes (from previous refinement)
  const baseHeaderClasses = clsx(
    "sticky z-30 flex items-center w-full", // top is conditional
    "px-4",
    "bg-[#f6f8fc] dark:bg-zinc-900",
    "shadow-md ring-1 ring-zinc-950/5 dark:ring-white/10",
    "transition-all duration-300 ease-in-out",
    "lg:dark:bg-zinc-900/90 lg:dark:backdrop-blur-xs",
  );
  const headerClasses = clsx(baseHeaderClasses, {
    "top-0": !isLgScreen || isScrolled, // Default top-0 for mobile or when LG is scrolled
    "lg:top-2": isLgScreen && !isScrolled, // Special top-2 for LG initial state
    "lg:w-[calc(100%-1rem)] lg:left-0 lg:right-0 lg:mx-auto lg:rounded-[40px]":
      isLgScreen && !isScrolled,
    "lg:w-full lg:rounded-none": isLgScreen && isScrolled,
  });

  // Ribbon classes
  const ribbonWrapperClasses = clsx(
    "sticky z-20 w-full", // Sticks below navbar, full width
    // Add your desired ribbon background, padding, shadow etc.
    // "bg-slate-100 dark:bg-slate-700 shadow-md",
    "transition-all duration-300 ease-in-out", // For any transitions on the ribbon itself
  );

  return (
    <div
      dir="rtl"
      className="relative isolate flex min-h-svh w-full flex-col bg-[#f6f8fc] sm:bg-[#f6f8fc] md:bg-[#f6f8fc] lg:bg-[#eaf1fb] dark:bg-zinc-900 dark:lg:bg-zinc-950"
    >
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        {sidebar}
      </MobileSidebar>

      <header ref={headerRef} className={headerClasses}>
        <div className="py-2.5 lg:hidden">
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>

      {ribbonMenu && ( // Conditionally render the ribbon
        <div
          ref={ribbonRef}
          className={ribbonWrapperClasses}
          style={{ top: navbarHeight ? `${ribbonStickyTopPx}px` : "auto" }} // Dynamically set top for stickiness
        >
          {/* Apply padding inside the ribbon as needed */}
          <div className="px-4 py-2">{ribbonMenu}</div>
        </div>
      )}

      <main
        className={`flex flex-1 flex-col pb-2 lg:px-2`}
        // Apply dynamic padding-top using inline style
        style={{
          paddingTop: mainContentPaddingTopPx
            ? `${mainContentPaddingTopPx}px`
            : undefined,
        }}
      >
        <div className="grow lg:rounded-[40px] lg:bg-[#f6f8fc] lg:p-10 lg:shadow-md lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          <div className="mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
