import { getAthleteBySlug } from "@/lib/firestore-server"
import { athletes as staticAthletes } from "@/lib/data"
import { OG_CONTENT_TYPE, OG_SIZE, photoOgResponse } from "@/lib/og-image"

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Share preview = the talent's profile photo, cropped top-centre.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const athlete = await getAthleteBySlug(slug).catch(
    () => staticAthletes.find((a) => a.slug === slug) ?? null
  )
  return photoOgResponse(athlete?.image, athlete?.name ?? "Gayduo Management Agency")
}
