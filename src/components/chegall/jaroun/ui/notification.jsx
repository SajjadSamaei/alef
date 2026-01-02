import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";

export function Notification({ isPositive, message }) {
  const [show, setShow] = useState(true);
  let [isSucess, setIsSuccess] = useState(isPositive);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShow(false);
  //   }, 5000); // 5000ms = 5 seconds

  //   // Clean up the timer if the component is unmounted before the timer ends
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="ring-opacity-5 pointer-events-auto w-full max-w-sm overflow-hidden rounded-3xl bg-[#0a0a0a] shadow-lg ring-1 ring-black">
              <div className="p-4">
                <div className="flex items-center">
                  <div className="shrink-0 items-center">
                    {isSucess ? (
                      <CheckCircleIcon
                        className="h-6 w-6 text-[#16a34a]"
                        aria-hidden="true"
                      />
                    ) : (
                      <ExclamationTriangleIcon
                        className="text-red-[#dc2626] h-6 w-6"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="mr-3 flex w-0 flex-1 items-center pt-0.5">
                    <p className="sub-paragraph-style text-[#e2e8f0]">
                      {message}
                    </p>
                  </div>
                  <div className="mr-4 flex shrink-0">
                    <button
                      className="rounded-full bg-transparent p-2 focus:outline-hidden"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
