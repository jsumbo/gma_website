"use client"

import type { User } from "firebase/auth"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logOut } from "@/lib/auth"

export function NotAdminNotice({ user }: { user: User }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-6">
      <div className="w-full max-w-md bg-background border border-border p-8 sm:p-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-destructive/10 text-destructive rounded-full mb-4">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">This account isn&apos;t an admin</h1>
        <p className="text-sm text-muted-foreground mt-3">
          You&apos;re signed in as <span className="font-medium text-foreground">{user.email}</span>, but there&apos;s
          no matching document in the Firestore <code>admins</code> collection, so changes would be rejected.
        </p>
        <p className="text-sm text-muted-foreground mt-4">Create a document in <code>admins</code> with this exact Document ID:</p>
        <code className="block mt-2 p-3 bg-muted text-sm break-all select-all">{user.uid}</code>
        <div className="mt-6 flex gap-3 justify-center">
          <Button variant="outline" onClick={() => logOut()}>Sign out</Button>
          <Button onClick={() => window.location.reload()}>I&apos;ve added it — retry</Button>
        </div>
      </div>
    </div>
  )
}
