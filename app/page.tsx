import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogCard } from "@/components/blog-card"
import { getFeaturedBlogPosts } from "@/lib/firestore-server"
import { blogPosts as staticBlogPosts } from "@/lib/data"
import { ArrowRight, ArrowDown } from "lucide-react"

export const revalidate = 60

export default async function HomePage() {
  const featuredPosts = await getFeaturedBlogPosts().catch(() => staticBlogPosts.slice(0, 3))

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Header />

      <main className="flex-1">

        
        <section
          className="relative flex min-h-svh flex-col overflow-hidden gsa-grain"
          style={{ backgroundColor: "#01255f" }}
        >
          {/* Background photo + navy overlay for legibility */}
          {/* Not `priority`: the photo sits under an ~88% navy overlay, so it shouldn't compete with
              the headline (the LCP element) for bandwidth on first load. Low quality is invisible here. */}
          <Image
            src="/image.png"
            alt=""
            fill
            sizes="100vw"
            quality={50}
            fetchPriority="low"
            className="object-cover object-[center_30%]"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(1,37,95,0.88) 0%, rgba(1,37,95,0.72) 45%, rgba(1,37,95,0.93) 100%)" }}
          />

          {/* Subtle geometric lines */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-px opacity-10" style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6) 40%, transparent)" }} />
            <div className="absolute right-[25%] top-0 h-full w-px opacity-5" style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.4) 50%, transparent)" }} />
          </div>

          {/* Soft accent glow behind the headline */}
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-184 w-184 -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl"
            style={{ backgroundColor: "#3a7cf4" }}
          />

          {/* Main content — centered, full-bleed */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-7 pb-24 pt-32 text-center sm:px-12 lg:px-16 xl:px-24">
            <h1 className="font-display leading-[0.9] text-white">
              <span className="block whitespace-normal sm:whitespace-nowrap" style={{ fontSize: "clamp(2.6rem, 6.6vw, 6.5rem)" }}>
                WHERE TALENTS
              </span>
              <span
                className="block whitespace-normal sm:whitespace-nowrap"
                style={{ color: "#fee11b", fontSize: "clamp(2rem, 5.6vw, 5.5rem)" }}
              >
                BECOME WORLDCLASS
              </span>
            </h1>

            <p
              className="mt-8 max-w-xl font-heading text-xs font-bold uppercase tracking-[0.22em] sm:text-sm"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Market-Leading 360° Management Agency
            </p>
          </div>

          {/* Scroll cue, bottom-left */}
          <div className="absolute bottom-8 left-7 z-10 hidden items-center gap-2 text-white/40 sm:left-12 lg:flex lg:left-16 xl:left-24">
            <span className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.25em]">Scroll</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>

          {/* "View Roster" pill, bottom-right */}
          <Link
            href="/talent"
            className="group absolute bottom-7 right-7 z-10 inline-flex items-center gap-2.5 px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-[0.14em] transition-all duration-200 hover:gap-4 hover:bg-white sm:bottom-10 sm:right-12 lg:right-16 xl:right-24"
            style={{ backgroundColor: "#fee11b", color: "#01255f" }}
          >
            View Our Roster
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>


        <section id="services" className="relative scroll-mt-20 overflow-hidden gsa-grain" style={{ backgroundColor: "#01255f" }}>
          {/* Angular accent shapes, echoing the brand's geometric lines */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -left-24 top-0 h-168 w-lg opacity-[0.07]"
              style={{ backgroundColor: "#3a7cf4", clipPath: "polygon(0 0, 100% 15%, 65% 100%, 0% 100%)" }}
            />
            <div
              className="absolute -left-10 top-10 h-144 w-88 opacity-[0.1]"
              style={{ backgroundColor: "#fee11b", clipPath: "polygon(10% 0, 100% 8%, 60% 100%, 0% 85%)" }}
            />
          </div>

          <div className="relative z-10 px-7 py-20 sm:px-12 lg:px-16 lg:py-28 xl:px-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">

                {/* Left: athlete portrait, framed against the accent shapes */}
                <div className="relative mx-auto hidden w-full max-w-sm lg:col-span-4 lg:block lg:max-w-none">
                  <div className="relative aspect-3/4 overflow-hidden" style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}>
                    <Image
                      src="/IMG_0047.jpeg"
                      alt="One of our represented athletes"
                      fill
                      sizes="(max-width: 1024px) 0px, 33vw"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(1,37,95,0.85), rgba(1,37,95,0.1) 55%)" }} />
                  </div>
                </div>

                {/* Right: headline + copy + CTA */}
                <div className="lg:col-span-8">
                  <p className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#fee11b" }}>
                    Services
                  </p>
                  <h2 className="font-display leading-[0.95] text-white">
                    <span className="block whitespace-normal lg:whitespace-nowrap" style={{ fontSize: "clamp(1.7rem, 8vw, 3.5rem)" }}>
                      DELIVERING FOR
                    </span>
                    <span className="block whitespace-normal lg:whitespace-nowrap" style={{ color: "#fee11b", fontSize: "clamp(1.7rem, 8vw, 3.5rem)" }}>
                      YOU ON THE PITCH
                    </span>
                  </h2>
                  <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    From contract negotiations and club moves to sponsorships and life after the final whistle — we cover every dimension of a player&apos;s career. Not as a service. As a partnership.
                  </p>
                  <Link
                    href="/services"
                    className="mt-8 inline-flex items-center gap-2.5 px-7 py-3.5 font-heading text-sm font-bold uppercase tracking-[0.1em] transition-all duration-200 hover:gap-4"
                    style={{ backgroundColor: "#fee11b", color: "#01255f" }}
                  >
                    Explore Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </section>

        
        {featuredPosts.length > 0 && (
          <section className="py-20 lg:py-28 px-7 sm:px-12 lg:px-16 xl:px-24">
            <div className="max-w-7xl mx-auto">

              <div className="flex items-end justify-between mb-10 lg:mb-14">
                <div>
                  <p className="font-heading font-semibold text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "#fee11b" }}>
                    Latest
                  </p>
                  <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl" style={{ color: "#01255f" }}>
                    NEWS &amp; INSIGHTS
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="hidden sm:flex items-center gap-2 font-heading font-semibold uppercase tracking-[0.1em] text-xs group transition-colors"
                  style={{ color: "#01255f" }}
                >
                  View All
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              <div className="mt-8 sm:hidden">
                <Link href="/blog" className="inline-flex items-center gap-2 font-heading font-semibold uppercase tracking-wider text-xs" style={{ color: "#01255f" }}>
                  View All Posts <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  )
}
