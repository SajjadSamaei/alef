import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertActions,
} from "@/components/ui/catalyst/alert";
import { Button } from "@/components/ui/catalyst/button";

function Failed({ message, onClose }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Alert open={isOpen} onClose={handleClose} size="sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <ExclamationTriangleIcon
          className="h-8 w-8 text-red-600"
          aria-hidden="true"
        />
      </div>
      <AlertTitle className="mt-2 flex justify-center" dir="rtl">
        مشکلی پیش آمد
      </AlertTitle>
      <AlertDescription className="mt-2 flex justify-center" dir="rtl">
        {message}
      </AlertDescription>

      <AlertActions>
        <Button onClick={handleClose}>متوجه شدم</Button>
      </AlertActions>
    </Alert>
  );
}

export default Failed;
