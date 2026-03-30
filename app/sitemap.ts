import type { MetadataRoute } from "next"
import { athletes, blogPosts } from "@/lib/data"

const BASE = "https://gayduosa.org"

export default function sitemap(): MetadataRoute.Sitemap {
  const athleteRoutes: MetadataRoute.Sitemap = athletes.map((a) => ({
    url: `${BASE}/athletes/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/athletes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...athleteRoutes,
    ...blogRoutes,
  ]
}
