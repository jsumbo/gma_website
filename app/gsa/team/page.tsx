"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, UserCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { getTeamMembers, deleteTeamMember, updateTeamMember } from "@/lib/firestore"
import type { TeamMember } from "@/lib/data"
import { teamMemberImage } from "@/lib/team"
import { Button } from "@/components/ui/button"
import { AdminShell } from "@/components/admin-shell"
import { AdminManageMenu } from "@/components/admin-manage-menu"
import { toast } from "sonner"
import { useConfirm } from "@/components/confirm-dialog"

export default function TeamAdminPage() {
  return (
    <AdminShell>
      <TeamContent />
    </AdminShell>
  )
}

function TeamContent() {
  const [items, setItems] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [reordering, setReordering] = useState(false)

  const load = async () => {
    try {
      setItems(await getTeamMembers())
    } catch {
      toast.error("Failed to load team")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const confirm = useConfirm()

  const handleDelete = async (member: TeamMember) => {
    if (!(await confirm({ title: `Remove ${member.name} from the team page?`, confirmLabel: "Remove" }))) return
    try {
      await deleteTeamMember(member.id)
      setItems((prev) => prev.filter((m) => m.id !== member.id))
      toast.success(`${member.name} removed`)
    } catch {
      toast.error("Failed to delete team member")
    }
  }

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    setReordering(true)
    try {
      const a = items[index]
      const b = items[target]
      await Promise.all([
        updateTeamMember(a.id, { order: b.order }),
        updateTeamMember(b.id, { order: a.order }),
      ])
      const next = [...items]
      next[index] = { ...b, order: a.order }
      next[target] = { ...a, order: b.order }
      next.sort((x, y) => x.order - y.order)
      setItems(next)
    } catch {
      toast.error("Failed to reorder")
    } finally {
      setReordering(false)
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Team</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {loading ? "Loading..." : `${items.length} member${items.length !== 1 ? "s" : ""} — shown on /team`}
            </p>
          </div>
          <Link href="/gsa/team/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-background border border-border rounded-lg p-16 text-center">
            <UserCircle className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No team members yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Add your first team member to get started. Until you do, the site shows its built-in fallback list.
            </p>
            <Link href="/gsa/team/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((member, i) => (
              <div key={member.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-background">
                <div className="relative aspect-square" style={{ backgroundColor: "#fee11b" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- dynamically generated external SVG */}
                  <img src={teamMemberImage(member)} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
                  <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium">
                    #{i + 1}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>

                  <div className="mt-auto pt-5 space-y-2">
                    {/* Order on /team follows this grid, left to right. */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-1.5 text-muted-foreground"
                        disabled={reordering || i === 0}
                        onClick={() => move(i, -1)}
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Earlier
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-1.5 text-muted-foreground"
                        disabled={reordering || i === items.length - 1}
                        onClick={() => move(i, 1)}
                      >
                        Later
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <AdminManageMenu
                      editHref={`/gsa/team/edit/${member.id}`}
                      viewPath="/team"
                      shareText={`${member.name}, ${member.role} at Gayduo Management Agency`}
                      onDelete={() => handleDelete(member)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
