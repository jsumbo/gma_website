import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"

const SITE_EMAIL = "info@gayduoma.com"
const SITE_NAME = "Gayduo Management Agency"

const SUBJECTS = {
  representation: "Talent Representation",
  partnership: "Club / Partnership Inquiry",
  brand: "Brand & Sponsorship",
  media: "Media Request",
  other: "Other",
} as const

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

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    // No mail server configured. In dev, print the message so the flow can be tested; in production, fail loudly.
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact] SMTP not configured — message NOT sent:\n", mail.text)
      return NextResponse.json({ ok: true, dev: true })
    }
    console.error("[contact] SMTP_HOST / SMTP_USER / SMTP_PASS are not set; enquiry was dropped.")
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
    return NextResponse.json({ error: "We couldn't send your message. Please try again or email us directly." }, { status: 502 })
  }
}
