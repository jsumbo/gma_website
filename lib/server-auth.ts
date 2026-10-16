import "server-only"
import { createClient } from "@supabase/supabase-js"

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

// Checks a Firebase ID token by reading the caller's own admins/{uid} doc through the Firestore REST API.
// Firestore verifies the token signature, and the security rules only allow that read for the matching uid,
// so a 200 means "valid token AND listed admin" without needing firebase-admin on the server.
export async function isAdminToken(idToken: string | undefined | null): Promise<boolean> {
  if (!idToken || !PROJECT_ID) return false
  let uid: string | undefined
  try {
    uid = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString()).user_id
  } catch {
    return false
  }
  if (!uid || !/^[\w-]+$/.test(uid)) return false

  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/admins/${uid}`,
    { headers: { authorization: `Bearer ${idToken}` }, cache: "no-store" }
  )
  return res.ok
}

export function bearerToken(request: Request) {
  return request.headers.get("authorization")?.replace(/^Bearer /, "") ?? null
}

// Server-only Supabase client with the secret key (bypasses row-level security). Never import client-side.
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SECRET_KEY
  if (!key) return null
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false } })
}
