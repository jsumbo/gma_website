import type { MetadataRoute } from "next"
import { getAthletes, getBlogPosts } from "@/lib/firestore"
import { athletes as staticAthletes, blogPosts as staticBlogPosts } from "@/lib/data"

const BASE = "https://gayduosa.org"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [athletes, posts] = await Promise.all([
    getAthletes().catch(() => staticAthletes),
    getBlogPosts().catch(() => staticBlogPosts),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/athletes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]

  const athleteRoutes: MetadataRoute.Sitemap = athletes.map((a) => ({
    url: `${BASE}/athletes/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...athleteRoutes, ...blogRoutes]
}
