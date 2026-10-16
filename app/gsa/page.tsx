"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Lock,
  Star,
} from "lucide-react"
import { getBlogPosts, deleteBlogPost } from "@/lib/firestore"
import type { BlogPost } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminShell } from "@/components/admin-shell"
import { signIn, useAdminUser } from "@/lib/auth"
import { toast } from "sonner"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // On success, useAdminUser in AdminPage picks up the new user and swaps in the dashboard.
      await signIn(email.trim(), password)
    } catch (err) {
      const code = (err as { code?: string }).code
      setError(
        code === "auth/too-many-requests"
          ? "Too many attempts. Wait a few minutes and try again."
          : code === "auth/network-request-failed"
            ? "Network error. Check your connection."
            : "Invalid email or password"
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6">
      <div className="w-full max-w-md">
        <div className="bg-background border border-border p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-foreground text-background rounded-full mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Login</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 border border-destructive/20">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                placeholder="Enter password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function BlogDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const loadPosts = async () => {
    try {
      const data = await getBlogPosts()
      setPosts(data)
    } catch {
      toast.error("Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    try {
      await deleteBlogPost(post.id)
      setPosts((prev) => prev.filter((p) => p.id !== post.id))
      toast.success("Post deleted")
    } catch {
      toast.error("Failed to delete post")
    }
  }

  return (
    <AdminShell>
      <main className="p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Blog Posts</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {loading ? "Loading..." : `${posts.length} post${posts.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <Link href="/gsa/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-background border border-border rounded-lg p-16 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No posts yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Create your first blog post to get started.</p>
              <Link href="/gsa/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border bg-background">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Post
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Category
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Date
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Featured
                    </th>
                    <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-sm truncate max-w-xs">
                              {post.title}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate max-w-xs">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {post.featured ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "#fee11b" }}>
                            <Star className="h-3.5 w-3.5 fill-current" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${post.slug}`} className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/gsa/edit/${post.id}`} className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive flex items-center gap-2"
                              onClick={() => handleDelete(post)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </AdminShell>
  )
}

export default function AdminPage() {
  const { user, loading } = useAdminUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <BlogDashboard />
}
