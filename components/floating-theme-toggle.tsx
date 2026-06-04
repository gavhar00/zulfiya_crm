"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

export function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleTheme}
        size="lg"
        className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
      </Button>
    </div>
  )
}
