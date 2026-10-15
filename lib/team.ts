export interface TeamMember {
  name: string
  role: string
}

export const team: TeamMember[] = [
  { name: "Jallah Sumbo", role: "Founder" },
  { name: "Levi Martin", role: "Business Development Manager" },
  { name: "Sarabel Akinyi Odero", role: "Legal Advisor" },
  { name: "Latjor Wuon Dak", role: "Advisor, Partnership Lead" },
  { name: "Michael Sawyer", role: "Talent Manager" },
]

/** DiceBear "notionists" avatar, seeded on the person's name so it's stable across reloads. */
export function avatarUrl(name: string) {
  const seed = encodeURIComponent(name)
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=fee11b`
}
