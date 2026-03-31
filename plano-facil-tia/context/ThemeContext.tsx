"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  // Lê o tema salvo (ou preferência do sistema) na montagem
  useEffect(() => {
    const saved = localStorage.getItem("pft-theme") as Theme | null
    if (saved === "light" || saved === "dark") {
      setTheme(saved)
      document.documentElement.setAttribute("data-theme", saved)
    } else {
      // Respeita a preferência do SO
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const initial: Theme = prefersDark ? "dark" : "light"
      setTheme(initial)
      document.documentElement.setAttribute("data-theme", initial)
    }
  }, [])

  function toggleTheme() {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light"
      localStorage.setItem("pft-theme", next)
      document.documentElement.setAttribute("data-theme", next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
