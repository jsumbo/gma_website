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
  title: "Talent",
  description:
    "Meet the Gayduo Management Agency roster — athletes, creators, and models, each receiving the full attention and support they deserve.",
  alternates: { canonical: "/talent" },
  openGraph: {
    title: "Our Talent | Gayduo Management Agency",
    description: "A select roster of athletes, creators, and models — each with a story, each with a future.",
    url: "/talent",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default async function TalentPage() {
  const roster = await getAthletes().catch(() => staticAthletes)

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Header />

      <main className="flex-1">

        <section className="pt-32 pb-16 px-7 sm:px-12 lg:px-16 xl:px-24 gsa-grain" style={{ backgroundColor: "#01255f" }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display leading-[0.88] text-white" style={{ fontSize: "clamp(4rem, 14vw, 13rem)" }}>
              OUR<br />
              TALENT
            </h1>
            <p className="mt-8 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.5)" }}>
              We don&apos;t sign people to fill a roster — we sign talent we believe in. Each person receives our full attention, from first contract onward.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24 px-7 sm:px-12 lg:px-16 xl:px-24">
          <div className="max-w-7xl mx-auto">
            {roster.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <p className="font-heading font-semibold uppercase tracking-wider">No talent on the roster yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {roster.map((person, index) => {
                  const area = person.area ?? "Athlete"
                  const isAthlete = area === "Athlete"
                  const detail = [person.position, person.team].filter(Boolean).join(" · ")

                  const card = (
                    <article className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                      <Image
                        src={person.image}
                        alt=""
                        fill
                        className="object-cover"
                        priority={index < 3}
                      />
                      <span
                        className="absolute left-4 top-4 px-2.5 py-1 font-heading text-[0.65rem] font-bold uppercase tracking-[0.16em]"
                        style={{ backgroundColor: "#fee11b", color: "#01255f" }}
                      >
                        {area}
                      </span>
                      <div
                        className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-28"
                        style={{ background: "linear-gradient(to top, #01255f 0%, #01255f 34%, rgba(1,37,95,0.55) 62%, rgba(1,37,95,0) 100%)" }}
                      >
                        {isAthlete && detail && (
                          <p className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.16em]" style={{ color: "#fee11b" }}>
                            {detail}
                          </p>
                        )}
                        <h2 className="mt-1 font-heading text-2xl font-bold leading-tight text-white">
                          {person.name}
                        </h2>
                        <p
                          className={`mt-3 flex items-center gap-2 font-heading text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white ${isAthlete ? "" : "invisible"}`}
                          aria-hidden={isAthlete ? undefined : true}
                        >
                          <span
                            className="block h-[2px] w-8 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                            style={{ backgroundColor: "#fee11b" }}
                          />
                          <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                            View profile
                          </span>
                        </p>
                      </div>
                    </article>
                  )

                  // Only athletes get a profile page. Creators and models stay on the roster.
                  return isAthlete ? (
                    <Link
                      href={`/talent/${person.slug}`}
                      key={person.id}
                      className="group block focus-visible:outline-2 focus-visible:outline-offset-4"
                      style={{ outlineColor: "#fee11b" }}
                    >
                      {card}
                    </Link>
                  ) : (
                    <div key={person.id}>
                      {card}
                    </div>
                  )
                })}
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
