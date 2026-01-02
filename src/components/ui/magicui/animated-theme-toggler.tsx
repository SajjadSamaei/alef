"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"

import { cn } from "@/utils/cn"

// 1. Add TypeScript support for the View Transitions API
interface ViewTransition {
  ready: Promise<void>
  updateCallbackDone: Promise<void>
  finished: Promise<void>
  skipTransition: () => void
}

declare global {
  interface Document {
    startViewTransition(callback: () => Promise<void> | void): ViewTransition
  }
}

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
  ease?: string
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ease = "ease-in-out",
  ...props
}: AnimatedThemeTogglerProps) => {
  // 2. Use next-themes for robust state management
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = React.useCallback(async () => {
    const isDark = resolvedTheme === "dark"
    const nextTheme = isDark ? "light" : "dark"

    // Fallback for browsers that don't support View Transitions
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme)
      return
    }

    const button = buttonRef.current
    if (!button) return

    // 3. Start the transition
    await document.startViewTransition(() => {
      // 4. flushSync is required here. 
      // It forces React to update the DOM *synchronously* inside this callback 
      // so the browser captures the "after" state correctly.
      flushSync(() => {
        setTheme(nextTheme)
      })
    }).ready

    // 5. Calculate Geometry for the Circle
    const { top, left, width, height } = button.getBoundingClientRect()
    
    // Center of the button
    const x = left + width / 2
    const y = top + height / 2
    
    // Calculate the distance to the furthest corner
    const right = window.innerWidth - left
    const bottom = window.innerHeight - top
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom))

    // 6. Animate the pseudo-element
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: ease,
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [resolvedTheme, setTheme, duration, ease])

  // Avoid rendering until mounted to prevent hydration errors
  if (!mounted) {
    return (
      <button className={cn("opacity-0", className)} disabled {...props}>
        <Sun />
      </button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-md p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
        className
      )}
      aria-label="Toggle theme"
      {...props}
    >
      <div className="relative h-6 w-6">
        <Sun
          className={cn(
            "fill-appleBackgroundWhite/80 dark:fill-appleBackgorundGray/80 absolute inset-0 h-full w-full rotate-0 scale-100 transition-all duration-300",
            isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100"
          )}
        />
        <Moon
          className={cn(
            "text-appleBackgroundWhite/60 fill-appleBackgroundWhite/40  absolute inset-0 h-full w-full rotate-90 scale-0 transition-all duration-300",
            isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"
          )}
        />
      </div>
    </button>
  )
}