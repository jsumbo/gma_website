import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServicesGrid } from "@/components/services-grid"
import { getServices } from "@/lib/firestore"
import { services as staticServices } from "@/lib/services"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-service talent management from Gayduo Management Agency — contract negotiation, transfer guidance, commercial deals, media & broadcast, PR, content production, and more.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Gayduo Management Agency",
    description: "Everything we do to connect talent with the right brands and the right opportunities.",
    url: "/services",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default async function ServicesPage() {
  const fetched = await getServices().catch(() => staticServices)
  // An empty collection isn't an error, so .catch() alone won't fall back — cover that too.
  const services = fetched.length > 0 ? fetched : staticServices

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Header />

      <main className="flex-1">

        <section className="gsa-grain relative overflow-hidden pt-32 pb-20 px-7 sm:px-12 lg:px-16 xl:px-24 lg:pb-28" style={{ backgroundColor: "#01255f" }}>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-px opacity-10" style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6) 40%, transparent)" }} />

          <div className="relative z-10 max-w-7xl mx-auto">
            <h1 className="font-display leading-[0.9] text-white" style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)" }}>
              FULL-SERVICE<br />
              <span style={{ color: "#fee11b" }}>MANAGEMENT</span>
            </h1>
            <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Striving to provide an unrivalled service, ensuring that all areas of our talents are managed professionally and with the highest levels of care and attention to detail.
            </p>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto mt-16 lg:mt-20">
            <ServicesGrid services={services} detailed />
          </div>
        </section>

        <section className="py-20 lg:py-28 px-7 sm:px-12 lg:px-16 xl:px-24">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.9]" style={{ color: "#01255f" }}>
                NOT SURE WHAT<br />
                YOU NEED?
              </h2>
              <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-muted-foreground">
                Tell us what you&apos;re working on — we&apos;ll point you in the right direction.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 font-heading font-bold uppercase tracking-[0.1em] text-sm shrink-0 transition-all duration-200 hover:gap-4"
              style={{ backgroundColor: "#01255f", color: "#ffffff" }}
            >
              Get In Touch
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
