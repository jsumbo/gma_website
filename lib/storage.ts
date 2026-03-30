import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
)

const BUCKET = "images"
const MAX_FILE_MB = 50
const UPLOAD_TIMEOUT_MS = 5 * 60 * 1000

export async function uploadImage(file: File, path: string): Promise<string> {
  const sizeMB = file.size / (1024 * 1024)
  if (sizeMB > MAX_FILE_MB) {
    throw new Error(`File is ${sizeMB.toFixed(1)} MB — maximum allowed size is ${MAX_FILE_MB} MB.`)
  }

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Upload timed out. Check your connection and try again.")), UPLOAD_TIMEOUT_MS)
  )

  const uploadPromise = supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true })
    .then(({ error }) => {
      if (error) throw new Error(error.message)
    })

  await Promise.race([uploadPromise, timeoutPromise])

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
