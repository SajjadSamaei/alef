import Link from "next/link";
import clsx from "clsx";

export function Button({
  invert = false,
  outline = false,
  className,
  children,
  ...props
}) {
  className = clsx(
    className,
    "inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition",
    invert
      ? "bg-jarounVeryLight text-neutral-950 hover:bg-jarounLight"
      : "bg-jarounBlack text-white hover:bg-jarounVeryDark",
    outline ? "outline-jarounBlack outline " : "",
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
