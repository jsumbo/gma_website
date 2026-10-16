import type { MetadataRoute } from "next"
import { getAthletes, getBlogPosts } from "@/lib/firestore-server"
import { athletes as staticAthletes, blogPosts as staticBlogPosts } from "@/lib/data"

const BASE = "https://gayduosa.org"

// A previous version of this file read static placeholder data instead of the live roster/blog
// (see git history: "Fix sitemap — use static data instead of Firebase to avoid server crash").
// The real cause was that metadata routes like this one are statically generated at BUILD time
// by default, where a stuck Firestore SDK connection could hang the build. Reads now go through
// lib/firestore-server (plain fetch with a timeout), so build-time generation is safe; the page
// revalidates every 60s like the other public pages, with a static-data fallback kept for
// genuine outages.
export const revalidate = 60

// A sitemap entry with an un-slugified value (spaces, commas, etc.) is worse than no entry —
// it tells Google to index a URL that looks broken. Only include clean, URL-safe slugs.
const isCleanSlug = (slug: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [athletes, posts] = await Promise.all([
    getAthletes().catch(() => staticAthletes),
    getBlogPosts().catch(() => staticBlogPosts),
  ])

  // Only athletes get a /talent/[slug] profile page — creators and models have none, so
  // including their slugs here would submit dead-end URLs to Google.
  const athleteRoutes: MetadataRoute.Sitemap = athletes
    .filter((a) => isCleanSlug(a.slug) && (a.area ?? "Athlete") === "Athlete")
    .map((a) => ({
      url: `${BASE}/talent/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }))

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => isCleanSlug(p.slug))
    .map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/team`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/talent`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...athleteRoutes,
    ...blogRoutes,
  ]
}
