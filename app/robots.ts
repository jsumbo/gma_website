import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/gsa/", "/api/"],
    },
    sitemap: "https://gayduosa.org/sitemap.xml",
  }
}
