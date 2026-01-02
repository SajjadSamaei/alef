"use client";
import { Button } from "@/components/ui/catalyst/button";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/solid";
import { ProfileCard } from "@/components/ui/profile/profile-card";

export const ProfilePopoverButton = () => (
  <Popover className="lg:relative">
    <PopoverButton as={Button} plain>
      <UserIcon />
    </PopoverButton>
    <PopoverPanel
      className="absolute bottom-0 left-0 z-10 mt-2 flex max-w-(--breakpoint-sm) origin-bottom-left translate-x-0 translate-y-full scale-95 px-4 transition data-closed:scale-95 data-enter:scale-100 data-closed:opacity-0 data-enter:opacity-100 data-enter:duration-200 data-leave:duration-150 data-enter:ease-out data-leave:ease-in lg:translate-x-[-25px]" /* Move slightly to the left on larger screens */
      style={{ maxWidth: "90vw" }} /* Ensure visibility on smaller screens */
    >
      <ProfileCard />
    </PopoverPanel>
  </Popover>
);
