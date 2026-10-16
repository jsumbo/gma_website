"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Users } from "lucide-react"
import { getAthletes, deleteAthlete } from "@/lib/firestore"
import type { Athlete } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/admin-shell"
import { AdminManageMenu } from "@/components/admin-manage-menu"
import { toast } from "sonner"
import { useConfirm } from "@/components/confirm-dialog"

export default function TalentAdminPage() {
  return (
    <AdminShell>
      <TalentContent />
    </AdminShell>
  )
}

function TalentContent() {
  const [roster, setRoster] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)

  const loadRoster = async () => {
    try {
      const data = await getAthletes()
      setRoster(data)
    } catch {
      toast.error("Failed to load talent")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoster()
  }, [])

  const confirm = useConfirm()

  const handleDelete = async (person: Athlete) => {
    if (!(await confirm({ title: `Remove ${person.name} from the roster?`, confirmLabel: "Remove" }))) return
    try {
      await deleteAthlete(person.id)
      setRoster((prev) => prev.filter((a) => a.id !== person.id))
      toast.success(`${person.name} removed from roster`)
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Talent</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {loading ? "Loading..." : `${roster.length} on the roster`}
            </p>
          </div>
          <Link href="/gsa/talent/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Talent
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
          </div>
        ) : roster.length === 0 ? (
          <div className="bg-background border border-border rounded-lg p-16 text-center">
            <Users className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No talent yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Add your first athlete, creator, or model to get started.
            </p>
            <Link href="/gsa/talent/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Talent
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roster.map((person) => (
              <TalentCard key={person.id} person={person} onDelete={() => handleDelete(person)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TalentCard({ person, onDelete }: { person: Athlete; onDelete: () => void }) {
  const area = person.area ?? "Athlete"
  const isAthlete = area === "Athlete"

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-background">
      <div className="relative aspect-4/5 bg-muted">
        {person.image && (
          <Image
            src={person.image}
            alt={person.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top"
          />
        )}
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium">
          {area}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold">{person.name}</h3>
        {isAthlete && (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              {[person.position, person.team].filter(Boolean).join(" · ") || "—"}
            </p>
            {person.nationality && <p className="text-sm text-muted-foreground">{person.nationality}</p>}
            <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
              <span><strong className="text-foreground">{person.stats.goals}</strong> G</span>
              <span><strong className="text-foreground">{person.stats.assists}</strong> A</span>
              <span><strong className="text-foreground">{person.stats.appearances}</strong> Apps</span>
            </div>
          </>
        )}

        <div className="mt-auto pt-5">
          <AdminManageMenu
            editHref={`/gsa/talent/edit/${person.id}`}
            // Only athletes have their own profile page; creators and models appear on the /talent roster.
            viewPath={isAthlete ? `/talent/${person.slug}` : "/talent"}
            shareText={isAthlete ? `${person.name}, ${person.position} at ${person.team}` : person.name}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  )
}
