import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/lib/data"
import { ArrowUpRight } from "lucide-react"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article>
        {/* Image */}
        <div className="aspect-[16/10] relative overflow-hidden bg-neutral-200 mb-5">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-600 scale-100 group-hover:scale-[1.03]"
          />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category */}
          <div className="absolute top-0 left-0">
            <span
              className="inline-block font-heading font-bold text-[0.65rem] uppercase tracking-[0.18em] px-3 py-2"
              style={{ backgroundColor: "#01255f", color: "#fee11b" }}
            >
              {post.category}
            </span>
          </div>

          {/* Yellow bottom line reveal */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400"
            style={{ backgroundColor: "#fee11b" }}
          />
        </div>

        {/* Text */}
        <div>
          <time className="font-heading font-semibold text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
            {formattedDate}
          </time>
          <h3 className="font-heading font-bold leading-tight mt-2 mb-2.5 text-balance transition-colors group-hover:text-[#01255f]"
            style={{ fontSize: "1.15rem", color: "#111" }}>
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 mb-4">
            {post.excerpt}
          </p>
          <div
            className="inline-flex items-center gap-1.5 font-heading font-bold text-xs uppercase tracking-[0.15em] transition-all group-hover:gap-2.5"
            style={{ color: "#01255f" }}
          >
            Read More
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </article>
    </Link>
  )
}
