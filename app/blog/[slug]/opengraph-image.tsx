import { getBlogPostBySlug } from "@/lib/firestore-server"
import { blogPosts as staticBlogPosts } from "@/lib/data"
import { OG_CONTENT_TYPE, OG_SIZE, photoOgResponse } from "@/lib/og-image"

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Share preview = the post's featured image, cropped top-centre to 1200×630. Linking the raw
// upload instead made portrait photos show up as tall, uncropped previews in WhatsApp.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug).catch(
    () => staticBlogPosts.find((p) => p.slug === slug) ?? null
  )
  return photoOgResponse(post?.featuredImage, post?.title ?? "Gayduo Management Agency")
}
