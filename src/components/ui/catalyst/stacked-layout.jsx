"use client";

import * as Headless from "@headlessui/react";
import React, { useState } from "react";
import { NavbarItem } from "./navbar"; // Assuming NavbarItem is correctly imported
import clsx from "clsx";

function OpenMenuIcon() {
  return (
    <svg
      data-slot="icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-5 w-5"
    >
      {" "}
      {/* Ensure icons have a size */}
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
      {" "}
      {/* Ensure icons have a size */}
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function MobileSidebar({ open, close, children }) {
  return (
    <Headless.Transition show={open}>
      <Headless.Dialog onClose={close} className="lg:hidden">
        {" "}
        {/* Sidebar is also lg:hidden */}
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

export function StackedLayout({ navbar, sidebar, children }) {
  let [showSidebar, setShowSidebar] = useState(false);

  // Estimate mobile header height for main content padding-top.
  // If py-2.5 (0.625rem top/bottom) + icon height (e.g., h-5 = 1.25rem) = ~2.5rem.
  // pt-10 or pt-12 in Tailwind might be suitable (2.5rem or 3rem). Adjust as needed.
  const mobileHeaderHeightPadding = "pt-12"; // e.g., for a 3rem header height

  return (
    <div
      dir="rtl"
      className="relative isolate flex min-h-svh w-full flex-col bg-[#f6f8fc] sm:bg-[#f6f8fc] md:bg-[#f6f8fc] lg:bg-[#eaf1fb] dark:bg-zinc-900 dark:lg:bg-zinc-950"
    >
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        {sidebar}
      </MobileSidebar>

      {/* Navbar - MODIFIED FOR CONDITIONAL STICKINESS */}
      <header
        className={clsx(
          // Default (mobile): sticky, full-width, specific background, top-0
          "bg-googleLightGray/80 sticky top-2 right-2 left-2 z-30 flex w-[calc(100%-1rem)] items-center rounded-[40px] px-4 shadow-sm backdrop-blur-2xl dark:bg-zinc-900/80",
          // LG screens and up: revert to static positioning
          "lg:static lg:top-0 lg:right-0 lg:left-0 lg:w-full lg:rounded-none lg:bg-transparent lg:shadow-none lg:backdrop-blur-none lg:dark:bg-transparent",
          // You might want to adjust lg:px-0 or other specific desktop header styles here if needed)
        )}
      >
        <div className="py-2.5 lg:hidden">
          {" "}
          {/* This contains the hamburger menu */}
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>{" "}
        {/* Main navbar content */}
      </header>

      {/* Content - MODIFIED FOR CONDITIONAL PADDING-TOP */}
      <main
        className={
          "flex flex-1 flex-col pb-2 " +
          `${mobileHeaderHeightPadding} ` + // Padding for sticky mobile header
          "lg:px-2 lg:pt-0" // No specific top padding needed for static LG header, content flows naturally
        }
      >
        <div className="grow lg:rounded-lg lg:bg-[#f6f8fc] lg:p-10 lg:shadow-md lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          <div className="mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
