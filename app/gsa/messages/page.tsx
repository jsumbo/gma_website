"use client"

import { useEffect, useMemo, useState } from "react"
import { Archive, ArchiveRestore, Inbox, Mail, Reply, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { AdminShell } from "@/components/admin-shell"
import { Button } from "@/components/ui/button"
import { useConfirm } from "@/components/confirm-dialog"
import { deleteContactMessage, getContactMessages, setContactMessageStatus } from "@/lib/firestore"
import { CONTACT_SUBJECTS, MESSAGES_CHANGED_EVENT, type ContactMessage, type ContactStatus } from "@/lib/contact"

type Filter = "inbox" | "new" | "archived"

const FILTERS: { value: Filter; label: string }[] = [
  { value: "inbox", label: "Inbox" },
  { value: "new", label: "Unread" },
  { value: "archived", label: "Archived" },
]

export default function MessagesAdminPage() {
  return (
    <AdminShell>
      <MessagesContent />
    </AdminShell>
  )
}

function formatDate(iso: string) {
  if (!iso) return ""
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
}

function MessagesContent() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>("inbox")
  const [openId, setOpenId] = useState<string | null>(null)
  const confirm = useConfirm()

  useEffect(() => {
    getContactMessages()
      .then(setMessages)
      .catch(() => toast.error("Failed to load messages"))
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(
    () =>
      messages.filter((m) =>
        filter === "archived" ? m.status === "archived" : filter === "new" ? m.status === "new" : m.status !== "archived"
      ),
    [messages, filter]
  )
  const unread = messages.filter((m) => m.status === "new").length

  const setStatus = async (m: ContactMessage, status: ContactStatus, quiet = false) => {
    if (m.status === status) return
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, status } : x)))
    try {
      await setContactMessageStatus(m.id, status)
      window.dispatchEvent(new Event(MESSAGES_CHANGED_EVENT))
      if (!quiet) toast.success(status === "archived" ? "Archived" : status === "new" ? "Marked as unread" : "Moved to inbox")
    } catch {
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: m.status } : x)))
      toast.error("Couldn't update the message")
    }
  }

  const toggleOpen = (m: ContactMessage) => {
    const opening = openId !== m.id
    setOpenId(opening ? m.id : null)
    if (opening && m.status === "new") setStatus(m, "read", true)
  }

  const handleDelete = async (m: ContactMessage) => {
    if (!(await confirm({ title: `Delete the message from ${m.firstName} ${m.lastName}?` }))) return
    try {
      await deleteContactMessage(m.id)
      setMessages((prev) => prev.filter((x) => x.id !== m.id))
      window.dispatchEvent(new Event(MESSAGES_CHANGED_EVENT))
      toast.success("Message deleted")
    } catch {
      toast.error("Failed to delete message")
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {loading ? "Loading..." : `${unread} unread · from the contact form on /contact`}
          </p>
        </div>

        <div className="mb-5 flex gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              type="button"
              size="sm"
              variant={filter === f.value ? "default" : "outline"}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              {f.value === "new" && unread > 0 && (
                <span className="ml-1.5 rounded-full bg-[#fee11b] px-1.5 text-[0.65rem] font-bold text-[#01255f]">{unread}</span>
              )}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full" />
          </div>
        ) : visible.length === 0 ? (
          <div className="bg-background border border-border rounded-lg p-16 text-center">
            <Inbox className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">
              {filter === "archived" ? "No archived messages" : filter === "new" ? "No unread messages" : "No messages yet"}
            </h3>
            <p className="text-sm text-muted-foreground">Messages sent through the contact form appear here.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((m) => {
              const open = openId === m.id
              const isNew = m.status === "new"
              const subjectLabel = CONTACT_SUBJECTS[m.subject] ?? m.subject
              const replyHref = `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${subjectLabel}`)}`
              return (
                <li key={m.id} className="rounded-lg border border-border bg-background">
                  <button
                    type="button"
                    onClick={() => toggleOpen(m)}
                    className="flex w-full items-start gap-4 p-5 text-left"
                    aria-expanded={open}
                  >
                    <span
                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: isNew ? "#fee11b" : "transparent", boxShadow: isNew ? "0 0 0 1px #01255f33" : "none" }}
                      aria-label={isNew ? "Unread" : undefined}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className={isNew ? "font-bold" : "font-semibold"}>
                          {m.firstName} {m.lastName}
                        </span>
                        <span className="text-sm text-muted-foreground">{m.email}</span>
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                          {subjectLabel}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDate(m.createdAt)}</span>
                      </span>
                      {!open && <span className="mt-2 block truncate text-sm text-muted-foreground">{m.message}</span>}
                    </span>
                  </button>

                  {open && (
                    <div className="border-t border-border px-5 pb-5 pt-4 sm:pl-[3.25rem]">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button asChild size="sm" className="gap-2">
                          <a href={replyHref}>
                            <Reply className="h-4 w-4" />
                            Reply by email
                          </a>
                        </Button>
                        {m.status !== "archived" ? (
                          <>
                            <Button size="sm" variant="outline" className="gap-2" onClick={() => setStatus(m, "new")}>
                              <Mail className="h-4 w-4" />
                              Mark unread
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2" onClick={() => setStatus(m, "archived")}>
                              <Archive className="h-4 w-4" />
                              Archive
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" className="gap-2" onClick={() => setStatus(m, "read")}>
                            <ArchiveRestore className="h-4 w-4" />
                            Move to inbox
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="gap-2 text-destructive" onClick={() => handleDelete(m)}>
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
