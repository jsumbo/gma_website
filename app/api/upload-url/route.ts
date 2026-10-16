import { NextResponse } from "next/server"
import { bearerToken, isAdminToken, supabaseAdmin } from "@/lib/server-auth"

const BUCKET = "images"
const ALLOWED_PREFIXES = ["athletes/", "blog/", "team/"]
export async function POST(request: Request) {
  const supabase = supabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ error: "Uploads are not configured on the server." }, { status: 500 })
  }

  if (!(await isAdminToken(bearerToken(request)))) {
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

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path, { upsert: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  return NextResponse.json({ signedUrl: data.signedUrl, publicUrl })
}
