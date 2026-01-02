import clsx from "clsx";

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
};

export function Container<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...props // Capture any extra props just in case
}: Omit<React.ComponentPropsWithoutRef<T>, keyof ContainerProps<T>> &
  ContainerProps<T>) {
  const Component = (as ?? "div") as any;

  return (
    <Component
      className={clsx("mx-auto max-w-7xl px-6 lg:px-8", className)}
      {...props}
    >
      <div className="mx-auto max-w-2xl lg:max-w-none">{children}</div>
    </Component>
  );
}

export function ContainerCard<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...props // Capture any extra props just in case
}: Omit<React.ComponentPropsWithoutRef<T>, keyof ContainerProps<T>> &
  ContainerProps<T>) {
  const Component = (as ?? "div") as any;

  return (
    <Component
      className={clsx("mx-auto max-w-7xl px-2 md:px-4 lg:px-8", className)}
      {...props}
    >
      <div className="mx-auto max-w-2xl lg:max-w-none">{children}</div>
    </Component>
  );
}
