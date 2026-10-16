"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/admin-shell"
import { createService, getServices } from "@/lib/firestore"
import { SERVICE_ICON_KEYS, resolveServiceIcon, DEFAULT_SERVICE_ICON } from "@/lib/service-icons"
import { toast } from "sonner"

export default function NewServicePage() {
  return (
    <AdminShell>
      <ServiceForm />
    </AdminShell>
  )
}

function ServiceForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [titleLine1, setTitleLine1] = useState("")
  const [titleLine2, setTitleLine2] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState(DEFAULT_SERVICE_ICON)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // New services are appended to the end of the list.
      const existing = await getServices().catch(() => [])
      const order = existing.length > 0 ? Math.max(...existing.map((s) => s.order)) + 1 : 0

      await createService({
        title: [titleLine1.trim().toUpperCase(), titleLine2.trim().toUpperCase()],
        description: description.trim(),
        icon,
        order,
      })
      toast.success("Service added")
      router.push("/gsa/services")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save service")
      setSaving(false)
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="w-full">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/gsa/services">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Add Service</h1>
            <p className="text-muted-foreground text-sm mt-1">Appears on /services and the homepage</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-background border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold">Card Title</h2>
            <p className="text-sm text-muted-foreground -mt-4">
              The title splits across two lines on the card — e.g. &ldquo;TRANSFER&rdquo; / &ldquo;GUIDANCE&rdquo;.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Line 1 (small, top) *</label>
                <input type="text" value={titleLine1} onChange={(e) => setTitleLine1(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors"
                  placeholder="e.g. TRANSFER" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Line 2 (bold, bottom) *</label>
                <input type="text" value={titleLine2} onChange={(e) => setTitleLine2(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors"
                  placeholder="e.g. GUIDANCE" required />
              </div>
            </div>
          </section>

          <section className="bg-background border border-border rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-sm text-muted-foreground mt-1">Shown on the dedicated /services page (not the homepage teaser cards).</p>
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5}
              className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors resize-none"
              placeholder="Describe this service..." required />
          </section>

          <section className="bg-background border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Icon</h2>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {SERVICE_ICON_KEYS.map((key) => {
                const Icon = resolveServiceIcon(key)
                const active = icon === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    title={key}
                    className="flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 transition-colors"
                    style={active
                      ? { borderColor: "#01255f", backgroundColor: "#01255f", color: "#fee11b" }
                      : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                    }
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                    <span className="text-[0.6rem] leading-tight text-center truncate w-full">{key}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <div className="flex items-center justify-end gap-4">
            <Link href="/gsa/services">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Service"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
