import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";

import classes from "./index.module.scss";

const icons = {
  add: PlusIcon,
  close: XMarkIcon,
};

type IconType = "add" | "close";

interface CircleIconButtonProps {
  className?: string;
  icon?: IconType;
  label: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export const CircleIconButton: React.FC<CircleIconButtonProps> = ({
  className,
  icon = "add",
  label,
  onClick,
  children,
}) => {
  const Icon = icons[icon];

  return (
    <button
      className={[classes.button, className].filter(Boolean).join(" ")}
      onClick={onClick}
      type="button"
    >
      <div className={classes.iconWrapper}>
        {Icon && <Icon className="h-24" />}
      </div>
      <span className={classes.label}>{label}</span>
    </button>
  );
};
