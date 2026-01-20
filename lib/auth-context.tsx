"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  login: (phone: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin credentials
const ADMIN_PHONE = "97999 64364"
const ADMIN_PASSWORD = "Yash#9799"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication on mount and pathname change
  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth")
    const authTimestamp = localStorage.getItem("adminAuthTimestamp")
    
    // Check if auth is valid (24 hours expiry)
    if (authStatus === "true" && authTimestamp) {
      const timestamp = parseInt(authTimestamp, 10)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000
      
      if (now - timestamp < twentyFourHours) {
        setIsAuthenticated(true)
      } else {
        // Auth expired
        localStorage.removeItem("adminAuth")
        localStorage.removeItem("adminAuthTimestamp")
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
    
    setIsLoading(false)
  }, [pathname])

  const login = (phone: string, password: string): boolean => {
    // Normalize phone number (remove spaces and check)
    const normalizedPhone = phone.replace(/\s+/g, " ").trim()
    
    if (normalizedPhone === ADMIN_PHONE && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuth", "true")
      localStorage.setItem("adminAuthTimestamp", Date.now().toString())
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminAuthTimestamp")
    router.push("/admin/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

