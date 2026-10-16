// Contact form subjects: the key is stored with each message, the label is shown to people.
export const CONTACT_SUBJECTS = {
  representation: "Talent Representation",
  partnership: "Club / Partnership Inquiry",
  brand: "Brand & Sponsorship",
  media: "Media Request",
  other: "Other",
} as const

export type ContactSubject = keyof typeof CONTACT_SUBJECTS

export type ContactStatus = "new" | "read" | "archived"

export interface ContactMessage {
  id: string
  firstName: string
  lastName: string
  email: string
  subject: ContactSubject
  message: string
  status: ContactStatus
  createdAt: string // ISO date
}

export const CONTACT_COLLECTION = "contactMessages"

// Fired in the admin panel when messages are read/archived/deleted, so the sidebar's unread badge refreshes.
export const MESSAGES_CHANGED_EVENT = "gsa:contact-messages-changed"
