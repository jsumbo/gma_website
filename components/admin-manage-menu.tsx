"use client"

import Link from "next/link"
import { Edit, Eye, Facebook, Link2, Linkedin, MessageCircle, Settings2, Share2, Trash2, Twitter } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SITE_URL } from "@/lib/site"

interface AdminManageMenuProps {
  editHref: string
  // Public path on the site, e.g. "/blog/my-post". Opened locally for View, shared as the live URL.
  viewPath: string
  shareText: string
  onDelete: () => void
}

// The "Manage" button at the bottom of each admin card: Edit, View, Share (social + copy) and Delete.
export function AdminManageMenu({ editHref, viewPath, shareText, onDelete }: AdminManageMenuProps) {
  // Share links always point at the live site so they work when copied from a local or preview admin.
  const shareUrl = `${SITE_URL}${viewPath}`
  const enc = encodeURIComponent

  const shareTargets = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${enc(`${shareText} ${shareUrl}`)}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}` },
    { label: "X (Twitter)", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${enc(shareUrl)}&text=${enc(shareText)}` },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}` },
  ]

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied")
    } catch {
      toast.error("Couldn't copy the link")
    }
  }

  return (
    // Non-modal so the delete confirmation dialog can open cleanly as the menu closes
    // (a modal menu closing into a modal dialog can leave the page stuck with pointer-events: none).
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Settings2 className="h-4 w-4" />
          Manage
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuItem asChild>
          <Link href={editHref} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={viewPath} target="_blank" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            {shareTargets.map(({ label, icon: Icon, href }) => (
              <DropdownMenuItem key={label} asChild>
                <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={copyLink} className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Copy link
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive flex items-center gap-2" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
