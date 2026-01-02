import * as Headless from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export const DrawerWrapperTour = ({ isOpen, onClose, title, children }) => {
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
          <Headless.DialogPanel className="fixed inset-x-0 bottom-0 mx-auto h-[97vh] lg:h-[97vh] lg:w-[95vw]">
            <div
              dir="rtl"
              className="relative flex h-full flex-col overflow-hidden rounded-t-4xl bg-zinc-900 shadow-lg"
            >
              {/* Close Button */}
              <div className="absolute left-4 top-4 z-10">
                <button
                  dir="ltr"
                  className="rounded-full bg-zinc-800/40 p-2 backdrop-blur-md focus:outline-hidden"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
          </Headless.DialogPanel>
        </Headless.TransitionChild>
      </Headless.Dialog>
    </Headless.Transition>
  );
};
