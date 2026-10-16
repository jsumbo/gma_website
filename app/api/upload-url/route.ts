import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const BUCKET = "images"
const ALLOWED_PREFIXES = ["athletes/", "blog/", "team/"]
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

// Checks the caller's Firebase ID token by reading their own admins/{uid} doc through the Firestore REST API.
// Firestore verifies the token signature, and the security rules only allow that read for the matching uid,
// so a 200 means "valid token AND listed admin" without needing firebase-admin on the server.
async function isAdmin(idToken: string): Promise<boolean> {
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

export async function POST(request: Request) {
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!secretKey || !PROJECT_ID) {
    return NextResponse.json({ error: "Uploads are not configured on the server." }, { status: 500 })
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer /, "")
  if (!token || !(await isAdmin(token))) {
    return NextResponse.json({ error: "Not authorized. Sign in again." }, { status: 401 })
  }

  const { path } = await request.json().catch(() => ({}))
  if (
    typeof path !== "string" ||
    path.length > 300 ||
    path.includes("..") ||
    !ALLOWED_PREFIXES.some((p) => path.startsWith(p))
  ) {
    return NextResponse.json({ error: "Invalid upload path." }, { status: 400 })
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    auth: { persistSession: false },
  })
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path, { upsert: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  return NextResponse.json({ signedUrl: data.signedUrl, publicUrl })
}
