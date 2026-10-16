import "server-only"
import type { Athlete, BlogPost, Service, TeamMember } from "./data"

// Public pages read Firestore over its REST API instead of the Firebase client SDK. On the server the SDK
// keeps a long-lived gRPC stream open, and when that drops (flaky DNS, Wi‑Fi blips) it silently switches to
// "offline mode" and returns EMPTY results instead of throwing — which rendered "No talent on the roster yet."
// Plain fetch fails loudly, and Next's data cache keeps serving the last good response while it retries.
// It also runs on Cloudflare Workers, where the SDK's gRPC transport doesn't.

export const FIRESTORE_TAG = "firestore"
const REVALIDATE_SECONDS = 60
const TIMEOUT_MS = 8000

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

type FirestoreValue = {
  stringValue?: string
  integerValue?: string
  doubleValue?: number
  booleanValue?: boolean
  nullValue?: null
  timestampValue?: string
  mapValue?: { fields?: Record<string, FirestoreValue> }
  arrayValue?: { values?: FirestoreValue[] }
  referenceValue?: string
  geoPointValue?: { latitude: number; longitude: number }
}

type FirestoreDoc = { name: string; fields?: Record<string, FirestoreValue> }

function decode(v: FirestoreValue): unknown {
  if (v.stringValue !== undefined) return v.stringValue
  if (v.integerValue !== undefined) return Number(v.integerValue)
  if (v.doubleValue !== undefined) return v.doubleValue
  if (v.booleanValue !== undefined) return v.booleanValue
  if (v.timestampValue !== undefined) return v.timestampValue
  if (v.mapValue !== undefined) return decodeFields(v.mapValue.fields)
  if (v.arrayValue !== undefined) return (v.arrayValue.values ?? []).map(decode)
  if (v.referenceValue !== undefined) return v.referenceValue
  if (v.geoPointValue !== undefined) return v.geoPointValue
  return null
}

function decodeFields(fields: Record<string, FirestoreValue> = {}) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decode(v)]))
}

function toObject<T>(d: FirestoreDoc): T {
  return { id: d.name.split("/").pop()!, ...decodeFields(d.fields) } as T
}

// Collections here are small (tens of docs), so we fetch whole collections and filter/sort in JS rather than
// building structured queries — one cached request per collection, shared by every page that needs it.
async function listCollection<T>(collection: string): Promise<T[]> {
  const docs: FirestoreDoc[] = []
  let pageToken = ""
  do {
    const url = `${BASE}/${collection}?pageSize=300&key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ""}`
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [FIRESTORE_TAG] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) throw new Error(`Firestore ${collection}: ${res.status} ${await res.text()}`)
    const body: { documents?: FirestoreDoc[]; nextPageToken?: string } = await res.json()
    docs.push(...(body.documents ?? []))
    pageToken = body.nextPageToken ?? ""
  } while (pageToken)
  return docs.map((d) => toObject<T>(d))
}

const byPublishedDesc = (a: BlogPost, b: BlogPost) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
const byOrder = (a: { order: number }, b: { order: number }) => (a.order ?? 0) - (b.order ?? 0)

export function getAthletes() {
  return listCollection<Athlete>("athletes")
}

export async function getAthleteBySlug(slug: string) {
  return (await getAthletes()).find((a) => a.slug === slug) ?? null
}

export async function getBlogPosts() {
  return (await listCollection<BlogPost>("blogPosts")).filter((p) => p.publishedAt).sort(byPublishedDesc)
}

export async function getBlogPostBySlug(slug: string) {
  return (await listCollection<BlogPost>("blogPosts")).find((p) => p.slug === slug) ?? null
}

export async function getFeaturedBlogPosts() {
  const posts = await getBlogPosts()
  const featured = posts.filter((p) => p.featured)
  return featured.length ? featured : posts.slice(0, 3)
}

export async function getServices() {
  return (await listCollection<Service>("services")).sort(byOrder)
}

export async function getTeamMembers() {
  return (await listCollection<TeamMember>("managementTeam")).sort(byOrder)
}
