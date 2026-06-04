"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({ variant = "outline", size = "sm", showLabel = true, className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`flex items-center gap-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 ${className}`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <>
          <Moon className="w-4 h-4" />
          {showLabel && <span className="hidden sm:inline">Dark Mode</span>}
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          {showLabel && <span className="hidden sm:inline">Light Mode</span>}
        </>
      )}
    </Button>
  )
}
