"use client"

import { useState, useRef, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, X, ChevronDown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/rich-text-editor"
import { AdminShell } from "@/components/admin-shell"
import { getBlogPostById, updateBlogPost, deleteBlogPost } from "@/lib/firestore"
import { uploadImage } from "@/lib/storage"
import { categories } from "@/lib/data"
import { toast } from "sonner"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return (
    <AdminShell>
      <EditPostContent params={params} />
    </AdminShell>
  )
}

function EditPostContent({ params }: EditPostPageProps) {
  const { id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null)
  const [featured, setFeatured] = useState(false)
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getBlogPostById(id).then((post) => {
      if (!post) {
        toast.error("Post not found")
        router.push("/gsa")
        return
      }
      setTitle(post.title)
      setSlug(post.slug)
      setExcerpt(post.excerpt)
      setContent(post.content)
      setCategory(post.category)
      setFeaturedImage(post.featuredImage)
      setFeatured(post.featured ?? false)
      setSeoTitle(post.seoTitle)
      setSeoDescription(post.seoDescription)
      setSeoKeywords(post.seoKeywords.join(", "))
      setLoading(false)
    })
  }, [id, router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFeaturedImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setFeaturedImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let imageUrl = featuredImage || ""
      if (featuredImageFile) {
        const ext = featuredImageFile.name.split(".").pop() ?? "jpg"
        imageUrl = await uploadImage(featuredImageFile, `blog/${slug}/featured_${Date.now()}.${ext}`)
      }

      await updateBlogPost(id, {
        title, slug, excerpt, content, category,
        featuredImage: imageUrl,
        featured,
        seoTitle,
        seoDescription,
        seoKeywords: seoKeywords.split(",").map((k) => k.trim()).filter(Boolean),
      })
      toast.success("Post updated!")
      router.push("/gsa")
    } catch {
      toast.error("Failed to update post")
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return
    try {
      await deleteBlogPost(id)
      toast.success("Post deleted")
      router.push("/gsa")
    } catch {
      toast.error("Failed to delete post")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/gsa">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Post</h1>
            <p className="text-muted-foreground text-sm mt-1">Update your blog post</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Info */}
            <section className="bg-background border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text" id="title" value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium mb-2">URL Slug</label>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground px-4 py-3 bg-muted border border-r-0 border-border rounded-l-lg">
                      /blog/
                    </span>
                    <input
                      type="text" id="slug" value={slug}
                      // Normalize to lowercase/hyphens as they type, but don't trim a trailing
                      // hyphen until blur — doing it on every keystroke would collapse "hello "
                      // back to "hello" before the next word is typed, merging words together.
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))}
                      onBlur={(e) => setSlug(e.target.value.replace(/-{2,}/g, "-").replace(/(^-|-$)/g, ""))}
                      className="flex-1 px-4 py-3 border border-border rounded-r-lg focus:border-foreground focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">Category *</label>
                  <div className="relative">
                    <select
                      id="category" value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors appearance-none bg-background"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium mb-2">Excerpt *</label>
                  <textarea
                    id="excerpt" value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Homepage Visibility */}
            <section className="bg-background border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4" style={{ color: "#fee11b" }} />
                    <h2 className="text-lg font-semibold">Featured Post</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Featured posts appear in the News &amp; Insights section on the homepage
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${
                    featured ? "bg-[#01255f]" : "bg-muted-foreground/30"
                  }`}
                  aria-label="Toggle featured"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      featured ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              {featured && (
                <p className="mt-3 text-xs font-medium" style={{ color: "#01255f" }}>
                  This post will appear on the homepage
                </p>
              )}
            </section>

            {/* Featured Image */}
            <section className="bg-background border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-semibold">Featured Image</h2>
              <div>
                {featuredImage ? (
                  <div className="relative">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image src={featuredImage} alt="Featured image preview" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => { setFeaturedImage(null); setFeaturedImageFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                      className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full hover:bg-background transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-muted-foreground transition-colors"
                  >
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </section>

            {/* Content */}
            <section className="bg-background border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-lg font-semibold">Content</h2>
              <RichTextEditor value={content} onChange={setContent} placeholder="Start writing your post content..." />
            </section>

            {/* SEO */}
            <section className="bg-background border border-border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold">SEO Settings</h2>
                <p className="text-sm text-muted-foreground mt-1">Optimize your post for search engines</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="seoTitle" className="block text-sm font-medium mb-2">SEO Title</label>
                  <input
                    type="text" id="seoTitle" value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{seoTitle.length}/60</p>
                </div>
                <div>
                  <label htmlFor="seoDescription" className="block text-sm font-medium mb-2">Meta Description</label>
                  <textarea
                    id="seoDescription" value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors resize-none"
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{seoDescription.length}/160</p>
                </div>
                <div>
                  <label htmlFor="seoKeywords" className="block text-sm font-medium mb-2">Keywords</label>
                  <input
                    type="text" id="seoKeywords" value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Search Preview</p>
                <div className="space-y-1">
                  <p className="text-blue-600 text-lg truncate">{seoTitle || title}</p>
                  <p className="text-green-700 text-sm truncate">gayduosa.com/blog/{slug}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{seoDescription || excerpt}</p>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleDelete}
                disabled={saving}
              >
                Delete Post
              </Button>
              <div className="flex items-center gap-4">
                <Link href="/gsa">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Update Post"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
