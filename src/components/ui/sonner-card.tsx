"use client";
import { toast as sonnerToast } from "sonner";
import { useLocale } from "next-intl";

// Define the props interface for the custom toast
interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  button: {
    label: string;
    onClick: () => void;
  };
}

interface SimpleToastProps {
  id: string | number;
  title: string;
  description?: string;
}

type CustomSimpleToastProps = Omit<SimpleToastProps, "id">;

// Define the props for the helper function, omitting 'id'
type CustomToastProps = Omit<ToastProps, "id">;

/** A fully custom toast that still maintains the animations and interactions. */
function ToastComponent(props: ToastProps) {
  const locale = useLocale();
  const direction = locale === "fa" ? "rtl" : "ltr";
  const { title, description, button, id } = props;

  return (
    <div
      dir={direction}
      className="bg-jarounBlack flex w-full flex-row-reverse items-center rounded-[40px] p-4 shadow-lg ring-1 md:max-w-[364px]"
    >
      <div className="flex flex-1 flex-row-reverse items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-neutral-200">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="ms-5 shrink-0">
        <button
          className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
          onClick={() => {
            button.onClick();
            sonnerToast.dismiss(id);
          }}
        >
          {button.label}
        </button>
      </div>
    </div>
  );
}

function SimpleToastComponent(props: SimpleToastProps) {
  const locale = useLocale();
  const direction = locale === "fa" ? "rtl" : "ltr";
  const { title, description } = props;

  return (
    <div
      dir={direction}
      className="bg-appleBackgorundGray/60 flex w-full items-center rounded-[40px] p-4 shadow-lg ring-1 ring-white/10 backdrop-blur-xl md:max-w-[364px]"
    >
      <div className="flex flex-row-reverse items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-neutral-200">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

/** * Export a helper function to easily trigger the custom toast.
 * This abstracts away the `toast.custom()` call.
 */
export function ChegallToast(props: CustomToastProps) {
  return sonnerToast.custom(
    (id) => (
      <ToastComponent
        id={id}
        title={props.title}
        description={props.description}
        button={{
          label: props.button.label,
          onClick: props.button.onClick,
        }}
      />
    ),
    {
      // 👇 Add these classes to the toast's wrapper
      className: "bg-transparent! border-none! shadow-none! p-0!",
    },
  );
}

export function ChegallSimpleToast(props: CustomSimpleToastProps) {
  return sonnerToast.custom(
    (id) => (
      <SimpleToastComponent
        id={id}
        title={props.title}
        description={props.description}
      />
    ),
    {
      // 👇 Add these classes to the toast's wrapper
      className: "!bg-transparent !border-none !shadow-none !p-0",
    },
  );
}
