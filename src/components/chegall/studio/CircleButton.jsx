import Link from "next/link";
import clsx from "clsx";

export function CircleButton({
  bgColor = "bg-white",
  hoverBgColor = "hover:bg-neutral-200",
  outlineColor = "outline-neutral-950",
  outline = false,
  className,
  children,
  ...props
}) {
  className = clsx(
    className,
    "inline-flex rounded-full px-2 py-2 text-sm font-semibold transition",
    bgColor,
    hoverBgColor,
    outline ? outlineColor : "",
  );

  let inner = <span className="relative top-px">{children}</span>;

  if (typeof props.href === "undefined") {
    return (
      <button className={className} {...props}>
        {inner}
      </button>
    );
  }

  return (
    <Link className={className} {...props}>
      {inner}
    </Link>
  );
}
