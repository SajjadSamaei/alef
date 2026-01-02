import clsx from 'clsx'

export function BorderFarsi({
  className,
  position = 'top',
  invert = false,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={clsx(
        className,
        'relative before:absolute after:absolute',
        invert
          ? 'before:bg-white after:bg-white/10'
          : 'before:bg-neutral-950/10 after:bg-neutral-950',
        position === 'top' &&
          'before:right-8 before:top-0 before:h-px before:w-6 after:left-0 after:right-8 after:top-0 after:h-px',
        position === 'left' &&
          'before:right-0 before:top-0 before:h-6 before:w-px after:bottom-0 after:right-0 after:top-8 after:w-px'
      )}
      {...props}
    />
  )
}
