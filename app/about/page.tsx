import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "Gayduo Management Agency connects talent with brands — representing individuals across sports, lifestyle, and campus culture, and building commercial partnerships that deliver value for both sides.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Who We Are | Gayduo Management Agency",
    description: "Connecting talent with brands. Creating opportunities through strategic partnerships.",
    url: "/about",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Header />

      <main className="flex-1">

        <section className="pt-32 pb-16 px-7 sm:px-12 lg:px-16 xl:px-24 gsa-grain" style={{ backgroundColor: "#01255f" }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display leading-[0.88] text-white" style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}>
              CONNECTING TALENT<br />
              WITH <span style={{ color: "#fee11b" }}>OPPORTUNITIES.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Creating opportunities through strategic partnerships.
            </p>
          </div>
        </section>

        <section className="py-20 lg:py-28 px-7 sm:px-12 lg:px-16 xl:px-24">
          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-lg sm:text-xl leading-relaxed" style={{ color: "#01255f" }}>
              Gayduo Management Agency is a talent management agency dedicated to representing talent, developing careers, and building valuable commercial partnerships between the people we manage and the brands they can help connect with their audiences.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              We work with individuals across lifestyle, campus culture, and sports, including footballers and basketball players. Through strategic brand partnerships, we create opportunities for our talents to participate in marketing campaigns, commercials, endorsements, and promotional activities.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Our role is to bridge the gap between talent and brands, aligning the right personalities with the right commercial opportunities to deliver value for both parties.
            </p>
          </div>
        </section>

        <section className="py-20 lg:py-28 px-7 sm:px-12 lg:px-16 xl:px-24 border-y border-border bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              <div>
                <div className="w-8 h-[3px] mb-6" style={{ backgroundColor: "#fee11b" }} />
                <h2 className="font-display text-4xl sm:text-5xl mb-6" style={{ color: "#01255f" }}>
                  OUR MISSION
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground max-w-prose">
                  To represent exceptional people and open doors for them — building relationships with brands that recognise their value and want to grow alongside them.
                </p>
              </div>
              <div>
                <div className="w-8 h-[3px] mb-6" style={{ backgroundColor: "#3a7cf4" }} />
                <h2 className="font-display text-4xl sm:text-5xl mb-6" style={{ color: "#01255f" }}>
                  OUR APPROACH
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground max-w-prose">
                  We don&apos;t chase every deal — we look for the right fit. Alignment between a talent&apos;s identity and a brand&apos;s audience is what makes a partnership actually work, for both sides.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 px-7 sm:px-12 lg:px-16 xl:px-24 gsa-grain" style={{ backgroundColor: "#01255f" }}>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.9]">
                WANT TO KNOW<br />
                <span style={{ color: "#fee11b" }}>WHO WE REPRESENT?</span>
              </h2>
              <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                Meet the management team behind the agency, or get in touch to talk partnership.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/team"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 font-heading font-bold uppercase tracking-[0.1em] text-sm transition-all duration-200 hover:gap-4"
                style={{ backgroundColor: "#fee11b", color: "#01255f" }}
              >
                Meet The Team
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 font-heading font-semibold uppercase tracking-[0.1em] text-sm text-white border transition-all duration-200 hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
