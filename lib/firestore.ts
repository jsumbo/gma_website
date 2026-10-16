import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  type DocumentData,
} from "firebase/firestore"
import { app } from "./firebase"
import { refreshSiteData } from "@/app/actions/refresh-site-data"
import type { Athlete, BlogPost, Service, TeamMember } from "./data"

const db = getFirestore(app)

export async function getAthletes(): Promise<Athlete[]> {
  const snap = await getDocs(collection(db, "athletes"))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Athlete))
}

export async function getAthleteById(id: string): Promise<Athlete | null> {
  const snap = await getDoc(doc(db, "athletes", id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Athlete
}

export async function getAthleteBySlug(slug: string): Promise<Athlete | null> {
  const q = query(collection(db, "athletes"), where("slug", "==", slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Athlete
}

export async function createAthlete(data: Omit<Athlete, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "athletes"), data as DocumentData)
  await refreshSiteData().catch(() => {})
  return ref.id
}

export async function updateAthlete(id: string, data: Partial<Omit<Athlete, "id">>): Promise<void> {
  await updateDoc(doc(db, "athletes", id), data as DocumentData)
  await refreshSiteData().catch(() => {})
}

export async function deleteAthlete(id: string): Promise<void> {
  await deleteDoc(doc(db, "athletes", id))
  await refreshSiteData().catch(() => {})
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const q = query(collection(db, "blogPosts"), orderBy("publishedAt", "desc"))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost))
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const featuredQ = query(
    collection(db, "blogPosts"),
    where("featured", "==", true),
    orderBy("publishedAt", "desc")
  )
  const featuredSnap = await getDocs(featuredQ)

  if (!featuredSnap.empty) {
    return featuredSnap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost))
  }

  const allQ = query(collection(db, "blogPosts"), orderBy("publishedAt", "desc"))
  const allSnap = await getDocs(allQ)
  return allSnap.docs.slice(0, 3).map((d) => ({ id: d.id, ...d.data() } as BlogPost))
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const snap = await getDoc(doc(db, "blogPosts", id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as BlogPost
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(collection(db, "blogPosts"), where("slug", "==", slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as BlogPost
}

export async function createBlogPost(data: Omit<BlogPost, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "blogPosts"), data as DocumentData)
  await refreshSiteData().catch(() => {})
  return ref.id
}

export async function updateBlogPost(id: string, data: Partial<Omit<BlogPost, "id">>): Promise<void> {
  await updateDoc(doc(db, "blogPosts", id), data as DocumentData)
  await refreshSiteData().catch(() => {})
}

export async function deleteBlogPost(id: string): Promise<void> {
  await deleteDoc(doc(db, "blogPosts", id))
  await refreshSiteData().catch(() => {})
}

export async function getServices(): Promise<Service[]> {
  const q = query(collection(db, "services"), orderBy("order", "asc"))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service))
}

export async function getServiceById(id: string): Promise<Service | null> {
  const snap = await getDoc(doc(db, "services", id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Service
}

export async function createService(data: Omit<Service, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "services"), data as DocumentData)
  await refreshSiteData().catch(() => {})
  return ref.id
}

export async function updateService(id: string, data: Partial<Omit<Service, "id">>): Promise<void> {
  await updateDoc(doc(db, "services", id), data as DocumentData)
  await refreshSiteData().catch(() => {})
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, "services", id))
  await refreshSiteData().catch(() => {})
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const q = query(collection(db, "managementTeam"), orderBy("order", "asc"))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember))
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const snap = await getDoc(doc(db, "managementTeam", id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as TeamMember
}

export async function createTeamMember(data: Omit<TeamMember, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "managementTeam"), data as DocumentData)
  await refreshSiteData().catch(() => {})
  return ref.id
}

export async function updateTeamMember(id: string, data: Partial<Omit<TeamMember, "id">>): Promise<void> {
  await updateDoc(doc(db, "managementTeam", id), data as DocumentData)
  await refreshSiteData().catch(() => {})
}

export async function deleteTeamMember(id: string): Promise<void> {
  await deleteDoc(doc(db, "managementTeam", id))
  await refreshSiteData().catch(() => {})
}
