import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { SITE_DOMAIN } from "./site"

// Shared by the talent and blog share images (opengraph-image.tsx routes).
export const OG_SIZE = { width: 1200, height: 630 }
// JPEG keeps a full-bleed photo small (~30–200 KB); WhatsApp and others skip large preview images.
export const OG_CONTENT_TYPE = "image/jpeg"

// A relative path (e.g. "/IMG_0047.jpeg") is a file in /public, read straight off disk so it works
// in dev and preview deployments without knowing the domain. Uploaded images come from Supabase
// and may be AVIF/WebP/PNG; sharp handles every format.
async function loadImage(src: string): Promise<Buffer | null> {
  try {
    return src.startsWith("http")
      ? Buffer.from(await (await fetch(src)).arrayBuffer())
      : await readFile(path.join(process.cwd(), "public", src))
  } catch (err) {
    console.error("[og-image] couldn't load image:", src, err)
    return null
  }
}

const jpegResponse = (buffer: Buffer) =>
  new Response(new Uint8Array(buffer), { headers: { "content-type": OG_CONTENT_TYPE } })

// The photo alone, cropped to 1200×630. Photos here are mostly portraits, so filling a wide frame
// means cropping; anchoring to the top-centre keeps faces in view. Falls back to a branded card.
export async function photoOgResponse(src: string | undefined, fallbackTitle: string): Promise<Response> {
  const source = src ? await loadImage(src) : null
  if (source) {
    try {
      const jpeg = await sharp(source)
        .rotate()
        .resize(OG_SIZE.width, OG_SIZE.height, { fit: "cover", position: "north" })
        .flatten({ background: "#ffffff" })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer()
      return jpegResponse(jpeg)
    } catch (err) {
      console.error("[og-image] couldn't convert image:", src, err)
    }
  }

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
        <div style={{ display: "flex", color: "white", fontSize: 64, fontWeight: 900, lineHeight: 1.05 }}>
          {fallbackTitle}
        </div>
        <div style={{ display: "flex", color: "#fee11b", fontSize: 22, marginTop: 24, letterSpacing: "0.14em" }}>
          {SITE_DOMAIN.toUpperCase()}
        </div>
      </div>
    ),
    OG_SIZE
  ).arrayBuffer()
  return jpegResponse(await sharp(Buffer.from(png)).jpeg({ quality: 85 }).toBuffer())
}
