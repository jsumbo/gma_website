import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogPostBySlug, getBlogPosts } from "@/lib/firestore"
import { blogPosts as staticBlogPosts } from "@/lib/data"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug).catch(() => staticBlogPosts.find((p) => p.slug === slug) ?? null)

  if (!post) {
    return { title: "Post Not Found | Gayduo Sports Agency" }
  }

  const ogImage = post.featuredImage.startsWith("http")
    ? post.featuredImage
    : `https://gayduosa.org${post.featuredImage}`

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    keywords: post.seoKeywords,
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: [ogImage],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug).catch(() => staticBlogPosts.find((p) => p.slug === slug) ?? null)

  if (!post) notFound()

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Related posts
  const allPosts = await getBlogPosts().catch(() => staticBlogPosts)
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <article>
          {/* Hero Section */}
          <section className="py-12 lg:py-16 px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span
                    className="inline-block text-xs font-medium uppercase tracking-wider px-3 py-1"
                    style={{ backgroundColor: "#01255f", color: "#fee11b" }}
                  >
                    {post.category}
                  </span>
                  <time className="text-sm text-muted-foreground">{formattedDate}</time>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-balance"
                  style={{ color: "#01255f" }}>
                  {post.title}
                </h1>

                <p className="text-lg text-muted-foreground">{post.excerpt}</p>
                <p className="text-sm text-muted-foreground">By {post.author}</p>
              </div>
            </div>
          </section>

          {/* Featured Image */}
          <section className="px-6 lg:px-8 mb-12">
            <div className="mx-auto max-w-5xl">
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="px-6 lg:px-8 pb-16 lg:pb-24">
            <div className="mx-auto max-w-3xl">
              <div
                className="prose prose-lg prose-neutral max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </section>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 lg:py-24 px-6 lg:px-8 bg-muted/50 border-t border-border">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold tracking-tight mb-8" style={{ color: "#01255f" }}>
                More Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-muted mb-4">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <h3 className="font-semibold group-hover:underline underline-offset-4" style={{ color: "#01255f" }}>
                      {relatedPost.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
