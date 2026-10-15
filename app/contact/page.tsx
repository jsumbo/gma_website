import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { MapPin } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Gayduo Management Agency — for talent representation, club and partnership inquiries, brand and sponsorship opportunities, or media requests.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Gayduo Management Agency",
    description: "Whether you're talent looking for representation, a club, or a brand — let's talk.",
    url: "/contact",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

const offices = [
  { city: "Kigali", country: "Rwanda" },
  { city: "Monrovia", country: "Liberia" },
]

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject } = await searchParams

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Header />

      <main className="flex-1">

        <section className="pt-32 pb-16 px-7 sm:px-12 lg:px-16 xl:px-24 gsa-grain" style={{ backgroundColor: "#01255f" }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display leading-[0.88] text-white" style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}>
              LET&apos;S<br />
              <span style={{ color: "#fee11b" }}>TALK.</span>
            </h1>
          </div>
        </section>

        <section className="py-20 lg:py-28 px-7 sm:px-12 lg:px-16 xl:px-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            <div>
              <div className="w-8 h-[3px] mb-6" style={{ backgroundColor: "#fee11b" }} />
              <h2 className="font-display text-4xl sm:text-5xl mb-6" style={{ color: "#01255f" }}>
                REACH OUT
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground max-w-sm">
                Whether you’re a talent looking for representation or a brand seeking partnership opportunities, our dedicated team is here to help and will reply to any enquiries as quick as we can.
              </p>

              <div className="mt-10 space-y-8">
                <div>
                  <p className="mb-1 font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</p>
                  <a href="mailto:info@gayduoma.com" className="font-heading text-lg font-bold transition-opacity hover:opacity-70" style={{ color: "#01255f" }}>
                    info@gayduoma.com
                  </a>
                </div>
                <div>
                  <p className="mb-3 font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground">Offices</p>
                  <ul className="space-y-3">
                    {offices.map((o) => (
                      <li key={o.city} className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 shrink-0" style={{ color: "#3a7cf4" }} />
                        <span className="font-heading text-lg font-bold" style={{ color: "#01255f" }}>
                          {o.city}
                          <span className="ml-2 font-medium text-muted-foreground">{o.country}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="border border-border bg-white p-6 sm:p-10">
                <ContactForm defaultSubject={subject} />
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
