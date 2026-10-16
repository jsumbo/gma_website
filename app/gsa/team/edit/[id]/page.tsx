"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/admin-shell"
import { getTeamMemberById, updateTeamMember } from "@/lib/firestore"
import { uploadImage } from "@/lib/storage"
import { avatarUrl } from "@/lib/team"
import { toast } from "sonner"

export default function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <AdminShell>
      <TeamMemberForm id={id} />
    </AdminShell>
  )
}

function TeamMemberForm({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingMsg, setSavingMsg] = useState("")

  const [name, setName] = useState("")
  const [role, setRole] = useState("")

  // photoPreview is either the member's existing photo URL, a fresh data: URL from a just-picked
  // file, or null (no photo — fall back to the generated avatar). photoRemoved tracks whether an
  // existing photo was explicitly cleared, since "no change" and "remove it" look the same locally.
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoRemoved, setPhotoRemoved] = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getTeamMemberById(id)
      .then((member) => {
        if (!member) {
          toast.error("Team member not found")
          router.push("/gsa/team")
          return
        }
        setName(member.name)
        setRole(member.role)
        setPhotoPreview(member.photo || null)
      })
      .catch(() => toast.error("Failed to load team member"))
      .finally(() => setLoading(false))
  }, [id, router])

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoRemoved(false)
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const clearPhoto = () => {
    setPhotoPreview(null)
    setPhotoFile(null)
    setPhotoRemoved(true)
    if (photoRef.current) photoRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let photoUrl: string | undefined
      if (photoFile) {
        setSavingMsg("Uploading photo...")
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "member"
        const ext = photoFile.name.split(".").pop() ?? "jpg"
        photoUrl = await uploadImage(photoFile, `team/${slug}/photo_${Date.now()}.${ext}`)
      }

      setSavingMsg("Saving...")
      await updateTeamMember(id, {
        name: name.trim(),
        role: role.trim(),
        // A new upload wins; an explicit removal clears it back to the generated avatar;
        // otherwise leave whatever photo is already stored untouched.
        ...(photoUrl ? { photo: photoUrl } : photoRemoved ? { photo: "" } : {}),
      })
      toast.success("Team member updated")
      router.push("/gsa/team")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save team member")
      setSaving(false)
      setSavingMsg("")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="w-full">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/gsa/team">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Team Member</h1>
            <p className="text-muted-foreground text-sm mt-1">Appears on /team</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-background border border-border rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Photo</label>
              <p className="text-xs text-muted-foreground mb-3">
                Optional — if there&apos;s no photo, a generated avatar is used instead.
              </p>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element -- either a data:/stored photo URL or a dynamically generated external SVG */}
                  <img
                    src={photoPreview || avatarUrl(name || "preview")}
                    alt="Preview"
                    className="h-20 w-20 rounded-full object-cover"
                    style={{ backgroundColor: "#fee11b" }}
                  />
                  {photoPreview && (
                    <button type="button" onClick={clearPhoto}
                      className="absolute -top-1 -right-1 p-1 bg-background border border-border rounded-full shadow hover:bg-muted transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => photoRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5" />
                  {photoPreview ? "Replace Photo" : "Upload Photo"}
                </Button>
                <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors"
                placeholder="e.g. Jallah Sumbo" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role / Title *</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors"
                placeholder="e.g. Founder" required />
            </div>
          </section>

          <div className="flex items-center justify-end gap-4">
            <Link href="/gsa/team">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? (savingMsg || "Saving...") : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
