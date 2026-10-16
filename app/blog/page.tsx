import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogCard } from "@/components/blog-card"
import { getBlogPosts } from "@/lib/firestore-server"
import { blogPosts as staticBlogPosts } from "@/lib/data"
import type { Metadata } from "next"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News, transfers, features, and stories from Gayduo Management Agency. Follow our athletes and stay close to the game.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "News & Insights | Gayduo Management Agency",
    description: "News, transfers, features, and stories from Gayduo Management Agency.",
    url: "/blog",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
}

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => staticBlogPosts)

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Header />

      <main className="flex-1">

        
        <section className="pt-32 pb-16 px-7 sm:px-12 lg:px-16 xl:px-24 gsa-grain" style={{ backgroundColor: "#01255f" }}>
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display leading-[0.88] text-white" style={{ fontSize: "clamp(5rem, 18vw, 16rem)" }}>
              BLOG
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.5)" }}>
              Transfer updates, features, and exclusive insights from our athletes and the world of football.
            </p>
          </div>
        </section>

        
        <section className="py-16 lg:py-24 px-7 sm:px-12 lg:px-16 xl:px-24">
          <div className="max-w-7xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <p className="font-heading font-semibold uppercase tracking-wider">No posts yet. Check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
