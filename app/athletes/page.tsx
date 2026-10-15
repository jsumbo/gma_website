import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAthletes } from "@/lib/firestore"
import { athletes as staticAthletes } from "@/lib/data"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Athletes",
  description:
    "Meet the Gayduo Management Agency roster — a select group of elite African footballers, each receiving the full attention and support they deserve.",
  alternates: { canonical: "/athletes" },
  openGraph: {
    title: "Our Athletes | Gayduo Management Agency",
    description: "A select group of elite African footballers — each with a story, each with a future.",
    url: "/athletes",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default async function AthletesPage() {
  const athletes = await getAthletes().catch(() => staticAthletes)

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Header />

      <main className="flex-1">

        
        <section className="pt-32 pb-16 px-7 sm:px-12 lg:px-16 xl:px-24 gsa-grain" style={{ backgroundColor: "#01255f" }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display leading-[0.88] text-white" style={{ fontSize: "clamp(4rem, 14vw, 13rem)" }}>
              OUR<br />
              ATHLETES
            </h1>
            <p className="mt-8 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.5)" }}>
              We don&apos;t sign players to fill a roster — we sign players we believe in. Each athlete receives our full attention, from first contract to final whistle.
            </p>
          </div>
        </section>

        
        <section className="py-16 lg:py-24 px-7 sm:px-12 lg:px-16 xl:px-24">
          <div className="max-w-7xl mx-auto">
            {athletes.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <p className="font-heading font-semibold uppercase tracking-wider">No athletes on the roster yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {athletes.map((athlete, index) => (
                  <Link href={`/athletes/${athlete.slug}`} key={athlete.id} className="group block">
                    <article>
                      {/* Image */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-5">
                        <Image
                          src={athlete.image}
                          alt={athlete.name}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                          priority={index < 3}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                        {/* Yellow top border */}
                        <div
                          className="absolute top-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                          style={{ backgroundColor: "#fee11b" }}
                        />

                        {/* Jersey number */}
                        <div
                          className="absolute bottom-4 right-4 font-display leading-none select-none pointer-events-none text-white/10"
                          style={{ fontSize: "5.5rem" }}
                        >
                          {athlete.number}
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <p className="font-heading font-semibold text-[0.65rem] uppercase tracking-[0.2em] mb-1.5" style={{ color: "#fee11b" }}>
                          {athlete.position}
                        </p>
                        <h2 className="font-heading font-bold leading-tight mb-1 transition-colors" style={{ fontSize: "1.4rem", color: "#01255f" }}>
                          {athlete.name}
                        </h2>
                        <p className="font-heading text-xs uppercase tracking-wider text-muted-foreground">
                          {athlete.team}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        
        <section className="py-20 px-7 sm:px-12 lg:px-16 xl:px-24 gsa-grain border-t border-white/5" style={{ backgroundColor: "#01255f" }}>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9]">
                INTERESTED IN<br />
                <span style={{ color: "#fee11b" }}>REPRESENTATION?</span>
              </h2>
              <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                We are selective by design. If you are serious about your career and looking for an agency that will treat you as a priority — not a number — let&apos;s talk.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 font-heading font-bold uppercase tracking-[0.1em] text-sm shrink-0 transition-all duration-200 hover:gap-4"
              style={{ backgroundColor: "#fee11b", color: "#01255f" }}
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
