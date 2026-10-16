import type { Metadata } from "next"
import { Toaster } from "sonner"
import { ConfirmDialogProvider } from "@/components/confirm-dialog"

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
      <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
      {/* Only the admin panel shows toasts; keeping this out of the root layout keeps sonner off public pages. */}
      <Toaster position="bottom-right" richColors />
    </div>
  )
}
