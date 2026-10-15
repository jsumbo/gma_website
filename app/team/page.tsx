import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getTeamMembers } from "@/lib/firestore"
import { team as staticTeam, teamMemberImage } from "@/lib/team"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the management team behind Gayduo Management Agency — the people managing careers, negotiating deals, and building partnerships for our talent.",
  alternates: { canonical: "/team" },
  openGraph: {
    title: "Our Team | Gayduo Management Agency",
    description: "The people behind the agency.",
    url: "/team",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default async function TeamPage() {
  const fetched = await getTeamMembers().catch(() => staticTeam)
  // An empty collection isn't an error, so .catch() alone won't fall back — cover that too.
  const team = fetched.length > 0 ? fetched : staticTeam

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Header />

      <main className="flex-1">

        <section className="pt-32 pb-16 px-7 sm:px-12 lg:px-16 xl:px-24 gsa-grain" style={{ backgroundColor: "#01255f" }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display leading-[0.88] text-white" style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}>
              OUR <span style={{ color: "#fee11b" }}>TEAM.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              A dedicated team working 24/7 to deliver best-in-class service, operational excellence, and deep industry experience – ensuring your career is in the safest of hands. 
            </p>
          </div>
        </section>

        <section className="py-20 lg:py-28 px-7 sm:px-12 lg:px-16 xl:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-x-8 gap-y-14 sm:grid-cols-3">
              {team.map((member) => (
                <div key={member.id} className="group">
                  <div className="relative mb-5 aspect-square overflow-hidden" style={{ backgroundColor: "#fee11b" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- dynamically generated external SVG, no benefit from next/image optimization */}
                    <img
                      src={teamMemberImage(member)}
                      alt={`${member.name} — ${member.role}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{ backgroundColor: "#01255f" }}
                    />
                  </div>
                  <h3 className="font-heading text-lg font-bold leading-tight" style={{ color: "#01255f" }}>
                    {member.name}
                  </h3>
                  <p className="mt-1 font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 px-7 sm:px-12 lg:px-16 xl:px-24 gsa-grain" style={{ backgroundColor: "#01255f" }}>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9]">
                WANT TO WORK<br />
                <span style={{ color: "#fee11b" }}>WITH US?</span>
              </h2>
              <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Reach out — we&apos;d love to hear what you&apos;re working on.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 font-heading font-bold uppercase tracking-[0.1em] text-sm shrink-0 transition-all duration-200 hover:gap-4"
              style={{ backgroundColor: "#fee11b", color: "#01255f" }}
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
