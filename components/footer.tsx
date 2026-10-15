"use client"

import Link from "next/link"
import { Instagram, Facebook, Mail } from "lucide-react"

const navLinks = [
  { name: "Who We Are", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Our Team", href: "/team" },
  { name: "Athletes", href: "/athletes" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

const services = [
  "Contract Negotiation",
  "Commercial Deals",
  "Media & Broadcast",
  "Public Relations",
]

const offices = [
  { city: "Kigali", country: "Rwanda" },
  { city: "Monrovia", country: "Liberia" },
]

const social = [
  { name: "Instagram", href: "https://www.instagram.com/gayduosa/", icon: Instagram },
  { name: "Facebook", href: "https://www.facebook.com/people/Gayduo-Sports-Agency/61581585638795/", icon: Facebook },
]

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#01255f" }} className="text-white">
      {/* Yellow accent top */}
      <div style={{ backgroundColor: "#fee11b" }} className="h-[3px] w-full" />

      <div className="mx-auto max-w-7xl px-7 sm:px-12 lg:px-16 xl:px-24">

        {/* Top: Brand + CTA */}
        <div className="pt-16 pb-14 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">

            {/* Wordmark */}
            <div>
              <Link href="/" className="block group">
                <span
                  className="block font-display leading-[0.85]"
                  style={{ fontSize: "clamp(3rem, 9vw, 7rem)", color: "#fee11b" }}
                >
                  GAYDUO
                </span>
                <span
                  className="block font-display leading-[0.85]"
                  style={{ fontSize: "clamp(3rem, 9vw, 7rem)", color: "rgba(255,255,255,0.9)" }}
                >
                  MANAGEMENT AGENCY
                </span>
              </Link>
              <p className="mt-5 font-heading font-semibold text-xs uppercase tracking-[0.2em] max-w-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                Connecting talent with brands
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="mailto:hello@gayduosa.com"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 font-heading font-bold text-xs uppercase tracking-[0.15em] transition-all duration-200"
                style={{ backgroundColor: "#fee11b", color: "#01255f" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fee11b")}
              >
                <Mail className="h-3.5 w-3.5" />
                Get in Touch
              </a>
              <Link
                href="/athletes"
                className="inline-flex items-center justify-center px-6 py-3.5 font-heading font-bold text-xs uppercase tracking-[0.15em] border text-white/70 hover:text-white hover:border-white/40 transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                Our Roster
              </Link>
            </div>
          </div>
        </div>

        {/* Mid: Links grid */}
        <div className="py-12 grid grid-cols-2 lg:grid-cols-4 gap-8 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>

          {/* Navigate */}
          <div>
            <h3 className="font-heading font-bold text-[0.65rem] uppercase tracking-[0.2em] mb-5" style={{ color: "#fee11b" }}>
              Navigate
            </h3>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="font-heading font-medium text-xs uppercase tracking-wider transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-bold text-[0.65rem] uppercase tracking-[0.2em] mb-5" style={{ color: "#fee11b" }}>
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <span className="font-heading font-medium text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h3 className="font-heading font-bold text-[0.65rem] uppercase tracking-[0.2em] mb-5" style={{ color: "#fee11b" }}>
              Offices
            </h3>
            <ul className="space-y-4">
              {offices.map((o) => (
                <li key={o.city}>
                  <p className="font-heading font-bold text-xs text-white">{o.city}</p>
                  <p className="font-heading text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{o.country}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-heading font-bold text-[0.65rem] uppercase tracking-[0.2em] mb-5" style={{ color: "#fee11b" }}>
              Connect
            </h3>
            <a
              href="mailto:hello@gayduosa.com"
              className="font-heading font-medium text-xs uppercase tracking-wider transition-colors hover:text-white block mb-5"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              hello@gayduosa.com
            </a>
            <div className="flex gap-2.5">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="w-8 h-8 flex items-center justify-center border transition-all duration-200 hover:bg-white hover:border-white"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.55)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#01255f" }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)" }}
                >
                  <item.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-heading font-medium text-[0.65rem] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
            &copy; {new Date().getFullYear()} Gayduo Management Agency. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="font-heading text-[0.65rem] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
              Elite African Football
            </span>
            <div className="w-4 h-px" style={{ backgroundColor: "#fee11b", opacity: 0.5 }} />
          </div>
        </div>

      </div>
    </footer>
  )
}
