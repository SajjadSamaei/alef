"use client";
import { toast as sonnerToast } from "sonner";
import { useLocale } from "next-intl";
import { getDirection } from "@/utils/hooks/useDirection";
import { X } from "lucide-react"; // Optional close icon

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
type CustomToastProps = Omit<ToastProps, "id">;

/** * A fully custom toast with an action button.
 */
function ToastComponent(props: ToastProps) {
  const locale = useLocale();
  const direction = getDirection(locale);
  const { title, description, button, id } = props;

  return (
    <div
      dir={direction}
      className="flex w-full min-w-[320px] items-center gap-4 rounded-3xl border border-neutral-200 bg-white/90 p-4 shadow-2xl backdrop-blur-xl md:max-w-[400px] dark:border-white/10 dark:bg-neutral-900/90"
    >
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
          {title}
        </p>
        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => {
          button.onClick();
          sonnerToast.dismiss(id);
        }}
        className="shrink-0 rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {button.label}
      </button>

      {/* Optional Close X */}
      <button
        onClick={() => sonnerToast.dismiss(id)}
        className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/** * A simple informational toast.
 */
function SimpleToastComponent(props: SimpleToastProps) {
  const locale = useLocale();
  const direction = getDirection(locale);
  const { title, description } = props;

  return (
    <div
      dir={direction}
      className="flex w-full flex-col justify-center rounded-3xl border border-neutral-200 bg-white/90 px-6 py-4 shadow-xl backdrop-blur-xl md:max-w-[360px] dark:border-white/10 dark:bg-neutral-900/90"
    >
      <div className="flex items-center gap-3">
        {/* Optional: Add an icon here if you want (e.g. CheckCircle) */}
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
            {title}
          </p>
          {description && (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Exports ---

export function StyledToast(props: CustomToastProps) {
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
      className: "bg-transparent! border-none! shadow-none! p-0!",
    },
  );
}

export function StyledSimpleToast(props: CustomSimpleToastProps) {
  return sonnerToast.custom(
    (id) => (
      <SimpleToastComponent
        id={id}
        title={props.title}
        description={props.description}
      />
    ),
    {
      className: "bg-transparent! border-none! shadow-none! p-0!",
    },
  );
}
