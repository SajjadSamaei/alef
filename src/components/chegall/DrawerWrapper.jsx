import * as Headless from "@headlessui/react"; // Ensure Headless UI is installed
import { XMarkIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useDirection } from "@/utils/hooks/useDirection";

export const DrawerWrapper = ({
  isOpen,
  onClose,
  children,
  bgColor = "bg-jarounGray7",
  closeBg = "bg-jarounVeryDark/40",
  closeIconColor = "text-jarounVeryLight",
  className,
}) => {
  const direction = useDirection();
  return (
    <Headless.Transition show={isOpen}>
      <Headless.Dialog onClose={onClose}>
        {/* Background Overlay */}
        <Headless.TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-xs" />
        </Headless.TransitionChild>

        {/* Drawer Panel */}
        <Headless.TransitionChild
          enter="ease-in-out duration-300"
          enterFrom="translate-y-full opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="translate-y-full opacity-0"
        >
          <Headless.DialogPanel className="fixed inset-x-0 bottom-0 mx-auto h-[calc(100dvh-3vh)] transition lg:h-[94vh] lg:w-[95vw]">
            <div
              dir={direction}
              className={clsx(
                "hide-scrollbar flex h-full flex-col overflow-hidden overflow-y-scroll rounded-t-[40px] shadow-lg",
                bgColor,
                className,
              )}
            >
              {/* Main Content */}

              <div className="sticky top-0 z-200 flex flex-row-reverse items-center justify-between p-4">
                <button
                  dir={direction}
                  className={clsx(
                    "mt-4 mb-4 ml-4 rounded-full p-2 backdrop-blur-md focus:outline-hidden",
                    closeBg,
                  )}
                  onClick={onClose}
                >
                  <XMarkIcon className={clsx("h-6 w-6", closeIconColor)} />
                </button>
              </div>
              <motion.div
                initial={{ y: 50, opacity: 0 }} // Start slightly below and transparent
                animate={{ y: 0, opacity: 1 }} // Slide up to original position and fade in
                transition={{ duration: 1, ease: "easeOut" }} // Smooth transition
              >
                {children}
              </motion.div>
              <div className="pt-16"></div>
            </div>
          </Headless.DialogPanel>
        </Headless.TransitionChild>
      </Headless.Dialog>
    </Headless.Transition>
  );
};
