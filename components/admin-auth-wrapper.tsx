"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminUser } from "@/lib/auth"

export function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push("/gsa")
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
