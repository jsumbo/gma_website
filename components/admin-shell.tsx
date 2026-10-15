"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const auth = sessionStorage.getItem("gsa_auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    } else {
      router.push("/gsa")
    }
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background px-4 lg:hidden">
        <button
          type="button"
          className="p-2"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold tracking-tight" style={{ color: "#01255f" }}>
          Admin
        </span>
      </div>
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="min-h-screen bg-muted/20 lg:ml-64">
        {children}
      </div>
    </div>
  )
}
