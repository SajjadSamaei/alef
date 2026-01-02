import clsx from "clsx";

export function TagList({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <ul
      role="list"
      className={clsx(className, "flex list-none flex-wrap gap-2")}
    >
      {children}
    </ul>
  );
}

export function TagListItem({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <li
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        // Light Mode
        "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900",
        // Dark Mode
        "dark:border-white/10 dark:bg-white/5 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white",
        className
      )}
    >
      {children}
    </li>
  );
}