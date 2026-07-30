import { Transition, Dialog } from "@headlessui/react";

export const SlideInModalLTR = ({ isOpen, onClose, children, className }) => (
  <Transition show={isOpen}>
    <Dialog onClose={onClose}>
      {/* Background overlay */}
      <Transition.Child
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/30" />
      </Transition.Child>

      {/* Sliding panel */}
      <Transition.Child
        enter="ease-in-out duration-300"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="ease-in-out duration-300"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <Dialog.Panel
          className={`fixed inset-x-0 bottom-0 h-full w-3/4 p-2 transition lg:w-1/4 ${className}`}
        >
          {children}
        </Dialog.Panel>
      </Transition.Child>
    </Dialog>
  </Transition>
);
