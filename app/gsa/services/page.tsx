"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, MoreHorizontal, Sparkles, ArrowUp, ArrowDown } from "lucide-react"
import { getServices, deleteService, updateService } from "@/lib/firestore"
import type { Service } from "@/lib/data"
import { resolveServiceIcon } from "@/lib/service-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminShell } from "@/components/admin-shell"
import { toast } from "sonner"

export default function ServicesAdminPage() {
  return (
    <AdminShell>
      <ServicesContent />
    </AdminShell>
  )
}

function ServicesContent() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [reordering, setReordering] = useState(false)

  const load = async () => {
    try {
      setItems(await getServices())
    } catch {
      toast.error("Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (service: Service) => {
    if (!confirm(`Delete "${service.title.join(" ")}"? This cannot be undone.`)) return
    try {
      await deleteService(service.id)
      setItems((prev) => prev.filter((s) => s.id !== service.id))
      toast.success("Service deleted")
    } catch {
      toast.error("Failed to delete service")
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
        updateService(a.id, { order: b.order }),
        updateService(b.id, { order: a.order }),
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
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {loading ? "Loading..." : `${items.length} service${items.length !== 1 ? "s" : ""} — shown on /services and the homepage`}
            </p>
          </div>
          <Link href="/gsa/services/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-background border border-border rounded-lg p-16 text-center">
            <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No services yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Add your first service to get started. Until you do, the site shows its built-in fallback copy.
            </p>
            <Link href="/gsa/services/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Service
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-background border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Order
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Service
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Description
                  </th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((service, i) => {
                  const Icon = resolveServiceIcon(service.icon)
                  return (
                    <tr key={service.id} className="hover:bg-muted/30 transition-colors">
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
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                            style={{ backgroundColor: "#01255f" }}
                          >
                            <Icon className="h-5 w-5" style={{ color: "#fee11b" }} />
                          </div>
                          <p className="font-semibold text-sm">{service.title[0]} {service.title[1]}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
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
                              <Link href={`/gsa/services/edit/${service.id}`} className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive flex items-center gap-2"
                              onClick={() => handleDelete(service)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
