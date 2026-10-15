"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, MoreHorizontal, UserCircle, ArrowUp, ArrowDown } from "lucide-react"
import { getTeamMembers, deleteTeamMember, updateTeamMember } from "@/lib/firestore"
import type { TeamMember } from "@/lib/data"
import { teamMemberImage } from "@/lib/team"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminShell } from "@/components/admin-shell"
import { toast } from "sonner"

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

  const handleDelete = async (member: TeamMember) => {
    if (!confirm(`Remove ${member.name} from the team page? This cannot be undone.`)) return
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
      <div className="max-w-4xl mx-auto">
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
          <div className="overflow-x-auto rounded-lg border border-border bg-background">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Order
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Role
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((member, i) => (
                  <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={reordering || i === 0}
                          onClick={() => move(i, -1)}
                          className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={reordering || i === items.length - 1}
                          onClick={() => move(i, 1)}
                          className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element -- dynamically generated external SVG */}
                        <img
                          src={teamMemberImage(member)}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover"
                          style={{ backgroundColor: "#fee11b" }}
                        />
                        <p className="font-semibold text-sm">{member.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{member.role}</p>
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
                            <Link href={`/gsa/team/edit/${member.id}`} className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive flex items-center gap-2"
                            onClick={() => handleDelete(member)}
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
    </div>
  )
}
