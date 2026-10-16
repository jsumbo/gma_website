"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { FIRESTORE_TAG } from "@/lib/firestore-server"

// Called after admin edits so the public pages show changes right away instead of after the 60s cache window.
// Harmless if called by anyone: it only makes the next page view refetch from Firestore.
export async function refreshSiteData() {
  revalidateTag(FIRESTORE_TAG, { expire: 0 })
  revalidatePath("/", "layout")
}
