import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/catalyst/dialog";
import { Button } from "@/components/ui/catalyst/button";
import { XMarkIcon } from "@heroicons/react/24/solid";

export const DialogWrapper = ({
  size = "md",
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  titleSuffix = "",
}) => (
  <Dialog size={size} open={isOpen} onClose={onClose}>
    <div className="flex flex-row-reverse items-center justify-between">
      <DialogTitle dir="rtl">
        {title} {titleSuffix}
      </DialogTitle>
      <Button plain onClick={onClose}>
        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
    {description && (
      <DialogDescription dir="rtl">{description}</DialogDescription>
    )}
    <DialogBody dir="rtl">{children}</DialogBody>
    {actions && <DialogActions>{actions}</DialogActions>}
  </Dialog>
);
