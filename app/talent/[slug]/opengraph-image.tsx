import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { getAthleteBySlug } from "@/lib/firestore-server"
import { athletes as staticAthletes } from "@/lib/data"
import { SITE_DOMAIN } from "@/lib/site"

export const size = { width: 1200, height: 630 }
// JPEG keeps a full-bleed photo small (~100–200 KB); WhatsApp and others skip large preview images.
export const contentType = "image/jpeg"

// A relative athlete.image (e.g. "/athletes/foo.jpg") is a file in /public, read straight off disk so
// it works in dev and preview deployments without knowing the domain. Uploaded images come from
// Supabase and may be AVIF/WebP/PNG; sharp handles every format.
async function loadImage(image: string): Promise<Buffer | null> {
  try {
    return image.startsWith("http")
      ? Buffer.from(await (await fetch(image)).arrayBuffer())
      : await readFile(path.join(process.cwd(), "public", image))
  } catch (err) {
    console.error("[athlete og-image] couldn't load image:", image, err)
    return null
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const athlete = await getAthleteBySlug(slug).catch(
    () => staticAthletes.find((a) => a.slug === slug) ?? null
  )

  const source = athlete?.image ? await loadImage(athlete.image) : null
  if (source) {
    try {
      // The share preview is the athlete photo alone. Profile photos are portraits, so filling the
      // 1200×630 frame means cropping; anchor to the top-centre to keep the face in view.
      const jpeg = await sharp(source)
        .rotate()
        .resize(size.width, size.height, { fit: "cover", position: "north" })
        .flatten({ background: "#ffffff" })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer()
      return new Response(new Uint8Array(jpeg), { headers: { "content-type": contentType } })
    } catch (err) {
      console.error("[athlete og-image] couldn't convert image:", athlete?.image, err)
    }
  }

  // No usable photo: a simple branded card so the link still has a preview.
  const png = await new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "0 80px",
          backgroundColor: "#01255f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", color: "white", fontSize: 76, fontWeight: 900, textTransform: "uppercase" }}>
          {athlete?.name ?? "Gayduo Management Agency"}
        </div>
        <div style={{ display: "flex", color: "#fee11b", fontSize: 22, marginTop: 24, letterSpacing: "0.14em" }}>
          {SITE_DOMAIN.toUpperCase()}
        </div>
      </div>
    ),
    size
  ).arrayBuffer()
  const jpeg = await sharp(Buffer.from(png)).jpeg({ quality: 85 }).toBuffer()
  return new Response(new Uint8Array(jpeg), { headers: { "content-type": contentType } })
}
