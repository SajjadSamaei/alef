"use client";
import { useState } from "react";
import { DialogWrapper } from "@/components/ui/dialog-wrapper";
import { Dropdown, DropdownButton } from "@/components/ui/catalyst/dropdown";
import { Badge } from "@/components/ui/catalyst/badge";
import { DrawerWrapperTour } from "@/components/chegall/drawer-wrapper-tour";

export default function VirtualTourWrapper({ children }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <Dropdown>
        <DropdownButton
          onClick={() => {
            setIsDialogOpen(true);
          }}
          plain
        >
          <Badge color="cyan">دیدن تور مجازی</Badge>
        </DropdownButton>
      </Dropdown>

      {/* <DialogWrapper
        size="4xl"
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="تور مجازی"
        // description="برای دیدن تور مجازی ساختمان جارون، یکی از اتاق‌های زیر را انتخاب کنید."
      >
        {children}
      </DialogWrapper> */}
      {/* Design Info */}
      <DrawerWrapperTour
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
        {/* <div className="pt-12"></div> */}
      </DrawerWrapperTour>
    </>
  );
}
