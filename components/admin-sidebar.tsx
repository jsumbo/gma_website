"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FileText, Users, Home, LogOut, Mail } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem("gsa_auth")
    router.push("/gsa")
  }

  return (
    <aside className="w-64 flex flex-col fixed inset-y-0 left-0 z-40" style={{ backgroundColor: "#01255f", color: "#fff" }}>
      <div className="p-6 border-b border-white/10">
        <Link href="/gsa" className="block">
          <span className="text-lg font-bold tracking-tight" style={{ color: "#fee11b" }}>SPORTS AGENCY</span>
          <span className="block text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Admin Panel</span>
        </Link>
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
              href="/gsa/athletes"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all"
              style={pathname.startsWith("/gsa/athletes")
                ? { backgroundColor: "#fee11b", color: "#01255f" }
                : { color: "rgba(255,255,255,0.65)" }
              }
            >
              <Users className="h-4 w-4 shrink-0" />
              Athletes
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
