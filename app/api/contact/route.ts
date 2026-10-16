import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"
import { CONTACT_COLLECTION, CONTACT_SUBJECTS } from "@/lib/contact"

const SITE_EMAIL = "info@gayduoma.com"
const SITE_NAME = "Gayduo Management Agency"

const SUBJECTS = CONTACT_SUBJECTS

const schema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  subject: z.enum(Object.keys(SUBJECTS) as [keyof typeof SUBJECTS, ...(keyof typeof SUBJECTS)[]]),
  message: z.string().trim().min(10).max(5000),
  // Honeypot: real users never see or fill this field.
  website: z.string().max(0).optional(),
})

// Best-effort throttle. Serverless instances don't share memory, so this only blunts bursts, not a determined attacker.
const hits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_HITS = 5

function tooMany(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_HITS
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

// Saves the enquiry to Firestore over REST. Firestore rules allow public *create* on this collection
// only with exactly these fields and size limits (see firestore.rules); only admins can read it.
async function saveMessage(data: z.infer<typeof schema>): Promise<boolean> {
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!project || !key) return false
  const str = (v: string) => ({ stringValue: v })
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/${CONTACT_COLLECTION}?key=${key}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fields: {
            firstName: str(data.firstName),
            lastName: str(data.lastName),
            email: str(data.email),
            subject: str(data.subject),
            message: str(data.message),
            status: str("new"),
            createdAt: { timestampValue: new Date().toISOString() },
          },
        }),
        signal: AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) console.error("[contact] Firestore save failed:", res.status, await res.text())
    return res.ok
  } catch (err) {
    console.error("[contact] Firestore save failed:", err)
    return false
  }
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    // A filled honeypot lands here too; answer like a success so bots learn nothing.
    if ((body as { website?: string })?.website) return NextResponse.json({ ok: true })
    return NextResponse.json({ error: "Please check the highlighted fields and try again." }, { status: 400 })
  }
  const data = parsed.data

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  if (tooMany(ip)) {
    return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 })
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = process.env
  const label = SUBJECTS[data.subject]
  const fullName = `${data.firstName} ${data.lastName}`
  const mail = {
    from: CONTACT_FROM || `${SITE_NAME} Website <${SMTP_USER ?? SITE_EMAIL}>`,
    to: CONTACT_TO || SITE_EMAIL,
    replyTo: `${fullName} <${data.email}>`,
    subject: `[Website] ${label} — ${fullName}`.replace(/[\r\n]+/g, " "),
    text: `${label}\n\nFrom: ${fullName} <${data.email}>\n\n${data.message}`,
    html: `<p><strong>${esc(label)}</strong></p><p>From: ${esc(fullName)} &lt;${esc(data.email)}&gt;</p><p style="white-space:pre-wrap">${esc(data.message)}</p>`,
  }

  const saved = await saveMessage(data)

  // Email is a bonus notification; the saved message in the admin panel is the record.
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    if (saved) return NextResponse.json({ ok: true })
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] Not saved and SMTP not configured — message NOT delivered:\n", mail.text)
      return NextResponse.json({ ok: true, dev: true })
    }
    console.error("[contact] Could not save and SMTP is not configured; enquiry was dropped.")
    return NextResponse.json({ error: "Our contact form is temporarily unavailable." }, { status: 503 })
  }

  try {
    const port = Number(SMTP_PORT) || 465
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
    await transporter.sendMail(mail)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[contact] send failed:", err)
    if (saved) return NextResponse.json({ ok: true })
    return NextResponse.json({ error: "We couldn't send your message. Please try again or email us directly." }, { status: 502 })
  }
}
