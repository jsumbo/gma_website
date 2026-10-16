"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FileText, Users, Home, LogOut, Mail, Sparkles, UserCircle, X } from "lucide-react"
import { logOut } from "@/lib/auth"

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logOut()
    router.push("/gsa")
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      style={{ backgroundColor: "#01255f", color: "#fff" }}
    >
      <div className="flex items-start justify-between border-b border-white/10 p-6">
        <Link href="/gsa" className="block" onClick={onClose}>
          <span className="text-lg font-bold tracking-tight" style={{ color: "#fee11b" }}>MANAGEMENT AGENCY</span>
          <span className="block text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Admin Panel</span>
        </Link>
        <button type="button" className="p-1 lg:hidden" aria-label="Close menu" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 p-4">
        <p className="text-xs font-medium uppercase tracking-widest px-4 mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
          Content
        </p>
        <ul className="space-y-1">
          <li>
            <Link
              href="/gsa"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all"
              style={pathname === "/gsa"
                ? { backgroundColor: "#fee11b", color: "#01255f" }
                : { color: "rgba(255,255,255,0.65)" }
              }
            >
              <FileText className="h-4 w-4 shrink-0" />
              Blog Posts
            </Link>
          </li>
          <li>
            <Link
              href="/gsa/talent"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all"
              style={pathname.startsWith("/gsa/talent")
                ? { backgroundColor: "#fee11b", color: "#01255f" }
                : { color: "rgba(255,255,255,0.65)" }
              }
            >
              <Users className="h-4 w-4 shrink-0" />
              Talent
            </Link>
          </li>
          <li>
            <Link
              href="/gsa/services"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all"
              style={pathname.startsWith("/gsa/services")
                ? { backgroundColor: "#fee11b", color: "#01255f" }
                : { color: "rgba(255,255,255,0.65)" }
              }
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/gsa/team"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all"
              style={pathname.startsWith("/gsa/team")
                ? { backgroundColor: "#fee11b", color: "#01255f" }
                : { color: "rgba(255,255,255,0.65)" }
              }
            >
              <UserCircle className="h-4 w-4 shrink-0" />
              Team
            </Link>
          </li>
        </ul>

        <p className="text-xs font-medium uppercase tracking-widest px-4 mb-3 mt-6" style={{ color: "rgba(255,255,255,0.35)" }}>
          Tools
        </p>
        <ul className="space-y-1">
          <li>
            <a
              href="https://server393.web-hosting.com:2096/webmaillogout.cgi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              <Mail className="h-4 w-4 shrink-0" />
              Mail
            </a>
          </li>
        </ul>
      </nav>

      <div className="p-4 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <Home className="h-4 w-4 shrink-0" />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
