import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel | Management Agency",
  description: "Management Agency admin panel for managing blog posts and content.",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      {children}
    </div>
  )
}
