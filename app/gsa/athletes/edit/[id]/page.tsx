"use client"

import { useState, useRef, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, X, Upload, ChevronDown, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/admin-shell"
import { getAthleteById, updateAthlete, deleteAthlete } from "@/lib/firestore"
import { uploadImage } from "@/lib/storage"
import { toast } from "sonner"

const POSITIONS = [
  "Goalkeeper", "Right Back", "Center Back", "Left Back",
  "Defensive Midfielder", "Central Midfielder", "Attacking Midfielder",
  "Right Winger", "Left Winger", "Forward", "Striker",
]

interface VideoEntry {
  label: string
  mode: "youtube" | "upload"
  url: string
  file: File | null
}

function toEmbedUrl(url: string) {
  if (url.includes("youtube.com/embed/")) return url
  const v =
    url.match(/[?&]v=([^&]+)/)?.[1] ??
    url.match(/youtu\.be\/([^?]+)/)?.[1]
  return v ? `https://www.youtube.com/embed/${v}` : url
}

function isVideoFile(file: File | null) {
  return file?.type.startsWith("video/") ?? false
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|avi|m4v)(\?|$)/i.test(url)
}

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be")
}

interface EditAthletePageProps {
  params: Promise<{ id: string }>
}

export default function EditAthletePage({ params }: EditAthletePageProps) {
  return (
    <AdminShell>
      <EditAthleteContent params={params} />
    </AdminShell>
  )
}

function EditAthleteContent({ params }: EditAthletePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingMsg, setSavingMsg] = useState("")
  const [athleteName, setAthleteName] = useState("")

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [position, setPosition] = useState("")
  const [team, setTeam] = useState("")
  const [number, setNumber] = useState("")
  const [nationality, setNationality] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [height, setHeight] = useState("")
  const [preferredFoot, setPreferredFoot] = useState("")
  const [biography, setBiography] = useState("")
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const [appearances, setAppearances] = useState("")
  const [goals, setGoals] = useState("")
  const [assists, setAssists] = useState("")
  const [cleanSheets, setCleanSheets] = useState("")
  const [achievements, setAchievements] = useState([{ year: "", title: "" }])
  const [instagram, setInstagram] = useState("")
  const [twitter, setTwitter] = useState("")
  const [facebook, setFacebook] = useState("")
  const [highlightVideos, setHighlightVideos] = useState<VideoEntry[]>([
    { label: "", mode: "youtube", url: "", file: null },
  ])
  const [gallery, setGallery] = useState<string[]>([])
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([])
  const galleryRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getAthleteById(id).then((athlete) => {
      if (!athlete) {
        toast.error("Athlete not found")
        router.push("/gsa/athletes")
        return
      }
      setAthleteName(athlete.name)
      setName(athlete.name)
      setSlug(athlete.slug)
      setPosition(athlete.position)
      setTeam(athlete.team)
      setNumber(String(athlete.number))
      setNationality(athlete.nationality)
      setDateOfBirth(athlete.dateOfBirth)
      setHeight(athlete.height)
      setPreferredFoot(athlete.preferredFoot)
      setBiography(athlete.biography)
      setMainImage(athlete.image)
      setAppearances(String(athlete.stats.appearances))
      setGoals(String(athlete.stats.goals))
      setAssists(String(athlete.stats.assists))
      setCleanSheets(String(athlete.stats.cleanSheets ?? ""))
      setAchievements(athlete.achievements.length > 0 ? athlete.achievements.map((a) => ({ ...a })) : [{ year: "", title: "" }])
      setInstagram(athlete.socialLinks.instagram ?? "")
      setTwitter(athlete.socialLinks.twitter ?? "")
      setFacebook(athlete.socialLinks.facebook ?? "")
      setGallery(athlete.gallery)
      setGalleryFiles(athlete.gallery.map(() => null))

      if (athlete.highlightVideos && athlete.highlightVideos.length > 0) {
        setHighlightVideos(athlete.highlightVideos.map((v) => ({
          label: v.label ?? "",
          mode: isYouTubeUrl(v.url) ? "youtube" : "upload",
          url: v.url,
          file: null,
        })))
      } else if (athlete.highlightVideo) {
        setHighlightVideos([{ label: "", mode: "youtube", url: athlete.highlightVideo, file: null }])
      }

      setLoading(false)
    })
  }, [id, router])

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMainImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setMainImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      setGalleryFiles((prev) => [...prev, file])
      if (file.type.startsWith("video/")) {
        setGallery((prev) => [...prev, URL.createObjectURL(file)])
      } else {
        const reader = new FileReader()
        reader.onload = (ev) => setGallery((prev) => [...prev, ev.target?.result as string])
        reader.readAsDataURL(file)
      }
    })
  }

  const removeGalleryItem = (i: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== i))
    setGalleryFiles((prev) => prev.filter((_, idx) => idx !== i))
  }

  const addAchievement = () => setAchievements((prev) => [...prev, { year: "", title: "" }])
  const removeAchievement = (i: number) => setAchievements((prev) => prev.filter((_, idx) => idx !== i))
  const updateAchievement = (i: number, field: "year" | "title", val: string) =>
    setAchievements((prev) => prev.map((a, idx) => idx === i ? { ...a, [field]: val } : a))

  const addVideo = () =>
    setHighlightVideos((prev) => [...prev, { label: "", mode: "youtube", url: "", file: null }])
  const removeVideo = (i: number) =>
    setHighlightVideos((prev) => prev.filter((_, idx) => idx !== i))
  const updateVideo = (i: number, patch: Partial<VideoEntry>) =>
    setHighlightVideos((prev) => prev.map((v, idx) => idx === i ? { ...v, ...patch } : v))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const ts = Date.now()
      const ext = (f: File) => f.name.split(".").pop() ?? "bin"

      let imageUrl = mainImage || ""
      if (mainImageFile) {
        setSavingMsg("Uploading profile photo...")
        imageUrl = await uploadImage(mainImageFile, `athletes/${slug}/profile_${ts}.${ext(mainImageFile)}`)
      }

      const galleryUrls: string[] = []
      for (let i = 0; i < gallery.length; i++) {
        const file = galleryFiles[i]
        if (file) {
          setSavingMsg(`Uploading gallery file ${i + 1} of ${gallery.length}...`)
          galleryUrls.push(await uploadImage(file, `athletes/${slug}/gallery_${ts}_${i}.${ext(file)}`))
        } else {
          galleryUrls.push(gallery[i])
        }
      }

      const videoEntries = highlightVideos.filter((v) => v.url || v.file)
      const savedVideos = []
      for (let i = 0; i < videoEntries.length; i++) {
        const v = videoEntries[i]
        if (v.mode === "upload" && v.file) {
          setSavingMsg(`Uploading video${v.label ? ` "${v.label}"` : ` ${i + 1}`}...`)
          const url = await uploadImage(v.file, `athletes/${slug}/highlight_${ts}_${i}.${ext(v.file)}`)
          savedVideos.push({ url, ...(v.label ? { label: v.label } : {}) })
        } else {
          savedVideos.push({ url: toEmbedUrl(v.url), ...(v.label ? { label: v.label } : {}) })
        }
      }

      setSavingMsg("Saving athlete...")
      await updateAthlete(id, {
        name, slug, position, team,
        number: Number(number),
        nationality, dateOfBirth, height, preferredFoot, biography,
        image: imageUrl,
        stats: {
          appearances: Number(appearances) || 0,
          goals: Number(goals) || 0,
          assists: Number(assists) || 0,
          ...(cleanSheets ? { cleanSheets: Number(cleanSheets) } : {}),
        },
        achievements: achievements.filter((a) => a.year && a.title),
        gallery: galleryUrls,
        socialLinks: {
          ...(instagram ? { instagram } : {}),
          ...(twitter ? { twitter } : {}),
          ...(facebook ? { facebook } : {}),
        },
        highlightVideos: savedVideos,
      })
      toast.success("Athlete updated!")
      router.push("/gsa/athletes")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update athlete")
      setSaving(false)
      setSavingMsg("")
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Remove ${athleteName} from the roster? This cannot be undone.`)) return
    try {
      await deleteAthlete(id)
      toast.success("Athlete removed from roster")
      router.push("/gsa/athletes")
    } catch {
      toast.error("Failed to delete athlete")
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
          <Link href="/gsa/athletes">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit Athlete</h1>
            <p className="text-muted-foreground text-sm mt-1">Update {athleteName}&apos;s profile</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-background border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors" required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">URL Slug</label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground px-4 py-3 bg-muted border border-r-0 border-border rounded-l-lg">/athletes/</span>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-4 py-3 border border-border rounded-r-lg focus:border-foreground focus:outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position *</label>
                <div className="relative">
                  <select value={position} onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors appearance-none bg-background" required>
                    <option value="">Select position</option>
                    {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Jersey Number</label>
                <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} min="1" max="99"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Club *</label>
                <input type="text" value={team} onChange={(e) => setTeam(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nationality *</label>
                <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Height</label>
                <input type="text" value={height} onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors" placeholder="e.g. 1.85m" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Foot</label>
                <div className="relative">
                  <select value={preferredFoot} onChange={(e) => setPreferredFoot(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors appearance-none bg-background">
                    <option value="">Select foot</option>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Both">Both</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Biography *</label>
              <textarea value={biography} onChange={(e) => setBiography(e.target.value)} rows={6}
                className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors resize-none" required />
            </div>
          </section>

          {/* Profile Image */}
          <section className="bg-background border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Profile Image</h2>
            {mainImage ? (
              <div className="relative w-48">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                  <Image src={mainImage} alt="Preview" fill className="object-cover" />
                </div>
                <button type="button"
                  onClick={() => { setMainImage(null); setMainImageFile(null); if (imageRef.current) imageRef.current.value = "" }}
                  className="absolute -top-2 -right-2 p-1.5 bg-background border border-border rounded-full shadow">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div onClick={() => imageRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-10 text-center cursor-pointer hover:border-muted-foreground transition-colors max-w-xs">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Click to upload profile photo</p>
              </div>
            )}
            <input ref={imageRef} type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
          </section>

          {/* Career Stats */}
          <section className="bg-background border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold">Career Statistics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Appearances", value: appearances, set: setAppearances },
                { label: "Goals", value: goals, set: setGoals },
                { label: "Assists", value: assists, set: setAssists },
                { label: "Clean Sheets", value: cleanSheets, set: setCleanSheets },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="block text-sm font-medium mb-2">{label}</label>
                  <input type="number" value={value} onChange={(e) => set(e.target.value)} min="0"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors text-center text-lg font-bold"
                    placeholder="0" />
                </div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section className="bg-background border border-border rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Achievements &amp; Honours</h2>
              <Button type="button" variant="outline" size="sm" onClick={addAchievement} className="gap-1">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
            <div className="space-y-3">
              {achievements.map((achievement, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <input type="text" value={achievement.year} onChange={(e) => updateAchievement(i, "year", e.target.value)}
                    className="w-28 shrink-0 px-3 py-2.5 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors text-sm"
                    placeholder="2025-26" />
                  <input type="text" value={achievement.title} onChange={(e) => updateAchievement(i, "title", e.target.value)}
                    className="flex-1 px-3 py-2.5 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors text-sm"
                    placeholder="e.g. League Top Scorer" />
                  {achievements.length > 1 && (
                    <button type="button" onClick={() => removeAchievement(i)}
                      className="p-2.5 text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Gallery */}
          <section className="bg-background border border-border rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Gallery</h2>
              <p className="text-sm text-muted-foreground mt-1">Photos and videos</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {gallery.map((url, i) => {
                const isVid = isVideoFile(galleryFiles[i]) || isVideoUrl(url)
                return (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    {isVid ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                        <Film className="h-8 w-8 text-white/40" />
                      </div>
                    ) : (
                      <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                    )}
                    <button type="button" onClick={() => removeGalleryItem(i)}
                      className="absolute top-1 right-1 p-1 bg-background/80 rounded-full">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )
              })}
              <div onClick={() => galleryRef.current?.click()}
                className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground transition-colors">
                <Plus className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add</span>
              </div>
            </div>
            <input ref={galleryRef} type="file" accept="image/*,video/*" multiple onChange={handleGalleryUpload} className="hidden" />
          </section>

          {/* Social Media */}
          <section className="bg-background border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Social Media</h2>
            {[
              { label: "Instagram URL", value: instagram, set: setInstagram, placeholder: "https://instagram.com/username" },
              { label: "Twitter / X URL", value: twitter, set: setTwitter, placeholder: "https://twitter.com/username" },
              { label: "Facebook URL", value: facebook, set: setFacebook, placeholder: "https://facebook.com/username" },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-2">{label}</label>
                <input type="url" value={value} onChange={(e) => set(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors"
                  placeholder={placeholder} />
              </div>
            ))}
          </section>

          {/* Highlight Videos */}
          <section className="bg-background border border-border rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Highlight Videos</h2>
                <p className="text-sm text-muted-foreground mt-1">YouTube links or direct video uploads</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addVideo} className="gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Video
              </Button>
            </div>
            <div className="space-y-4">
              {highlightVideos.map((entry, i) => (
                <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={entry.label}
                      onChange={(e) => updateVideo(i, { label: e.target.value })}
                      className="flex-1 px-3 py-2 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors text-sm"
                      placeholder="Label (optional) — e.g. Season Highlights 2025-26"
                    />
                    {highlightVideos.length > 1 && (
                      <button type="button" onClick={() => removeVideo(i)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {(["youtube", "upload"] as const).map((mode) => (
                      <label key={mode} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`video-mode-${i}`}
                          checked={entry.mode === mode}
                          onChange={() => updateVideo(i, { mode, url: "", file: null })}
                          className="accent-foreground"
                        />
                        <span className="text-sm capitalize">{mode === "youtube" ? "YouTube" : "Upload file"}</span>
                      </label>
                    ))}
                  </div>
                  {entry.mode === "youtube" ? (
                    <input
                      type="text"
                      value={entry.url}
                      onChange={(e) => updateVideo(i, { url: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-foreground focus:outline-none transition-colors text-sm"
                      placeholder="https://www.youtube.com/watch?v=... or embed URL"
                    />
                  ) : entry.file ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                      <Film className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-muted-foreground truncate">{entry.file.name}</span>
                      <button type="button" onClick={() => updateVideo(i, { file: null, url: "" })}
                        className="ml-auto shrink-0">
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-muted-foreground transition-colors block">
                      <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Click to upload video file</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          if (file.size / (1024 * 1024) > 50) {
                            toast.error(`${file.name} is too large. Maximum video size is 50 MB.`)
                            e.target.value = ""
                            return
                          }
                          updateVideo(i, { file, url: URL.createObjectURL(file) })
                        }}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline"
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleDelete} disabled={saving}>
              Delete Athlete
            </Button>
            <div className="flex items-center gap-4">
              <Link href="/gsa/athletes">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (savingMsg || "Saving...") : "Update Athlete"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
