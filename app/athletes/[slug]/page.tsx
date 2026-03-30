import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Instagram, Twitter, Facebook, Calendar, MapPin, Ruler, CircleDot } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAthleteBySlug } from "@/lib/firestore"
import { athletes as staticAthletes } from "@/lib/data"
import { AthleteMedia } from "./athlete-media"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

interface AthletePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: AthletePageProps): Promise<Metadata> {
  const { slug } = await params
  const athlete = await getAthleteBySlug(slug).catch(
    () => staticAthletes.find((a) => a.slug === slug) ?? null
  )

  if (!athlete) return { title: "Athlete Not Found" }

  const age = new Date().getFullYear() - new Date(athlete.dateOfBirth).getFullYear()
  const title = `${athlete.name} — ${athlete.position} | Gayduo Sports Agency`
  const description = `${athlete.name} is a ${athlete.nationality} ${athlete.position.toLowerCase()} at ${athlete.team}, ${age} years old — ${athlete.stats.goals} goals & ${athlete.stats.assists} assists. Represented by Gayduo Sports Agency.`

  return {
    title,
    description,
    keywords: [
      athlete.name,
      `${athlete.name} football`,
      `${athlete.name} footballer`,
      `${athlete.name} ${athlete.position}`,
      `${athlete.name} ${athlete.team}`,
      athlete.nationality,
      `${athlete.nationality} footballer`,
      "Gayduo Sports Agency",
      "African football",
    ],
    openGraph: {
      title,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function AthletePage({ params }: AthletePageProps) {
  const { slug } = await params
  const athlete = await getAthleteBySlug(slug).catch(
    () => staticAthletes.find((a) => a.slug === slug) ?? null
  )

  if (!athlete) notFound()

  const age = new Date().getFullYear() - new Date(athlete.dateOfBirth).getFullYear()

  // JSON-LD structured data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: athlete.name,
    jobTitle: athlete.position,
    nationality: athlete.nationality,
    birthDate: athlete.dateOfBirth,
    image: `https://gayduosa.org${athlete.image}`,
    description: athlete.biography.split("\n\n")[0],
    worksFor: {
      "@type": "SportsTeam",
      name: athlete.team,
    },
    affiliation: {
      "@type": "Organization",
      name: "Gayduo Sports Agency",
      url: "https://gayduosa.org",
    },
    url: `https://gayduosa.org/athletes/${athlete.slug}`,
    sameAs: [
      athlete.socialLinks.instagram,
      athlete.socialLinks.twitter,
      athlete.socialLinks.facebook,
    ].filter(Boolean),
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1 pt-16">

        {/* Back */}
        <div className="px-7 sm:px-12 lg:px-16 xl:px-24 py-6">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/athletes"
              className="inline-flex items-center gap-2 font-heading font-semibold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Athletes
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="px-7 sm:px-12 lg:px-16 xl:px-24 pb-16 lg:pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

              {/* Image */}
              <div className="relative">
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
                  <Image
                    src={athlete.image}
                    alt={athlete.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  {/* Jersey number ghost */}
                  <div
                    className="absolute right-4 bottom-16 font-display leading-none select-none pointer-events-none"
                    style={{ fontSize: "clamp(6rem, 14vw, 10rem)", color: "rgba(255,255,255,0.1)" }}
                  >
                    {athlete.number}
                  </div>
                  {/* Yellow top line */}
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: "#fee11b" }} />
                </div>
              </div>

              {/* Info */}
              <div className="lg:sticky lg:top-32">
                <p className="font-heading font-semibold text-[0.65rem] uppercase tracking-[0.2em] mb-3" style={{ color: "#fee11b" }}>
                  {athlete.position}
                </p>
                <h1
                  className="font-display leading-[0.88] mb-4"
                  style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", color: "#01255f" }}
                >
                  {athlete.name.toUpperCase()}
                </h1>
                <p className="font-heading font-semibold text-lg text-muted-foreground mb-8">
                  {athlete.team}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-8 border-y border-border mb-8">
                  {[
                    { value: athlete.stats.appearances, label: "Apps" },
                    { value: athlete.stats.goals, label: "Goals" },
                    { value: athlete.stats.assists, label: "Assists" },
                    { value: `#${athlete.number}`, label: "Jersey" },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <p className="font-display text-4xl lg:text-5xl leading-none mb-1" style={{ color: "#01255f" }}>
                        {value}
                      </p>
                      <p className="font-heading font-semibold text-xs uppercase tracking-widest text-muted-foreground">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-heading font-semibold text-[0.6rem] uppercase tracking-widest text-muted-foreground">Nationality</p>
                      <p className="font-heading font-semibold text-sm">{athlete.nationality}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-heading font-semibold text-[0.6rem] uppercase tracking-widest text-muted-foreground">Age</p>
                      <p className="font-heading font-semibold text-sm">{age} years old</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ruler className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-heading font-semibold text-[0.6rem] uppercase tracking-widest text-muted-foreground">Height</p>
                      <p className="font-heading font-semibold text-sm">{athlete.height}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CircleDot className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="font-heading font-semibold text-[0.6rem] uppercase tracking-widest text-muted-foreground">Preferred Foot</p>
                      <p className="font-heading font-semibold text-sm">{athlete.preferredFoot}</p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div className="flex items-center gap-2">
                  {athlete.socialLinks.instagram && (
                    <a
                      href={athlete.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${athlete.name} on Instagram`}
                      className="w-9 h-9 flex items-center justify-center border border-[#01255f]/20 text-[#01255f] hover:bg-[#01255f] hover:border-[#01255f] hover:text-white transition-all duration-200"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                  {athlete.socialLinks.twitter && (
                    <a
                      href={athlete.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${athlete.name} on Twitter`}
                      className="w-9 h-9 flex items-center justify-center border border-[#01255f]/20 text-[#01255f] hover:bg-[#01255f] hover:border-[#01255f] hover:text-white transition-all duration-200"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {athlete.socialLinks.facebook && (
                    <a
                      href={athlete.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${athlete.name} on Facebook`}
                      className="w-9 h-9 flex items-center justify-center border border-[#01255f]/20 text-[#01255f] hover:bg-[#01255f] hover:border-[#01255f] hover:text-white transition-all duration-200"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Biography */}
        <section className="py-16 lg:py-24 px-7 sm:px-12 lg:px-16 xl:px-24 border-y border-border bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="w-8 h-[3px] mb-6" style={{ backgroundColor: "#fee11b" }} />
              <h2 className="font-display text-4xl sm:text-5xl mb-8" style={{ color: "#01255f" }}>
                BIOGRAPHY
              </h2>
              <div className="space-y-5">
                {athlete.biography.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        {athlete.achievements.length > 0 && (
          <section className="py-16 lg:py-24 px-7 sm:px-12 lg:px-16 xl:px-24 gsa-grain" style={{ backgroundColor: "#01255f" }}>
            <div className="mx-auto max-w-7xl">
              <div className="w-8 h-[3px] mb-6" style={{ backgroundColor: "#fee11b" }} />
              <h2 className="font-display text-4xl sm:text-5xl text-white mb-10">
                ACHIEVEMENTS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {athlete.achievements.map((achievement, index) => (
                  <div key={index} className="border-l-2 pl-5" style={{ borderColor: "#fee11b" }}>
                    <p className="font-heading font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {achievement.year}
                    </p>
                    <p className="font-heading font-semibold text-sm sm:text-base text-white leading-snug">
                      {achievement.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Interactive: Video + Gallery (client component) */}
        <AthleteMedia
          gallery={athlete.gallery}
          highlightVideo={athlete.highlightVideo}
          highlightVideos={athlete.highlightVideos}
          athleteName={athlete.name}
        />

        {/* CTA */}
        <section className="py-16 lg:py-24 px-7 sm:px-12 lg:px-16 xl:px-24 border-t border-border">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
              <div>
                <div className="w-8 h-[3px] mb-5" style={{ backgroundColor: "#fee11b" }} />
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[0.9] mb-3" style={{ color: "#01255f" }}>
                  INTERESTED IN<br />
                  <span className="font-display">{athlete.name.split(" ")[0].toUpperCase()}?</span>
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                  For media inquiries, sponsorship opportunities, or representation discussions, please contact our team.
                </p>
              </div>
              <a
                href="/about#contact"
                className="inline-flex items-center justify-center px-7 py-3.5 font-heading font-bold text-sm uppercase tracking-[0.1em] shrink-0 transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#fee11b", color: "#01255f" }}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
