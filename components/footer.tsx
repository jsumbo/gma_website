"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const navLinks = [
  { name: "Who We Are", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Our Team", href: "/team" },
  { name: "Talent", href: "/talent" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

const offices = [
  { city: "Kigali", country: "Rwanda" },
  { city: "Monrovia", country: "Liberia" },
]

// LinkedIn/TikTok URLs are a best guess matching the existing @gayduosa handle pattern —
// confirm these are the real profile links and swap them if not.
const social = [
  { name: "Instagram", href: "https://www.instagram.com/gayduosa/" },
  { name: "Facebook", href: "https://www.facebook.com/people/Gayduo-Sports-Agency/61581585638795/" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/gayduosa/" },
  { name: "TikTok", href: "https://www.tiktok.com/@gayduosa" },
]

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#01255f" }} className="overflow-hidden text-white">
      {/* Yellow accent top */}
      <div style={{ backgroundColor: "#fee11b" }} className="h-[3px] w-full" />

      <div className="px-7 pb-16 pt-20 sm:px-12 lg:px-16 lg:pt-24 xl:px-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">

          {/* Headline + CTAs */}
          <div>
            <h2 className="font-display leading-[0.88] text-white" style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}>
              LET&apos;S
              <br />
              <span style={{ color: "#fee11b" }}>TALK.</span>
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 font-heading text-xs font-bold uppercase tracking-[0.1em] transition-all duration-200 hover:gap-3"
                style={{ backgroundColor: "#fee11b", color: "#01255f" }}
              >
                Contact Us
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col items-start gap-1.5 lg:items-end">
            {social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-heading text-lg font-semibold text-white/60 transition-colors hover:text-white"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Full-bleed wordmark. One line, sized to the viewport so the name
          runs edge to edge the way a poster lockup does. */}
      <div className="@container w-full border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <Link
          href="/"
          aria-label="Gayduo Management Agency"
          className="block whitespace-nowrap text-center font-display leading-none"
          style={{ fontSize: "10.42cqi", letterSpacing: "-0.02em", padding: "0.16em 0 0.14em" }}
        >
          <span style={{ color: "#fee11b" }}>GAYDUO</span>
          {" "}
          <span className="text-white">MANAGEMENT AGENCY</span>
        </Link>
      </div>

      {/* Bottom bar */}
      <div className="px-7 sm:px-12 lg:px-16 xl:px-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 pb-6 pt-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="font-heading text-[0.65rem] font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
            &copy; {new Date().getFullYear()} — Gayduo Management Agency
          </p>

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-heading text-[0.65rem] font-medium uppercase tracking-widest transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <p className="font-heading text-[0.65rem] font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
            {offices.map((o) => o.city).join(" · ")}
          </p>
        </div>
      </div>
    </footer>
  )
}
