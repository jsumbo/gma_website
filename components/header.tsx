"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, type CSSProperties, type MouseEvent } from "react"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

// Split either side of the centered logo, like a magazine masthead.
// Order (left-to-right across the whole bar): Who We Are, Services, [logo], Our Team, Contact.
const navLeft = [
  { name: "Who We Are", href: "/about" },
  { name: "Services", href: "/services" },
]
const navRight = [
  { name: "Our Team", href: "/team" },
  { name: "Contact", href: "/contact" },
]
const navAll = [...navLeft, ...navRight]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const isActive = (href: string) => pathname === href

  const linkStyle = (active: boolean): CSSProperties => ({ color: active ? "#fee11b" : "rgba(255,255,255,0.75)" })
  const onLinkEnter = (active: boolean) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!active) e.currentTarget.style.color = "#ffffff"
  }
  const onLinkLeave = (active: boolean) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.75)"
  }

  const NavLink = ({ item }: { item: { name: string; href: string } }) => {
    const active = isActive(item.href)
    return (
      <Link
        href={item.href}
        className="relative pb-0.5 font-nav text-xl uppercase transition-colors"
        style={linkStyle(active)}
        onMouseEnter={onLinkEnter(active)}
        onMouseLeave={onLinkLeave(active)}
      >
        {item.name}
        <span
          className="absolute bottom-0 left-0 h-px transition-all duration-300"
          style={{ backgroundColor: "#fee11b", width: active ? "100%" : "0%" }}
        />
      </Link>
    )
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "#01255f" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.25)" : "none",
      }}
    >
      {/* Scrim so nav text stays legible before the background solidifies */}
      {!scrolled && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28"
          style={{ background: "linear-gradient(to bottom, rgba(1,37,95,0.55), transparent)" }}
        />
      )}

      <nav className="relative flex h-16 items-center px-7 sm:px-12 lg:px-16 xl:px-24">
        {/* Mobile: logo left, menu button right */}
        <div className="flex w-full items-center justify-between lg:hidden">
          <Link href="/" className="flex shrink-0 items-center">
            <Image src="/logo-header.png" alt="Gayduo Management Agency" width={563} height={176} className="h-9 w-auto rounded-sm" priority />
          </Link>
          <button
            type="button"
            className="p-2 text-white/80 transition-colors hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop: links pulled in close to the centered logo, not pinned to the page edges */}
        <div className="mx-auto hidden w-full max-w-4xl items-center justify-between lg:flex">
          <div className="flex items-center gap-12">
            {navLeft.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>

          <Link href="/" className="absolute left-1/2 flex -translate-x-1/2 items-center">
            <Image src="/logo-header.png" alt="Gayduo Management Agency" width={563} height={176} className="h-11 w-auto rounded-sm" priority />
          </Link>

          <div className="flex items-center gap-12">
            {navRight.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden"
          style={{ backgroundColor: "#01255f", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="space-y-0 px-5 pt-3 pb-6">
            {navAll.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-between border-b py-4 font-nav text-base uppercase transition-colors"
                style={{ color: "rgba(255,255,255,0.75)", borderColor: "rgba(255,255,255,0.06)" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
                <span className="text-xs text-white/20">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
