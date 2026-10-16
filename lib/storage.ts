import { auth } from "./auth"

const MAX_FILE_MB = 50
// Abort only when an upload stops making progress, so large videos on slow connections still finish.
const STALL_TIMEOUT_MS = 60 * 1000
const MAX_IMAGE_PX = 2000
const IMAGE_QUALITY = 0.85
const CONCURRENCY = 3

// Phone photos are often 5–15 MB. Downscaling to 2000px and re-encoding cuts them to a few hundred KB
// with no visible difference on the site. Anything the browser can't decode (e.g. HEIC in Chrome) is uploaded as-is.
async function shrinkImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)) return file
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
    const scale = Math.min(1, MAX_IMAGE_PX / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const toBlob = (type: string) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, IMAGE_QUALITY))
    let blob = await toBlob("image/webp")
    // Older Safari can't encode WebP and silently returns PNG; JPEG is fine unless the source has transparency.
    if (blob?.type !== "image/webp") blob = file.type === "image/png" ? null : await toBlob("image/jpeg")
    if (!blob || blob.size >= file.size) return file

    const ext = blob.type === "image/webp" ? "webp" : "jpg"
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + "." + ext, { type: blob.type })
  } catch {
    return file
  }
}

function putWithProgress(url: string, file: File, onProgress?: (fraction: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    let stallTimer: ReturnType<typeof setTimeout>
    const armStallTimer = () => {
      clearTimeout(stallTimer)
      stallTimer = setTimeout(() => {
        xhr.abort()
        reject(new Error("Upload stalled. Check your connection and try again."))
      }, STALL_TIMEOUT_MS)
    }

    xhr.open("PUT", url)
    xhr.setRequestHeader("content-type", file.type || "application/octet-stream")
    xhr.setRequestHeader("cache-control", "max-age=3600")
    xhr.setRequestHeader("x-upsert", "true")
    xhr.setRequestHeader("apikey", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!)
    xhr.upload.onprogress = (e) => {
      armStallTimer()
      if (e.lengthComputable) onProgress?.(e.loaded / e.total)
    }
    xhr.onload = () => {
      clearTimeout(stallTimer)
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else reject(new Error(`Upload failed (${xhr.status}): ${xhr.responseText.slice(0, 200)}`))
    }
    xhr.onerror = () => {
      clearTimeout(stallTimer)
      reject(new Error("Upload failed. Check your connection and try again."))
    }
    armStallTimer()
    xhr.send(file)
  })
}

export async function uploadImage(
  original: File,
  path: string,
  onProgress?: (fraction: number) => void
): Promise<string> {
  const file = await shrinkImage(original)
  const sizeMB = file.size / (1024 * 1024)
  if (sizeMB > MAX_FILE_MB) {
    throw new Error(`File is ${sizeMB.toFixed(1)} MB — maximum allowed size is ${MAX_FILE_MB} MB.`)
  }
  if (file !== original) path = path.replace(/\.[^./]+$/, "") + file.name.slice(file.name.lastIndexOf("."))

  const token = await auth.currentUser?.getIdToken()
  if (!token) throw new Error("Your session has expired. Sign in again.")

  const res = await fetch("/api/upload-url", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ path }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? `Could not start upload (${res.status})`)

  await putWithProgress(data.signedUrl, file, onProgress)
  return data.publicUrl
}

// Uploads several files a few at a time. onProgress reports files finished and overall percent.
export async function uploadMany(
  items: { file: File; path: string }[],
  onProgress?: (done: number, percent: number) => void
): Promise<string[]> {
  const urls: string[] = new Array(items.length)
  const fractions = new Array(items.length).fill(0)
  let done = 0
  let next = 0
  const report = () =>
    onProgress?.(done, Math.round((fractions.reduce((a, b) => a + b, 0) / items.length) * 100))

  const worker = async () => {
    while (next < items.length) {
      const i = next++
      urls[i] = await uploadImage(items[i].file, items[i].path, (f) => {
        fractions[i] = f
        report()
      })
      fractions[i] = 1
      done++
      report()
    }
  }

  report()
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker))
  return urls
}
