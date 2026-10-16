import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { getAthleteBySlug } from "@/lib/firestore-server"
import { athletes as staticAthletes } from "@/lib/data"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// A relative athlete.image (e.g. "/athletes/foo.jpg") is a file in /public. Fetching it over
// HTTP meant hardcoding the production domain — which fails in dev, in every preview deployment
// (each gets its own domain), and apparently in this environment too. Reading it straight off
// disk has no network dependency and works identically everywhere.
//
// Images uploaded through the admin panel (Supabase storage) also come back as AVIF, which
// next/og's renderer can't decode at all ("Unsupported image type"), independent of the above.
// Normalizing everything through sharp to PNG fixes both the local and the remote case, and
// protects against any other format the admin upload might produce in future.
async function resolveImageUrl(image: string): Promise<string | null> {
  try {
    const buffer = image.startsWith("http")
      ? Buffer.from(await (await fetch(image)).arrayBuffer())
      : await readFile(path.join(process.cwd(), "public", image))
    const png = await sharp(buffer).png().toBuffer()
    return `data:image/png;base64,${png.toString("base64")}`
  } catch (err) {
    console.error("[athlete og-image] couldn't load/convert image:", image, err)
    return null
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const athlete = await getAthleteBySlug(slug).catch(
    () => staticAthletes.find((a) => a.slug === slug) ?? null
  )

  const imageUrl = athlete ? await resolveImageUrl(athlete.image) : null

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: 1200,
          height: 630,
          backgroundColor: "#01255f",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Yellow top bar */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            backgroundColor: "#fee11b",
          }}
        />

        {/* Athlete photo */}
        {imageUrl && (
          <img
            src={imageUrl}
            style={{
              width: 400,
              height: 630,
              objectFit: "cover",
              objectPosition: "top center",
              flexShrink: 0,
            }}
          />
        )}

        {/* Gradient over photo */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: imageUrl ? 320 : 0,
            width: imageUrl ? 120 : 0,
            height: 630,
            background: "linear-gradient(to right, transparent, #01255f)",
          }}
        />

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: "60px 56px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Position label */}
          <div
            style={{
              display: "flex",
              color: "#fee11b",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            {athlete?.position ?? "Athlete"}
          </div>

          {/* Name */}
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: athlete && athlete.name.length > 14 ? 62 : 76,
              fontWeight: 900,
              lineHeight: 0.88,
              textTransform: "uppercase",
              marginTop: 16,
            }}
          >
            {athlete?.name.toUpperCase() ?? "ATHLETE"}
          </div>

          {/* Team — built as one combined string, not two sibling {expr} nodes: Satori (next/og's
              renderer) requires an explicit `display` on any div with more than one child, and
              two adjacent JSX expressions count as two children even though both are text. */}
          <div
            style={{
              display: "flex",
              color: "rgba(255,255,255,0.55)",
              fontSize: 22,
              marginTop: 16,
            }}
          >
            {`${athlete?.team ?? ""}${athlete?.nationality ? ` · ${athlete.nationality}` : ""}`}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 36, marginTop: "auto" }}>
            {[
              { v: athlete?.stats.goals ?? 0, l: "Goals" },
              { v: athlete?.stats.assists ?? 0, l: "Assists" },
              { v: athlete?.stats.appearances ?? 0, l: "Apps" },
            ].map(({ v, l }) => (
              <div key={l} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", color: "#fee11b", fontSize: 52, fontWeight: 900, lineHeight: 1 }}>{v}</div>
                <div
                  style={{
                    display: "flex",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginTop: 6,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>

          {/* GSA branding */}
          <div
            style={{
              display: "flex",
              color: "rgba(255,255,255,0.3)",
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: 32,
            }}
          >
            Gayduo Management Agency · gayduosa.org
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
