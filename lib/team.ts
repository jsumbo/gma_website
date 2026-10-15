import type { TeamMember } from "./data"

// Static fallback, used when Firestore is unreachable or the "managementTeam" collection is
// empty. The live, editable copy lives in Firestore — manage it at /gsa/team.
export const team: TeamMember[] = [
  { id: "jallah-sumbo", name: "Jallah Sumbo", role: "Founder", order: 0 },
  { id: "levi-martin", name: "Levi Martin", role: "Business Development Manager", order: 1 },
  { id: "sarabel-akinyi-odero", name: "Sarabel Akinyi Odero", role: "Legal Advisor", order: 2 },
  { id: "latjor-wuon-dak", name: "Latjor Wuon Dak", role: "Advisor, Partnership Lead", order: 3 },
  { id: "michael-sawyer", name: "Michael Sawyer", role: "Talent Manager", order: 4 },
]

/** DiceBear "notionists" avatar, seeded on the person's name so it's stable across reloads. */
export function avatarUrl(name: string) {
  const seed = encodeURIComponent(name)
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=fee11b`
}

/** The image to actually display for a team member — their uploaded photo, or the generated avatar if none was set. */
export function teamMemberImage(member: { name: string; photo?: string }) {
  return member.photo || avatarUrl(member.name)
}
